import type { EOSEvent } from "../types/event.js";

// TODO: Step 6 で実装
// - 構造化ログ（JSON形式）
// - event_id / provider / status / latency をフィールドに含む

export function logEvent(
  level: "info" | "warn" | "error",
  message: string,
  context?: Partial<EOSEvent> & Record<string, unknown>
): void {
  // TODO: Step 6 で実装
  console.log(JSON.stringify({ level, message, ...context, timestamp: new Date().toISOString() }));
}
