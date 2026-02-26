import type { EOSEvent } from "../types/event.js";

// TODO: Step 5 で実装
// - 失敗イベントの隔離（Dead Letter Queue）
// - インメモリ配列（本番では永続化を想定）

const deadLetterQueue: Array<{ event: EOSEvent; error: string; failedAt: string }> = [];

export function sendToDLQ(event: EOSEvent, error: string): void {
  // TODO: Step 5 で実装
}

export function getDLQItems() {
  // TODO: Step 5 で実装
  return deadLetterQueue;
}
