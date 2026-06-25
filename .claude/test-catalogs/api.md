# テストカタログ: API系 (api)

## 適用条件
Specに以下のキーワードが含まれる場合に適用:
API, endpoint, REST, GraphQL, エンドポイント, リクエスト, レスポンス, webhook, route, controller, handler

## 必須テスト項目

- API-001: 正常リクエストで期待するHTTPステータスとレスポンスボディ（200/201/204）
- API-002: 必須パラメータ欠落でHTTP 400 + エラー詳細メッセージ
- API-003: 不正な型のパラメータ（数値フィールドに文字列等）でHTTP 400
- API-004: 認証なしリクエストでHTTP 401
- API-005: 権限不足のリクエストでHTTP 403（他ユーザーのリソースへのアクセス等）
- API-006: 存在しないリソースへのリクエストでHTTP 404
- API-007: 不正なHTTPメソッド（GET-onlyにPOST等）でHTTP 405
- API-008: リクエストボディサイズ上限超過での適切なエラー（413）
- API-009: Content-Type不一致（JSONエンドポイントにtext/plain）での適切なエラー
- API-010: SQLインジェクション/NoSQLインジェクションがパラメータ経由で成功しないこと
- API-011: パスインジェクション（../../../etc/passwd等）がパラメータ経由で成功しないこと
- API-012: レスポンスに不要な内部情報（スタックトレース、DB構造）が含まれないこと
- API-013: CORS設定が適切であること（許可オリジン以外からのリクエスト拒否）
- API-014: ページネーションの境界値（page=0, page=-1, page=999999, limit=0, limit=-1）
- API-015: 同一リクエストの冪等性（POST以外のメソッドで2回同じリクエストしても結果同じ）

## オプショナルテスト項目

- API-OPT-001: レート制限（N回/分超過でHTTP 429）
- API-OPT-002: API バージョニング（v1/v2の共存）
- API-OPT-003: Content Negotiation（Accept: application/json vs xml）
- API-OPT-004: バッチリクエスト処理（部分失敗時のレスポンス）
- API-OPT-005: Webhook配信のリトライ・冪等性
- API-OPT-006: GraphQL depth limit / complexity limit
