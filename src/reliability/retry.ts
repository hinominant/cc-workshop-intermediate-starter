import type { EOSEvent, ProcessingResult } from "../types/event.js";

// TODO: Step 5 で実装
// - 指数バックオフリトライ
// - 最大リトライ回数、間隔、打ち切り条件

export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

export const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = defaultRetryConfig
): Promise<T> {
  // TODO: Step 5 で実装
  return fn();
}
