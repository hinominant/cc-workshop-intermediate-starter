#!/usr/bin/env node
/**
 * ARIS-328: OGSM Completion Gate — Stop hook
 *
 * タスク完了宣言時に .context/ogsm.md の Measures が
 * 客観的事実に基づいて全て達成されているかを3段階で検証する。
 *
 * Stage 1: チェックボックス [x] 検証
 * Stage 2: 客観的証拠検証（ファイル存在、テスト結果等）
 * Stage 3: 整合性チェック（[x] なのに証拠が矛盾）
 *
 * fail-open: エラー時は continue: true
 */

const fs = require("fs");
const path = require("path");

const OGSM_PATH = ".context/ogsm.md";
const REVIEWED_PATH = ".context/ogsm-reviewed";
const RESULT_PATH = ".context/ogsm-completion-result.json";
const ATTEMPT_PATH = ".context/ogsm-attempt-count";

function main() {
  try {
    // 発火条件チェック
    if (!fs.existsSync(OGSM_PATH) || !fs.existsSync(REVIEWED_PATH)) {
      output({ continue: true });
      return;
    }

    const content = fs.readFileSync(OGSM_PATH, "utf-8");
    const measures = parseMeasures(content);

    if (measures.length === 0) {
      output({ continue: true });
      return;
    }

    // Stage 1: チェックボックス検証
    const unchecked = measures.filter((m) => !m.checked);
    if (unchecked.length > 0) {
      const items = unchecked.map((m) => `  - [ ] ${m.text}`).join("\n");
      incrementAttemptCount(); // C2: attempt-count
      output({
        continue: false,
        description: `Measures未達（${unchecked.length}件）。以下を完了してからもう一度完了宣言してください:\n${items}`,
      });
      return;
    }

    // Stage 2 + 3: 客観的証拠検証 + 整合性チェック
    const results = [];
    const failures = [];
    for (const m of measures) {
      const evidence = verifyEvidence(m.text);
      const entry = { text: m.text, checked: m.checked, evidence: evidence };
      if (evidence && !evidence.passed) {
        failures.push({ text: m.text, reason: evidence.reason });
        entry.verdict = "FAIL";
      } else {
        entry.verdict = "PASS";
      }
      results.push(entry);
    }

    if (failures.length > 0) {
      const items = failures
        .map((f) => `  - [x] ${f.text}\n    → 矛盾: ${f.reason}`)
        .join("\n");
      incrementAttemptCount(); // C2: attempt-count
      output({
        continue: false,
        description: `Measuresにチェック済みですが、客観的証拠と矛盾しています（${failures.length}件）:\n${items}\n\n実際に条件を満たしてからチェックしてください。`,
      });
      return;
    }

    // C1: 全Stage通過 → completion-result.json を書き出す
    try {
      fs.writeFileSync(RESULT_PATH, JSON.stringify({
        passed: true,
        measures: results,
        attempt_count: readAttemptCount(),
        timestamp: new Date().toISOString(),
      }, null, 2), "utf-8");
    } catch (_e) {
      // 書き出し失敗は致命的ではない
    }

    output({ continue: true });
  } catch (e) {
    // fail-open
    output({ continue: true });
  }
}

// C3: # と ## の両方に対応
function parseMeasures(content) {
  const lines = content.split("\n");
  let inMeasures = false;
  const measures = [];

  for (const line of lines) {
    if (/^##?\s+Measures/i.test(line)) {
      inMeasures = true;
      continue;
    }
    if (inMeasures && /^##?\s+/.test(line) && !/^##?\s+Measures/i.test(line)) {
      break;
    }
    if (inMeasures) {
      const match = line.match(/^[-*]\s+\[([ xX])\]\s+(.+)$/);
      if (match) {
        measures.push({
          checked: match[1].toLowerCase() === "x",
          text: match[2].trim(),
        });
      }
    }
  }
  return measures;
}

function verifyEvidence(text) {
  // ファイル存在チェック
  const fileMatch = text.match(/(?:ファイル|file):\s*(\S+)/i);
  if (fileMatch) {
    const filePath = fileMatch[1];
    if (!fs.existsSync(filePath)) {
      return { passed: false, reason: `ファイル ${filePath} が存在しません` };
    }
  }

  // テスト結果チェック
  if (/テスト.*PASS|test.*pass/i.test(text)) {
    const testResultPath = ".context/last-test-result.json";
    if (fs.existsSync(testResultPath)) {
      try {
        const result = JSON.parse(fs.readFileSync(testResultPath, "utf-8"));
        if (result.failed > 0) {
          return {
            passed: false,
            reason: `テスト失敗: ${result.failed}件失敗（${result.passed}件成功/${result.total}件中）`,
          };
        }
      } catch { /* パース失敗 → 通過 */ }
    }
  }

  // エラーゼロチェック
  if (/エラー.*ゼロ|エラー.*0件|error.*0|no.*error/i.test(text)) {
    const toolLogPath = ".context/tool-log.jsonl";
    if (fs.existsSync(toolLogPath)) {
      try {
        const lines = fs.readFileSync(toolLogPath, "utf-8").trim().split("\n");
        const recent = lines.slice(-10);
        const errorCount = recent.filter((l) => {
          try { return JSON.parse(l).success === false; } catch { return false; }
        }).length;
        if (errorCount > 0) {
          return { passed: false, reason: `直近のツール実行に${errorCount}件のエラーがあります` };
        }
      } catch { /* 通過 */ }
    }
  }

  // H5: lint結果チェック
  if (/lint.*PASS|ruff|eslint/i.test(text)) {
    const toolLogPath = ".context/tool-log.jsonl";
    if (fs.existsSync(toolLogPath)) {
      try {
        const lines = fs.readFileSync(toolLogPath, "utf-8").trim().split("\n");
        const lintEntries = lines.filter((l) => {
          try {
            const entry = JSON.parse(l);
            return /ruff|eslint|lint/.test(entry.command || "");
          } catch { return false; }
        });
        if (lintEntries.length > 0) {
          const last = JSON.parse(lintEntries[lintEntries.length - 1]);
          if (last.exit_code !== 0) {
            return { passed: false, reason: `lint失敗（exit code: ${last.exit_code}）` };
          }
        }
      } catch { /* 通過 */ }
    }
  }

  // コミット存在チェック
  if (/commit|コミット/i.test(text)) {
    try {
      const { execSync } = require("child_process");
      const log = execSync("git log --oneline -1 2>/dev/null", {
        encoding: "utf-8", timeout: 5000,
      }).trim();
      if (!log) {
        return { passed: false, reason: "gitコミットが存在しません" };
      }
    } catch { /* 通過 */ }
  }

  return null;
}

// C2: attempt-countの管理
function readAttemptCount() {
  try {
    if (fs.existsSync(ATTEMPT_PATH)) {
      return parseInt(fs.readFileSync(ATTEMPT_PATH, "utf-8").trim(), 10) || 0;
    }
  } catch { /* */ }
  return 0;
}

function incrementAttemptCount() {
  try {
    const count = readAttemptCount() + 1;
    fs.writeFileSync(ATTEMPT_PATH, String(count), "utf-8");
  } catch { /* */ }
}

function output(result) {
  process.stdout.write(JSON.stringify(result));
}

main();
