# Mechanism vs Rule Guide

ルールと仕組みの違いを定義し、ルールを仕組みに変換するための設計ガイド。
Keijiエージェントがメタパターン#1「無視できるか？」を判定する際の詳細リファレンス。

---

## 定義

| 概念 | 定義 | 特性 |
|------|------|------|
| **ルール** | 「〜すべき」「〜しろ」という指示 | 無視できる。従うかどうかは実行者次第 |
| **仕組み** | やらないと物理的に先に進めない構造 | 無視できない。バイパスにはコード変更が必要 |

**判定基準: 「これは無視できるか？」 → Yesならルール。Noなら仕組み。**

---

## 分類チェックリスト

新しい制約・ガードレールを設計した時、以下を順番に確認する。

| # | 質問 | Yes | No |
|---|------|-----|-----|
| 1 | CLAUDE.mdに書いてあるだけか？ | ルール | → 2へ |
| 2 | スキルファイルで定義されているだけか？ | ルール | → 3へ |
| 3 | 実行しなくても次のステップに進めるか？ | ルール | → 4へ |
| 4 | hook/CI/テストで物理ブロックされているか？ | → 仕組み | ルール |
| 5 | ブロック時に回避パス（`--no-verify`等）があるか？ | 弱い仕組み | 仕組み |

**「弱い仕組み」は仕組みとしてカウントしない。** `--no-verify`で飛ばせるpre-commitフックは実質ルールと同じ。

---

## 仕組みの設計パターン

### Pattern 1: Hook-based Blocking（PreToolUse）

settings.jsonのhookでツール使用前に介入し、条件を満たさなければブロックする。

**特徴:**
- 物理的にツール実行を阻止
- ファイル読み取り（調査系）はブロックしない（fail-open原則）
- 状態を変える操作（Write, Bash等）のみをゲート対象にする

**適用例:**
- 本番DBへの直接接続をブロック
- テスト未実行でのコミットをブロック
- OGSMなしでの作業開始をブロック

**設計時の注意:**
- デッドロック防止: hookが参照するファイル自体の編集をブロックしないこと
- 調査は止めない: Read, Grep, Glob等の読み取りツールはブロック対象外
- エラーメッセージに「何をすれば通過できるか」を明記

```javascript
// 例: OGSMゲート（状態変更のみブロック、読み取りは通す）
if (tool === 'Write' || tool === 'Bash') {
  if (!ogsmExists()) {
    return { decision: 'block', reason: '.agents/OGSM.md を作成してください' };
  }
}
// Read, Grep, Glob → 常にpass
```

### Pattern 2: Gate-based Workflow（品質ゲートフェーズ）

ワークフローを複数フェーズに分割し、各フェーズの完了条件を満たさないと次に進めない。

**特徴:**
- フェーズ間の遷移にチェックポイントを設ける
- `.context/` ファイルで状態を管理
- 各フェーズの完了を示すファイルが存在しないと次フェーズが開始できない

**適用例:**
- `/quality-gate`: Verify → Test → Push の3フェーズ
- `/implement`: Spec → Test → Build → Verify の4フェーズ

**設計時の注意:**
- 状態ファイルの場所を統一（`.context/` ディレクトリ）
- 自己修復パス: 状態ファイルが壊れた場合の復旧手順を用意

### Pattern 3: Permission-based Restriction（permissionMode）

エージェントのfrontmatterで権限を物理的に制限する。

**特徴:**
- フレームワークレベルの強制（エージェント自身が変更できない）
- read-onlyエージェントはファイル変更ツールを使えない
- plan-onlyエージェントは実行系ツールを使えない

**適用例:**
- Scout（バグ調査）: `read-only` → 調査はできるが修正はできない
- Architect（設計）: `plan-only` → 設計は出せるが実装はできない
- Sentinel（セキュリティ）: `read-only` → 検出はできるが変更はできない

**設計時の注意:**
- 権限が強すぎると仕事ができない。弱すぎるとガードにならない
- `bypassPermissions`はオーケストレーター専用。乱用禁止

### Pattern 4: File-based State（.context/ファイル）

特定のファイルの存在/内容をゲート条件として使用する。

**特徴:**
- ファイルの存在 = 条件充足の証拠
- hookがファイルの存在をチェックしてブロック/通過を判断
- 人間が直接ファイルを作成することで強制突破可能（人間オーバーライド）

**適用例:**
- `.context/ogsm.md` がないと作業開始できない
- `.context/debug-mode` があるとデバッグプロトコルが強制される
- `.agents/PROJECT.md` がないとActivity Logを記録できない

