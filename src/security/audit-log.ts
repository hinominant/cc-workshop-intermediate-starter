// TODO: Step 7 で実装
// - 監査ログの記録
// - PII マスク処理

export interface AuditEntry {
  timestamp: string;
  action: string;
  actor: string;
  resource: string;
  result: "success" | "failure";
  detail?: string;
}

const auditLog: AuditEntry[] = [];

export function recordAudit(entry: Omit<AuditEntry, "timestamp">): void {
  // TODO: Step 7 で実装
}

export function getAuditLog(): AuditEntry[] {
  return [...auditLog];
}

export function maskPII(text: string): string {
  // TODO: Step 7 で実装
  // ヒント: メールアドレス、電話番号などをマスク
  return text;
}
