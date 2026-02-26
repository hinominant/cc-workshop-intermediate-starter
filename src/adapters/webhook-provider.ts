import type { EOSEvent } from "../types/event.js";

// TODO: Step 3 で実装
// - リクエストボディをパースしてEOSEvent形式に変換
// - 署名検証は security/signature.ts に委譲

export async function parseWebhookEvent(
  body: string,
  headers: Record<string, string>
): Promise<EOSEvent> {
  // TODO: Step 3 で実装
  throw new Error("Not implemented: parseWebhookEvent");
}
