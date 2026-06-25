# テストカタログ: アンチパターン検出 (anti-patterns)

## 適用条件
全てのテストコード作成時に自動適用。
qa-assertion-check.js の検出ルールと連携。

## 必須検出項目（block対象）

- AP-001: `assert True` / `assert not False` — 常にPASSする無意味assertion
- AP-002: `assert x is not None` でxがテスト内生成変数 — ほぼ常にPASS
- AP-003: `assert len(x) >= 0` — 常にPASS（lenは常に非負）
- AP-004: `assert isinstance(x, object)` — Pythonの全オブジェクトが通過
- AP-005: テスト関数内にassert 0個 — テストとして機能していない
- AP-006: `expect(true).toBe(true)` — JS/TS版の無意味assertion
- AP-007: `expect(x).toBeDefined()` でx自体がテスト内定数 — 意味なし

## 推奨検出項目（警告対象）

- AP-W-001: テスト関数内にassert 1個だけ — 検証深度不足の可能性
- AP-W-002: try/except/pass でassertが隠蔽 — 例外握りつぶし
- AP-W-003: モック過多（実装の3倍以上モック） — テスト対象が実装と乖離
- AP-W-004: `pytest.mark.skip` / `test.skip` が理由なく付与 — SKIP=FAIL原則違反
- AP-W-005: テスト名が抽象的（`test_ok`, `test_work`, `test_case1`）
- AP-W-006: 複数のassertが1つのテストに混在（SRP違反）
- AP-W-007: テストが実装詳細に依存（private変数へのアクセス等）

## 検出不可項目（人間レビュー必須）

- AP-H-001: 正しく失敗するかが不明なテスト（ミューテーションテストで検出）
- AP-H-002: テストが機能の本質を検証していない（spec-reviewer必要）
- AP-H-003: 境界値が実際のエッジケースを外している
- AP-H-004: 統合テストがユニットテストの寄せ集めになっている

## 悪いパターンの具体例

### Bad: assert True
```python
def test_addition():
    result = add(1, 1)
    assert True  # ← 何も検証していない
```

### Good: 具体的な値をassert
```python
def test_addition():
    assert add(1, 1) == 2
```

### Bad: 自己参照assertion
```python
def test_validation():
    result = validator.check("input")
    assert result is not None  # ← 戻り値さえ返れば通る
```

### Good: 期待値との比較
```python
def test_validation():
    result = validator.check("input")
    assert result.valid == True
    assert result.errors == []
```

### Bad: 広すぎるcatch
```python
def test_api_call():
    try:
        response = api.call()
        assert response.status == 200
    except Exception:  # ← どんなエラーも通る
        pass
```

### Good: 期待する例外のみcatch
```python
def test_api_call_on_404():
    with pytest.raises(NotFoundError):
        api.call_nonexistent()
```

## 参考
- github.com/obra/superpowers/skills/test-driven-development/testing-anti-patterns.md
- Martin Fowler: "Test Smells"
