// TODO: Step 5 で実装
// - event_id ベースの重複排除
// - インメモリ Set（本番では Redis/DB を想定）

const processedEvents = new Set<string>();

export function isDuplicate(eventId: string): boolean {
  // TODO: Step 5 で実装
  return false;
}

export function markProcessed(eventId: string): void {
  // TODO: Step 5 で実装
}
