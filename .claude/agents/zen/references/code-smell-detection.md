# Code Smell Detection Guide

Zenがコードスメルを検出・分類するためのリファレンス。検出シグナル（grep可能なパターン）と重要度分類を含む。

---

## 1. Bloaters (肥大化)

大きくなりすぎて扱いにくくなったコード。

### Long Method (長いメソッド)
- **検出:** 40行超の関数
- **grepパターン:** ファイル内の関数境界を検出し行数カウント
- **シグナル:** コメントでブロック分割されている、ローカル変数が10個以上
- **重要度:** HIGH - 今すぐリファクタ
- **対処:** Extract Function

### Large Class (巨大クラス/モジュール)
- **検出:** 300行超のファイル、15個以上のメソッド/エクスポート
- **grepパターン:** `wc -l`, `grep -c "export function\|export const\|export class"`
- **シグナル:** ファイル名に `utils`, `helpers`, `common` が含まれる
- **重要度:** HIGH - 今すぐリファクタ
- **対処:** 責務ごとにモジュール分割

### Primitive Obsession (プリミティブ執着)
- **検出:** 関連するプリミティブ値がバラバラに渡されている
- **grepパターン:** 同じパラメータ組み合わせ (`string, string, number`) が複数関数に出現
- **シグナル:** `firstName, lastName` / `latitude, longitude` / `startDate, endDate` のペア
- **重要度:** MEDIUM - 次のスプリントで対処
- **対処:** Introduce Parameter Object, Value Object パターン

### Long Parameter List (長いパラメータリスト)
- **検出:** 4つ以上のパラメータ
- **grepパターン:** `function.*,.*,.*,.*,` (カンマ4つ以上)
- **シグナル:** 呼び出し側でパラメータ順を間違えるバグが出ている
- **重要度:** MEDIUM - 次のスプリントで対処
- **対処:** Introduce Parameter Object

### Data Clumps (データの群れ)
- **検出:** 同じフィールドグループが3箇所以上で一緒に使われている
- **grepパターン:** 同じ3つ以上の変数名が複数関数のパラメータに出現
- **シグナル:** コピペで同じ構造体を何度も定義
- **重要度:** MEDIUM - 次のスプリントで対処
- **対処:** Extract Class / Introduce Parameter Object

---

## 2. Object-Orientation Abusers (OO原則違反)

オブジェクト指向の原則が正しく適用されていない。

### Switch Statements (switch文の多用)
- **検出:** 同じ条件のswitch/if-elseが2箇所以上
- **grepパターン:** `switch\s*\(.*\.type\)`, `switch\s*\(.*\.kind\)`, `if\s*\(.*\.type\s*===`
- **シグナル:** 新しい型を追加するたびに複数ファイルを変更する必要がある
- **重要度:** HIGH - 変更頻度が高いなら今すぐ
- **対処:** Replace Conditional with Polymorphism

### Temporary Field (一時フィールド)
- **検出:** 特定の状況でしか使われないフィールド
- **grepパターン:** クラス内で `this.xxxField` が1メソッドでのみ使用
- **シグナル:** フィールドに `null` / `undefined` チェックが散在
- **重要度:** LOW - 追跡して一括対応
- **対処:** Extract Class, Introduce Null Object

### Refused Bequest (相続拒否)
- **検出:** サブクラスが親の大半のメソッドを使わない
- **grepパターン:** `extends` しているが `super.` の呼び出しがない
- **シグナル:** 親クラスのメソッドをオーバーライドして例外を投げている
- **重要度:** MEDIUM - 設計見直し
- **対処:** Push Down Method, Replace Inheritance with Delegation

### Alternative Classes with Different Interfaces (インターフェース不一致)
- **検出:** 同じ概念を表すクラスが異なるメソッド名を持つ
- **grepパターン:** 類似クラスの公開メソッドリストを比較
- **シグナル:** アダプターやラッパーが多数存在する
- **重要度:** LOW - 追跡して一括対応
- **対処:** Rename Method, Extract Superclass

---

## 3. Change Preventers (変更阻害)

変更時に多数のファイルを同時に修正する必要がある。

### Divergent Change (発散的変更)
- **検出:** 1つのクラス/モジュールが異なる理由で頻繁に変更される
- **grepパターン:** `git log --oneline <file>` で変更理由が多岐にわたる
- **シグナル:** 同一ファイルのPR説明が毎回異なる領域に言及
- **重要度:** HIGH - 今すぐリファクタ
- **対処:** Extract Class (責務分離)

### Shotgun Surgery (散弾手術)
- **検出:** 1つの概念変更で5ファイル以上を編集する必要がある
- **grepパターン:** `git log --name-only` で1コミットに含まれるファイル数
- **シグナル:** 「1箇所変えたら他も変えないと壊れる」パターン
- **重要度:** HIGH - 今すぐリファクタ
- **対処:** Move Function, Combine Functions into Class

