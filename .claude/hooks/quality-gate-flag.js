#!/usr/bin/env node
'use strict';

/**
 * Quality Gate Flag Creator
 *
 * /quality-gate スキルの Step 3 で呼び出される。
 * HMAC ノンス付きフラグファイルを作成する。
 *
 * Usage: node .claude/hooks/quality-gate-flag.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const FLAG_FILE = path.join(process.cwd(), '.quality-gate-passed');
const HMAC_KEY = crypto.createHash('sha256').update('qg:' + process.cwd()).digest('hex').slice(0, 16);

const timestamp = Date.now().toString();
const hmac = crypto.createHmac('sha256', HMAC_KEY).update(timestamp).digest('hex').slice(0, 16);
const nonce = `${timestamp}:${hmac}`;

fs.writeFileSync(FLAG_FILE, nonce);
console.log('Quality Gate flag created: ' + FLAG_FILE);
