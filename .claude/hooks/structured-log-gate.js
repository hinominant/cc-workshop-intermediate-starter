#!/usr/bin/env node
'use strict';

/**
 * Structured Log Gate — ARIS-845 (GAP-U02 S6)
 *
 * console.log / print / echo での非構造化ログを検出、構造化ログに誘導。
 *
 * 検出:
 *   - console.log / .info / .error （logger未使用）
 *   - Python: print() （logging未使用）
 *   - 文字列連結ログ（'Error: ' + err）
 *
 * 推奨: logger.info({...}) / logging.info("...", extra={...})
 */

const fs = require('fs');
const path = require('path');

let input;
try {
  input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
} catch {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const tool = input.tool_name;
if (tool !== 'Edit' && tool !== 'Write') {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const filePath = (input.tool_input || {}).file_path || '';
if (!/\.(js|ts|jsx|tsx|py|rb|go)$/.test(filePath)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// テスト・スクリプト・ユーティリティは対象外
if (/\/(tests?|scripts?|bin|cli|__tests__)\//.test(filePath)
    || /\.test\.(js|ts|py)$/.test(filePath)
    || /\.cli\./.test(filePath)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// src/以下のアプリケーションコードのみ対象
if (!/\/(src|app|lib)\//.test(filePath)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const content = (input.tool_input || {}).content || (input.tool_input || {}).new_string || '';
if (!content) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const findings = [];

// JS/TS: console.log の多用
if (/\.(js|ts|jsx|tsx)$/.test(filePath)) {
  const consoleLogs = content.match(/console\.(log|info|warn|error|debug)\s*\(/g) || [];

  // logger使用有無
  const usesLogger = /\b(logger|log)\.(info|warn|error|debug)\s*\(/.test(content)
    || /import.*\bpino\b|\blogger\b|\bwinston\b|\bbunyan\b/.test(content);

  if (consoleLogs.length >= 3 && !usesLogger) {
    findings.push({
      rule: 'unstructured-console',
      count: consoleLogs.length,
      lang: 'JS/TS',
      severity: 'MEDIUM',
    });
  }

  // 文字列連結ログ
  const concatLogs = content.match(/console\.\w+\([^)]*\+[^)]*\)/g) || [];
  if (concatLogs.length >= 2) {
    findings.push({
      rule: 'string-concatenation-log',
      count: concatLogs.length,
      example: concatLogs[0].slice(0, 60),
      severity: 'MEDIUM',
    });
  }
}

// Python: print の多用
if (filePath.endsWith('.py')) {
  const prints = content.match(/^\s*print\s*\(/gm) || [];
  const usesLogging = /\b(logger|logging)\.(info|warning|error|debug|exception)\s*\(|import\s+logging/.test(content);

  if (prints.length >= 3 && !usesLogging) {
    findings.push({
      rule: 'unstructured-print',
      count: prints.length,
      lang: 'Python',
      severity: 'MEDIUM',
    });
  }
}

// Go: fmt.Println の多用
if (filePath.endsWith('.go')) {
  const println = content.match(/fmt\.(Print|Println|Printf)\s*\(/g) || [];
  const usesLogger = /\blog\.(Info|Error|Warn|Debug)\s*\(|zap\.L\(\)|logrus/.test(content);

  if (println.length >= 3 && !usesLogger) {
    findings.push({
      rule: 'unstructured-fmt',
      count: println.length,
      lang: 'Go',
      severity: 'MEDIUM',
    });
  }
}

if (findings.length === 0) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// MEDIUMのみなのでwarning（blockしない、false positive回避）
console.log(JSON.stringify({
  decision: 'approve',
  additionalContext: `📝 Structured Log Gate (ARIS-845): 非構造化ログ検出\n\n`
    + findings.map(f => `  - [${f.severity}] ${f.rule}: ${f.count}件 (${f.lang || ''})`).join('\n')
    + `\n\n推奨:\n`
    + `  JS/TS: pino / winston → logger.info({event, userId, ...})\n`
    + `  Python: logging → logging.info("msg", extra={"user_id": 123})\n`
    + `  Go: zap / logrus → log.Info("msg", zap.String(...))\n\n`
    + `構造化ログは分析/検索/アラートで必須。console.logのみの運用は技術的負債。`,
}));
