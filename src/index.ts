import { Hono } from "hono";
import { serve } from "@hono/node-server";
// TODO: Step 3 で以下の import を追加
// import { verifySignature, isTimestampValid } from "./security/signature.js";
// import { parseWebhookEvent } from "./adapters/webhook-provider.js";
// import { notifySlack } from "./adapters/slack-notifier.js";

const app = new Hono();

app.get("/health", (c) => c.json({ status: "ok" }));

// TODO: Step 3 で POST /webhook エンドポイントを実装
app.post("/webhook", async (c) => {
  return c.json({ message: "Not implemented yet" }, 501);
});

const port = Number(process.env.PORT) || 3000;
console.log(`EOS server starting on port ${port}`);
serve({ fetch: app.fetch, port });
