import { createHmac, timingSafeEqual } from "node:crypto";

// TODO: Step 3 で実装
// - HMAC-SHA256 署名検証
// - timestamp チェック（リプレイ攻撃対策）

export function verifySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  // TODO: Step 3 で実装
  // ヒント: createHmac("sha256", secret).update(payload).digest("hex")
  // ヒント: timingSafeEqual でタイミング攻撃を防ぐ
  throw new Error("Not implemented: verifySignature");
}

export function isTimestampValid(
  timestamp: number,
  toleranceSec: number = 300
): boolean {
  // TODO: Step 3 で実装
  // ヒント: 現在時刻との差が toleranceSec 以内か確認
  throw new Error("Not implemented: isTimestampValid");
}
