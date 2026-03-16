# Sweep Interaction Triggers Reference

YAML question templates for user confirmation points.

---

## ON_SCAN_START

```yaml
questions:
  - question: "リポジトリのクリーンアップスキャンを開始します。スキャン対象を選択してください。"
    header: "Scan Scope"
    options:
      - label: "フルスキャン (推奨)"
        description: "すべてのカテゴリ（デッドコード、孤立アセット、未使用依存関係など）をスキャン"
      - label: "ソースコードのみ"
        description: "未使用のソースコードファイルのみをスキャン"
      - label: "アセットのみ"
        description: "孤立した画像・フォントなどのアセットのみをスキャン"
      - label: "依存関係のみ"
        description: "未使用のnpm/yarn依存関係のみをスキャン"
    multiSelect: true
```

---

## ON_SOURCE_DELETE

```yaml
questions:
  - question: "以下のソースコードファイルを削除してもよろしいですか？削除前に詳細を確認することをお勧めします。"
    header: "Delete Code"
    options:
      - label: "詳細を確認 (推奨)"
        description: "各ファイルの参照状況と影響範囲を表示"
      - label: "すべて削除"
        description: "リストされたファイルをすべて削除"
      - label: "個別に確認"
        description: "ファイルごとに削除確認を行う"
      - label: "スキップ"
        description: "ソースコードの削除をスキップして次へ"
    multiSelect: false
```

---

## ON_DEPENDENCY_REMOVE

```yaml
questions:
  - question: "未使用の依存関係が見つかりました。どのように処理しますか？"
    header: "Dependencies"
    options:
      - label: "削除前に確認 (推奨)"
        description: "各パッケージの使用状況を詳細表示"
      - label: "すべて削除"
        description: "未使用の依存関係をすべて削除"
      - label: "devDependenciesのみ"
        description: "開発用依存関係のみ削除"
      - label: "スキップ"
        description: "依存関係の削除をスキップ"
    multiSelect: false
```

---

## ON_CONFIG_DELETE

```yaml
questions:
  - question: "使用されていない設定ファイルが見つかりました。削除しますか？"
    header: "Config Files"
    options:
      - label: "詳細を確認 (推奨)"
        description: "各設定ファイルの用途と削除の影響を表示"
      - label: "削除を実行"
        description: "リストされた設定ファイルを削除"
      - label: "スキップ"
        description: "設定ファイルの削除をスキップ"
    multiSelect: false
```

---

## ON_LARGE_CLEANUP

```yaml
questions:
  - question: "多数のファイル（{count}件）がクリーンアップ対象です。どのように進めますか？"
    header: "Large Cleanup"
    options:
      - label: "カテゴリ別に確認 (推奨)"
        description: "カテゴリごとに分けて確認・削除"
      - label: "すべて削除"
        description: "すべての候補ファイルを一括削除"
      - label: "優先度高のみ"
        description: "低リスクファイルのみ削除"
      - label: "キャンセル"
        description: "クリーンアップをキャンセル"
    multiSelect: false
```

---

## ON_RECENT_FILE

```yaml
questions:
  - question: "最近変更されたファイル（{days}日前）がクリーンアップ候補に含まれています。確認しますか？"
    header: "Recent File"
    options:
      - label: "詳細を確認 (推奨)"
        description: "変更履歴と現在の使用状況を確認"
      - label: "削除リストから除外"
        description: "このファイルを削除候補から除外"
      - label: "削除を続行"
        description: "最近の変更に関わらず削除"
    multiSelect: false
```

---

## ON_UNCERTAIN

```yaml
questions:
  - question: "ファイルの使用状況を確定できません。どのように処理しますか？"
    header: "Uncertain"
    options:
      - label: "保持 (推奨)"
        description: "確実でない場合は削除しない"
      - label: "手動で確認"
        description: "ファイルの内容と参照を手動確認"
      - label: "削除を実行"
        description: "リスクを承知で削除"
    multiSelect: false
```

---

## ON_CLEANUP_COMPLETE

```yaml
questions:
  - question: "クリーンアップが完了しました。追加のアクションを選択してください。"
    header: "Complete"
    options:
      - label: "テスト実行 (推奨)"
        description: "変更後のテストを実行して問題がないか確認"
      - label: "レポート出力"
        description: "クリーンアップレポートをファイルに出力"
      - label: "コミット作成"
        description: "クリーンアップ変更をコミット"
      - label: "完了"
        description: "追加アクションなしで終了"
    multiSelect: true
```
