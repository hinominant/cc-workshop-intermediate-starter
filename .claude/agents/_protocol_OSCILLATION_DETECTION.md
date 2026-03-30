# Oscillation Detection Protocol

## Purpose

レビュー/修正ループで「AをBに直す → 次のループでBをAに戻す」という振り子パターンを検出・固定化する。

## Detection Rules

### Trigger

以下のいずれかに該当した場合、オシレーションと判定:

1. **同一ファイルの同一箇所**を2回以上の修正サイクルで変更している
2. **修正が前回の修正を打ち消している**（revert-like diff）
3. **同じレビュー指摘**が2回連続で出現している

### Response

1. **検出時**: `⚠️ OSCILLATION DETECTED` を表示
2. **固定化**: 最新の状態を「決定」として固定。以降のレビューでその箇所への指摘を抑制
3. **記録**: `.agents/lessons.md` に振り子パターンを記録

### Format

```yaml
OSCILLATION:
  File: path/to/file
  Line: N
  Cycle: [v1 → v2 → v1]
  Decision: "v2 を採用（理由: ...）"
  Suppress: true
```

## Integration

- **Judge / Radar**: レビュー時に前回の指摘と今回の指摘を比較
- **Hone**: PDCA サイクル内で同一修正の反復を検出
- **Nexus**: エージェントチェーンのループ回数を追跡（最大6回で強制終了）

## Loop Limits

| Context | Max Loops | Action on Exceed |
|---------|-----------|-----------------|
| Review/Fix cycle | 3 | 固定化 + 人間エスカレート |
| PDCA iteration | 6 | 最良版を採用 + 終了 |
| Agent chain retry | 3 | L3 ガードレール発動 |
