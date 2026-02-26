import type { EOSEvent, ProcessingResult } from "../types/event.js";

// TODO: Step 4 で実装
// - rules/default.yml からルールを読み込み
// - イベントタイプに基づいて処理を分岐（最低2分岐）
// - 処理結果を標準化して返却

export async function routeEvent(
  event: EOSEvent
): Promise<ProcessingResult> {
  // TODO: Step 4 で実装
  throw new Error("Not implemented: routeEvent");
}
