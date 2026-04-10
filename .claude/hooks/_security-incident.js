#!/usr/bin/env node
'use strict';

/**
 * _security-incident.js — セキュリティインシデント記録ヘルパー
 *
 * セキュリティhook（secret-scan-guard, package-guard, download-guard, infra-guard）から
 * 呼ばれ、インシデントを .context/security-incidents.jsonl に記録する。
 *
 * Usage:
 *   const si = require('./_security-incident');
 *   si.record({ hook: 'secret-scan-guard', detail: 'APIキー検出', severity: 'HIGH', action: 'block' });
 *   const severity = si.classifySeverity('secret-scan-guard', 'PRIVATE KEY detected');
 */

const fs = require('fs');
const path = require('path');

// === Severity分類ルール ===
const SEVERITY_RULES = {
  'CRITICAL': [
    /PRIVATE KEY/i,
    /secret.*key/i,
    /malicious.*package/i,
    /known.*malware/i,
    /supply.chain/i,
    /backdoor/i,
  ],
  'HIGH': [
    /api.?key/i,
    /password/i,
    /token/i,
    /credential/i,
    /\.env/i,
    /suspicious.*url/i,
    /ip.*direct/i,
    /aws.*iam/i,
    /route53/i,
    /security.group/i,
  ],
  'MEDIUM': [
    /pip install/i,
    /npm install/i,
    /bun add/i,
    /curl/i,
    /wget/i,
    /git clone/i,
    /upgrade/i,
    /supabase/i,
    /vercel/i,
  ],
};

// === Hook別デフォルトseverity ===
const HOOK_DEFAULT_SEVERITY = {
  'secret-scan-guard': 'HIGH',
  'package-guard': 'MEDIUM',
  'download-guard': 'MEDIUM',
  'infra-guard': 'HIGH',
};

/**
 * severity を判定する
 * @param {string} hookName - hook名
 * @param {string} detail - 検知内容
 * @returns {'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'}
 */
function classifySeverity(hookName, detail) {
  // ルールベースでマッチ
  for (const [severity, patterns] of Object.entries(SEVERITY_RULES)) {
    for (const pattern of patterns) {
      if (pattern.test(detail)) {
        return severity;
      }
    }
  }

  // Hook別デフォルト
  if (HOOK_DEFAULT_SEVERITY[hookName]) {
    return HOOK_DEFAULT_SEVERITY[hookName];
  }

  return 'LOW';
}

/**
 * インシデントを記録する
 * @param {Object} incident - { hook, detail, severity, action }
 * @param {string} [cwd] - 作業ディレクトリ（テスト用）
 */
function record(incident, cwd) {
  const baseDir = cwd || process.cwd();
  const logPath = path.join(baseDir, '.context', 'security-incidents.jsonl');

  const entry = {
    hook: incident.hook,
    detail: incident.detail,
    severity: incident.severity || classifySeverity(incident.hook, incident.detail),
    action: incident.action || 'unknown',
    timestamp: new Date().toISOString(),
  };

  try {
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, JSON.stringify(entry) + '\n');
  } catch {
    // fail-open: 記録失敗しても処理は止めない
  }
}

module.exports = { record, classifySeverity };
