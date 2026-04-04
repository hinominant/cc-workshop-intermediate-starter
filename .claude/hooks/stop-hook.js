// Stop Hook
// セッション終了時にサマリをエージェントメモリに書き込み、
// RESUME_CONTEXT.md を自動生成する（コンテキスト圧縮・セッション再開時の必読ファイル）

const fs = require("fs");
const path = require("path");

function getInput() {
  try {
    return JSON.parse(fs.readFileSync("/dev/stdin", "utf8"));
  } catch (_e) {
    return null;
  }
}

function main() {
  const input = getInput();
  if (!input) {
    console.log(JSON.stringify({ continue: true }));
    return;
  }
  const { session_id, stop_reason } = input;

  // ツールログからセッションサマリを生成
  const logFile = path.join(process.cwd(), ".context", "tool-log.jsonl");

  // ログファイルサイズ上限チェック（10MB超はスキップしてOOM回避）
  const MAX_LOG_BYTES = 10 * 1024 * 1024;
  if (fs.existsSync(logFile) && fs.statSync(logFile).size <= MAX_LOG_BYTES) {
    const lines = fs.readFileSync(logFile, "utf8").trim().split("\n");
    const sessionLogs = lines
      .map((l) => {
        try {
          return JSON.parse(l);
        } catch {
          return null;
        }
      })
      .filter((l) => l && l.session_id === session_id);

    if (sessionLogs.length > 0) {
      const summary = {
        session_id,
        stop_reason,
        timestamp: new Date().toISOString(),
        tool_count: sessionLogs.length,
        tools_used: [...new Set(sessionLogs.map((l) => l.tool))],
        errors: sessionLogs.filter((l) => !l.success).length,
      };

      // セッションサマリを記録
      const summaryDir = path.join(process.cwd(), ".context", "sessions");
      if (!fs.existsSync(summaryDir)) {
        fs.mkdirSync(summaryDir, { recursive: true });
      }
      const summaryFile = path.join(
        summaryDir,
        `${new Date().toISOString().split("T")[0]}.jsonl`
      );
      fs.appendFileSync(summaryFile, JSON.stringify(summary) + "\n");
    }
  }

  // RESUME_CONTEXT.md: コンテキスト圧縮・セッション再開時の必読ファイル
  try {
    const resumeFile = path.join(process.cwd(), ".claude", "RESUME_CONTEXT.md");
    const resumeContent = [
      "# Context Recovery — 必読",
      "",
      `> Session ended: ${new Date().toISOString()}`,
      "> このファイルはセッション終了時に自動生成される。次セッション開始時に必ず読むこと。",
      "",
      "## Context Recovery 手順",
      "",
      "1. このファイルを読んだ",
      "2. プロジェクトの CLAUDE.md を確認した",
      "3. `.agents/PROJECT.md` で作業状態を把握した",
      "4. `git log --oneline -10` + `git status` で確認した",
      "5. 上記完了まで実装作業に入らない",
      "",
      "## データ保護ルール（コンテキスト状態に関わらず常に有効）",
      "",
      "- Luna DB は **READ ONLY**。書き込みコードは禁止",
      "- `.env` はコミットしない。API キー・パスワードをコードに書かない",
      "- 売上集計は `gross_amount` を使用（`net_amount` 禁止）",
    ].join("\n");
    const claudeDir = path.join(process.cwd(), ".claude");
    if (!fs.existsSync(claudeDir)) {
      fs.mkdirSync(claudeDir, { recursive: true });
    }
    fs.writeFileSync(resumeFile, resumeContent, "utf8");
  } catch (_resumeErr) {
    // Non-critical — continue without blocking
  }

  console.log(JSON.stringify({ continue: true }));
}

main();
