import type { ProcessingResult } from "../types/event.js";

// TODO: Step 3 で実装
// - ProcessingResult を Slack メッセージ形式に変換
// - Slack Webhook URL に POST

export async function notifySlack(
  result: ProcessingResult
): Promise<void> {
  // TODO: Step 3 で実装
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error("SLACK_WEBHOOK_URL is not set");
  }
  throw new Error("Not implemented: notifySlack");
}
