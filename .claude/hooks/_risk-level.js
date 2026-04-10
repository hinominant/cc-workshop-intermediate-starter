#!/usr/bin/env node
'use strict';

/**
 * _risk-level.js — リスクレベル判定ヘルパー
 *
 * current_ticket.json のラベルからリスクレベルを判定。
 * hookごとに必要なレベルを指定し、不要なhookをスキップする。
 *
 * 使い方:
 *   const { getRiskLevel, shouldSkipForLevel } = require('./_risk-level');
 *
 *   // このhookが必要な最低レベル
 *   if (shouldSkipForLevel('standard')) {
 *     // Lightタスクではスキップ
 *     process.stdout.write(JSON.stringify({ decision: 'approve' }));
 *     process.exit(0);
 *   }
 */

const fs = require('fs');
const path = require('path');

const LEVEL_ORDER = { strict: 3, standard: 2, light: 1 };

const STRICT_LABELS = ['security', 'revenue', 'data-pipeline', 'incident'];
const STANDARD_LABELS = ['feature', 'epic', 'improvement'];
const LIGHT_LABELS = ['bug', 'bugfix', 'fix', 'refactor', 'chore', 'docs'];

/**
 * current_ticket.json からリスクレベルを判定
 * @returns {'strict' | 'standard' | 'light'}
 */
function getRiskLevel() {
  try {
    const ticketPath = path.join(process.cwd(), '.context', 'current_ticket.json');
    const ticket = JSON.parse(fs.readFileSync(ticketPath, 'utf8'));
    const labels = (ticket.labels || []).map(l => typeof l === 'string' ? l.toLowerCase() : '');

    if (labels.some(l => STRICT_LABELS.includes(l))) return 'strict';
    if (labels.some(l => STANDARD_LABELS.includes(l))) return 'standard';
    if (labels.some(l => LIGHT_LABELS.includes(l))) return 'light';

    // ラベルなし → standard（安全側に倒す）
    return 'standard';
  } catch {
    // チケットなし → standard
    return 'standard';
  }
}

/**
 * 指定レベル未満のタスクでこのhookをスキップすべきか
 * @param {'strict' | 'standard' | 'light'} requiredLevel - このhookが必要な最低レベル
 * @returns {boolean} trueならスキップ
 */
function shouldSkipForLevel(requiredLevel) {
  const currentLevel = getRiskLevel();
  return (LEVEL_ORDER[currentLevel] || 2) < (LEVEL_ORDER[requiredLevel] || 2);
}

module.exports = { getRiskLevel, shouldSkipForLevel, STRICT_LABELS, STANDARD_LABELS, LIGHT_LABELS };