### Parallel Inheritance Hierarchies (平行継承)
- **検出:** クラスAにサブクラスを追加すると、クラスBにも対応サブクラスが必要
- **grepパターン:** 2つの `extends` 階層のサブクラス名が対応している
- **シグナル:** `XxxHandler` と `XxxValidator` のペアが増え続ける
- **重要度:** MEDIUM - 次のスプリントで対処
- **対処:** Move Method で一方の階層を解消

---

## 4. Dispensables (不要物)

存在しなくても問題ないコード。削除すればコードがクリーンに。

### Comments (過剰コメント)
- **検出:** コードの動作を説明するコメント（WHYではなくWHAT）
- **grepパターン:** `// get`, `// set`, `// check`, `// calculate`, `// loop through`
- **シグナル:** コメントを消すとコードの意図が分からなくなる = 命名が悪い
- **重要度:** LOW - リファクタ時に併せて対応
- **対処:** Rename Variable/Function, Extract Function

### Duplicate Code (重複コード)
- **検出:** 3箇所以上の同一/類似ロジック
- **grepパターン:** 3行以上の同一コードブロックを検出
- **シグナル:** バグ修正時に「他にも同じコードないか」と検索する必要がある
- **重要度:** HIGH - 今すぐリファクタ
- **対処:** Extract Function, Pull Up Method

### Lazy Class (怠惰クラス)
- **検出:** 1-2メソッドしかないクラス/モジュール、ほぼパススルー
- **grepパターン:** `export` が1-2個のみのファイル
- **シグナル:** 将来の拡張を見越して作ったが実際には拡張されていない
- **重要度:** LOW - 追跡して一括対応
- **対処:** Inline Class, Collapse Hierarchy

### Data Class (データクラス)
- **検出:** getter/setter のみでロジックがないクラス
- **grepパターン:** `class` 定義内に `get`/`set` のみでメソッドなし
- **シグナル:** このクラスのデータを使うロジックが別クラスに集中
- **重要度:** LOW - Feature Envyと併せて対応
- **対処:** Move Function (ロジックをデータクラスに移動)

### Dead Code (デッドコード)
- **検出:** 到達不能コード、未使用エクスポート、コメントアウトされたコード
- **grepパターン:** `// `, `/* ` で始まるコードブロック、TypeScript `noUnusedLocals`
- **シグナル:** `git blame` で6ヶ月以上前のコメントアウト
- **重要度:** MEDIUM - 発見次第削除
- **対処:** Remove Dead Code

### Speculative Generality (推測的汎用性)
- **検出:** 「将来使うかも」で作られた抽象化、未使用のパラメータ/フック
- **grepパターン:** `abstract class` で実装が1つだけ、未使用の `options` パラメータ
- **シグナル:** "just in case" コメント、使われていないインターフェース
- **重要度:** LOW - 追跡して一括対応
- **対処:** Collapse Hierarchy, Inline Class, Remove Parameter

---

## 5. Couplers (密結合)

クラス/モジュール間の結合が強すぎる。

### Feature Envy (機能への嫉妬)
- **検出:** メソッドが自身のデータより他オブジェクトのデータを多く使う
- **grepパターン:** 1関数内で `other.xxx` の参照が `this.xxx` より多い
- **シグナル:** メソッド引数のオブジェクトのプロパティに5回以上アクセス
- **重要度:** HIGH - 今すぐ移動
- **対処:** Move Function

### Inappropriate Intimacy (不適切な親密さ)
- **検出:** 2つのクラス/モジュールが互いの内部実装に依存
- **grepパターン:** 循環import、privateメンバーへのアクセス（型アサーション経由）
- **シグナル:** 片方を変更するともう片方が壊れる
- **重要度:** HIGH - 今すぐリファクタ
- **対処:** Move Function, Extract Class, Hide Delegate

### Message Chains (メッセージチェーン)
- **検出:** `a.getB().getC().getD().doSomething()` のようなチェーン
- **grepパターン:** `\..*\..*\..*\.` (ドット3つ以上のチェーン)
- **シグナル:** 中間オブジェクトの構造変更で連鎖的に壊れる
- **重要度:** MEDIUM - 次のスプリントで対処
- **対処:** Hide Delegate, Extract Function

### Middle Man (仲介人)
- **検出:** クラスのメソッドの半数以上が別オブジェクトに委譲しているだけ
- **grepパターン:** メソッド本体が `return this.delegate.xxx()` のみ
- **シグナル:** ラッパーが増え続けるが付加価値がない
- **重要度:** LOW - 追跡して一括対応
- **対処:** Remove Middle Man, Inline Class

---

## 重要度分類まとめ

| 重要度 | 対応タイミング | スメル |
|--------|----------------|--------|
| **HIGH** | 今すぐリファクタ | Long Method, Large Class, Divergent Change, Shotgun Surgery, Duplicate Code, Feature Envy, Inappropriate Intimacy, Switch Statements (高頻度変更時) |
| **MEDIUM** | 次のスプリント | Primitive Obsession, Long Parameter List, Data Clumps, Parallel Inheritance, Dead Code, Message Chains |
| **LOW** | 追跡して一括対応 | Temporary Field, Alternative Classes, Comments, Lazy Class, Data Class, Speculative Generality, Middle Man |
