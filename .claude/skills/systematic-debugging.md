# Skill: Systematic Debugging — 構造化デバッグプロトコル

**Trigger**: バグ報告時、テスト失敗時、挙動異常時

## Purpose

「とりあえず直してみる」式のデバッグを禁止。
仮説→証拠による棄却→真因特定の流れを強制する。

## The Iron Law

```
NO CODE CHANGES WITHOUT A HYPOTHESIS BACKED BY EVIDENCE
```

仮説なしのコード変更 = 試行錯誤 = 負債の温床。

## The Process

### Step 1: 症状の完全記述

```
## Symptoms
- What happens: （実際の挙動）
- What should happen: （期待する挙動）
- How to reproduce: （再現手順）
- When it started: （いつから）
- Environment: （OS, versions）
```

### Step 2: 仮説リストアップ（最低3つ）

```
## Hypotheses
H1: （最も可能性が高い）
    証拠: ...
H2: （次に可能性が高い）
    証拠: ...
H3: （可能性は低いが無視できない）
    証拠: ...
```

### Step 3: 仮説ごとに証拠で棄却

```
## Evidence Collection

H1: XXX が原因
  検証方法: ログ確認, gitログ確認, 再現テスト
  結果: 証拠なし → 棄却
  
H2: YYY が原因
  検証方法: ...
  結果: 証拠あり → 継続調査

H3: ZZZ が原因
  検証方法: ...
  結果: 棄却
```

### Step 4: 真因特定

```
## Root Cause
H2（YYY）が真因。

証拠:
  - ...
  - ...
  
なぜ他の仮説が棄却されたか:
  - H1: ...
  - H3: ...
```

### Step 5: 修正 + 再発防止

```
## Fix
- 修正内容: ...
- 再発防止: ...（テスト追加、監視追加等）
```

## Anti-patterns

**Bad**: 仮説なしで修正
```
エラーが出た → ググった → この修正を試した → 直った → commit
→ なぜ直ったか分からない。同じバグが別の形で再発する。
```

**Good**: 仮説→棄却→真因
```
症状記述 → H1,H2,H3 → 証拠で棄却 → H2が真因 → 修正 → 再発防止テスト
→ 真因が明確。再発しない。
```

## よくある罠

### 罠1: 症状を直すだけ
エラーメッセージを消すだけ → 根本原因は残る

### 罠2: 最初の仮説に飛びつく
「多分これだろう」→ 証拠なしで修正 → 実は違った

### 罠3: 環境の差を無視
「自分のPCでは動く」→ 環境差が真因の可能性

### 罠4: コミット履歴を見ない
gitログを見れば「いつから壊れたか」で原因commitが特定できる

## hook連携

`debug-guard.js` が以下を検出:
- 仮説なしのコード変更 → block
- 症状記述なしのデバッグ → ask_user

## 参考
- github.com/obra/superpowers/skills/systematic-debugging
- Luna内部プロトコル: /debug スキル
