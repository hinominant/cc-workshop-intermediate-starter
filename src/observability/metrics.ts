// TODO: Step 6 で実装
// - 成功/失敗カウント
// - 処理時間の記録
// - メトリクスのエクスポート

interface MetricsStore {
  totalEvents: number;
  successCount: number;
  failureCount: number;
  totalDurationMs: number;
}

const store: MetricsStore = {
  totalEvents: 0,
  successCount: 0,
  failureCount: 0,
  totalDurationMs: 0,
};

export function recordSuccess(durationMs: number): void {
  // TODO: Step 6 で実装
}

export function recordFailure(durationMs: number): void {
  // TODO: Step 6 で実装
}

export function getMetrics(): MetricsStore {
  return { ...store };
}