**設計時の注意:**
- 人間が `touch .context/xxx` で突破できることは意図的な設計（人間オーバーライド原則）
- AIが自分で状態ファイルを作成してバイパスするパターンを防ぐ → hookで「内容の妥当性」もチェック

---

## ルール → 仕組み変換テーブル

| ルール（無視できる） | 仕組み（無視できない） | パターン |
|---------------------|---------------------|---------|
| 「テストを書いてからコミットしろ」 | pre-commitフックでテスト未実行ならcommitブロック | Hook-based |
| 「OGSMを最初に書け」 | `.context/ogsm.md` がないとWrite/Bashをブロック | Hook + File |
| 「本番DBに直接触るな」 | 本番接続文字列を含むBashコマンドをhookでブロック | Hook-based |
| 「レビューしてからマージしろ」 | PRのapproval必須設定（GitHub Branch Protection） | Gate-based |
| 「Scoutは修正しない」 | `permissionMode: read-only` | Permission |
| 「デバッグは根本原因を特定しろ」 | `/debug`スキル+debug-guard hookで対処療法をブロック | Hook + Gate |
| 「品質チェックしてからプッシュ」 | `/quality-gate`の3フェーズ完了なしにpushブロック | Gate-based |

---

## 仕組みのテスト方法

仕組みを作ったら、以下の3つを必ずテストする。

### Test 1: デッドロックチェック

仕組み自体が仕組みをブロックしていないか。

- hookが `.context/` ファイルの作成をブロックしていないか
- 状態ファイルの初期化に必要な操作がブロック対象になっていないか
- 設定ファイル（settings.json等）の編集がブロックされていないか

**テスト方法:** クリーンな状態（.context/なし）から作業を開始し、最初の操作がブロックされないことを確認

### Test 2: Fail-Open for Reads

読み取り・調査系の操作がブロックされていないか。

- Read, Grep, Glob, git log, git diff 等は常に通過するか
- エラー調査中にhookがブロックして調査不能にならないか

**テスト方法:** 全てのゲート条件を満たしていない状態で、Read/Grep/Globを実行し、通過することを確認

### Test 3: Human Override

人間の承認で突破できるか。

- hookのブロックに対して、人間が承認（ask_user）で通過できるか
- `.context/`ファイルを手動で作成して突破できるか
- settings.jsonのhook設定自体を人間が変更できるか（blockではなくask_userにすべき）

**テスト方法:** ブロック状態で人間としてオーバーライドを試み、通過できることを確認

---

## ARISでの実例

### prod-access-guard

| 項目 | 内容 |
|------|------|
| 何を防ぐか | AIによる本番DBへの直接アクセス |
| パターン | Hook-based Blocking |
| 実装 | PreToolUse hookで接続文字列・本番ホスト名を検出しblock |
| Fail-open | Read系ツールは対象外 |
| Human override | ask_userで本番操作を承認可能 |

### ogsm-gate

| 項目 | 内容 |
|------|------|
| 何を防ぐか | 目的なしの作業開始 |
| パターン | Hook + File-based State |
| 実装 | `.context/ogsm.md` がない状態でのWrite/Bashをblock |
| Fail-open | Read/Grep/Globは常に通過 |
| Human override | 人間が `.context/ogsm.md` を作成すれば通過 |

### debug-guard

| 項目 | 内容 |
|------|------|
| 何を防ぐか | 対処療法（根本原因特定前の修正） |
| パターン | Hook + Gate-based Workflow |
| 実装 | `/debug` の各ステップ完了を `.context/debug-step-N` で追跡。Step 3（根本原因特定）未完了でのWrite/Editをblock |
| Fail-open | 調査系操作（Read, Grep, Bash(readonly)）は常に通過 |
| Human override | ask_userで「この修正は緊急対応として許可する」で通過可能 |

---

## 判断フロー: 新しい制約を設計する時

```
1. この制約は何を防ぐ？
   → 具体的な失敗シナリオを1つ以上
   
2. CLAUDE.mdに書くだけで守られるか？
   → No（AIはルールを無視する）
   
3. どのパターンが適切か？
   → 操作ブロック → Hook-based
   → フェーズ管理 → Gate-based
   → 権限制限 → Permission-based
   → 状態管理 → File-based
   
4. デッドロックしないか？
   → 仕組み自体の初期化がブロックされないか確認
   
5. 調査を止めないか？
   → Read系は常にfail-open
   
6. 人間が突破できるか？
   → ask_userまたは手動ファイル作成で通過可能
```

---

## 更新履歴

- 2026-04-06: 初版作成。CLAUDE.mdの仕組み設計原則をKeijiエージェント判定用に展開
