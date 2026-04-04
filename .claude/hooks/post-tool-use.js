// PostToolUse Hook
// ツール実行結果をキャプチャし、エージェントメモリとツールログに記録する

const fs = require("fs");
const path = require("path");

function getInput() {
  return JSON.parse(fs.readFileSync("/dev/stdin", "utf8"));
}

function main() {
  const input = getInput();
  const { tool_name, tool_input, tool_output, session_id } = input;

  // ツールログに出力
  const logDir = path.join(process.cwd(), ".context");
  const logFile = path.join(logDir, "tool-log.jsonl");

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logEntry = {
    timestamp: new Date().toISOString(),
    session_id: session_id || "unknown",
    tool: tool_name,
    input_summary: summarizeInput(tool_name, tool_input),
    success: !tool_output?.error,
  };

  fs.appendFileSync(logFile, JSON.stringify(logEntry) + "\n");

  // === Keiji Agent 自動起動トリガー ===
  // 特定のイベント後にKeijiの問いをコンテキストに注入
  const keijiPrompt = getKeijiPrompt(tool_name, tool_input, tool_output);
  if (keijiPrompt) {
    console.log(JSON.stringify({ continue: true, additionalContext: keijiPrompt }));
    return;
  }

  // 結果を返す（ブロックしない）
  console.log(JSON.stringify({ continue: true }));
}

function getKeijiPrompt(toolName, toolInput, toolOutput) {
  // /log-failure 実行後 → 仕組み化の問い
  if (toolName === 'Skill' && toolInput?.skill === 'log-failure') {
    return '[KEIJI AGENT] 失敗パターンを記録した。ここで立ち止まって考えろ:\n' +
      '1. この失敗は仕組みで防げるか？hookで物理ブロックできないか？\n' +
      '2. 同じ失敗が過去にもあったか？なぜ再発した？\n' +
      '3. 対処療法で終わってないか？根本原因を直したか？\n' +
      'これらに回答してから次に進むこと。回答せずに先に進むことを禁止する。';
  }

  // hook/スキル作成・修正後 → 仕組みチェック
  if ((toolName === 'Write' || toolName === 'Edit') && toolInput?.file_path) {
    const fp = toolInput.file_path;
    if (fp.includes('/hooks/') || fp.includes('/skills/')) {
      return '[KEIJI AGENT] 仕組み（hook/スキル）を作成・修正した。確認:\n' +
        '1. これは無視できるか？→ Yesなら仕組みではない。hookで物理ブロックしろ\n' +
        '2. デッドロックしないか？自己修復パスは開いてるか？\n' +
        '3. 全リポジトリに反映すべきじゃないか？局所最適で終わってないか？';
    }
  }

  // デバッグ完了（debug-mode解除）後 → 全体反映の問い
  if (toolName === 'Bash' && toolInput?.command?.includes('debug-mode')) {
    if (toolInput.command.includes('rm')) {
      return '[KEIJI AGENT] デバッグが完了した。振り返り:\n' +
        '1. 今回の学びを調査ログ(ops/investigations/)に記録したか？\n' +
        '2. この学びからスキルやhookを改善すべきか？\n' +
        '3. 全体に反映すべきものはないか？';
    }
  }

  return null;
}

function summarizeInput(toolName, input) {
  if (!input) return "";
  switch (toolName) {
    case "Read":
      return input.file_path || "";
    case "Edit":
      return input.file_path || "";
    case "Write":
      return input.file_path || "";
    case "Bash":
      return (input.command || "").substring(0, 100);
    case "Grep":
      return input.pattern || "";
    case "Glob":
      return input.pattern || "";
    default:
      return JSON.stringify(input).substring(0, 100);
  }
}

main();
