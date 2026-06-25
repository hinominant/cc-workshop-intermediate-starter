#!/usr/bin/env node
'use strict';

/**
 * Magika Helper — ARIS-833 (MAGIKA-001)
 *
 * Google Magika (https://github.com/google/magika) のラッパー。
 * 他のhookから detectFileType(filePath) で呼び出す共通モジュール。
 *
 * 探索順序:
 *   1. magika コマンド（pip install magika or cargo install magika）
 *   2. npx magika（experimental）
 *   3. fallback: file command（Unix標準）
 *   4. fallback: 拡張子ベース判定（最終手段）
 *
 * 返却値:
 *   { label: string, score: number, source: "magika"|"file"|"extension" }
 *   label: "pem", "text", "json", "binary", "image", "script", "executable", ...
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

// キャッシュ: 同一セッション内で同じファイルを複数回判定するのを避ける
const _cache = new Map();

// magika 利用可能チェック（1回だけ）
let _magikaAvailable = null;
function isMagikaAvailable() {
  if (_magikaAvailable !== null) return _magikaAvailable;
  try {
    execSync('which magika', { stdio: 'pipe', timeout: 1000 });
    _magikaAvailable = true;
  } catch {
    _magikaAvailable = false;
  }
  return _magikaAvailable;
}

// file コマンド利用可能チェック
let _fileAvailable = null;
function isFileAvailable() {
  if (_fileAvailable !== null) return _fileAvailable;
  try {
    execSync('which file', { stdio: 'pipe', timeout: 1000 });
    _fileAvailable = true;
  } catch {
    _fileAvailable = false;
  }
  return _fileAvailable;
}

/**
 * ファイルタイプ判定（メイン関数）
 */
function detectFileType(filePath) {
  if (_cache.has(filePath)) return _cache.get(filePath);

  if (!fs.existsSync(filePath)) {
    const r = { label: 'missing', score: 0, source: 'none' };
    _cache.set(filePath, r);
    return r;
  }

  // 1. magika 試行
  if (isMagikaAvailable()) {
    try {
      const r = spawnSync('magika', ['--json', filePath], { encoding: 'utf8', timeout: 5000 });
      if (r.status === 0) {
        const json = JSON.parse(r.stdout);
        // magikaの出力形式: { path, result: { output: { label, score } } } のような構造
        const output = Array.isArray(json) ? json[0] : json;
        const label = output?.result?.output?.label || output?.output?.label || output?.label;
        const score = output?.result?.output?.score || output?.output?.score || output?.score || 0.9;
        if (label) {
          const result = { label: String(label).toLowerCase(), score, source: 'magika' };
          _cache.set(filePath, result);
          return result;
        }
      }
    } catch {}
  }

  // 2. file コマンド試行
  if (isFileAvailable()) {
    try {
      const r = spawnSync('file', ['-b', '--mime-type', filePath], { encoding: 'utf8', timeout: 2000 });
      if (r.status === 0 && r.stdout) {
        const mime = r.stdout.trim();
        const label = mimeToLabel(mime);
        const result = { label, score: 0.8, source: 'file', mime };
        _cache.set(filePath, result);
        return result;
      }
    } catch {}
  }

  // 3. 拡張子ベース（最終fallback）
  const ext = path.extname(filePath).toLowerCase().replace(/^\./, '');
  const label = extToLabel(ext);
  const result = { label, score: 0.5, source: 'extension' };
  _cache.set(filePath, result);
  return result;
}

function mimeToLabel(mime) {
  if (!mime) return 'unknown';
  if (mime.startsWith('text/')) {
    if (mime.includes('html')) return 'html';
    if (mime.includes('xml')) return 'xml';
    if (mime.includes('javascript')) return 'javascript';
    return 'text';
  }
  if (mime === 'application/json') return 'json';
  if (mime === 'application/pdf') return 'pdf';
  if (mime === 'application/zip') return 'zip';
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('audio/')) return 'audio';
  if (mime.startsWith('video/')) return 'video';
  if (mime === 'application/x-executable' || mime === 'application/x-mach-binary' || mime === 'application/x-dosexec') {
    return 'executable';
  }
  if (mime.includes('x-pem') || mime.includes('x-x509')) return 'pem';
  return 'binary';
}

function extToLabel(ext) {
  const MAP = {
    txt: 'text', md: 'markdown', json: 'json', yaml: 'yaml', yml: 'yaml',
    js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
    py: 'python', rb: 'ruby', go: 'go', rs: 'rust', java: 'java',
    html: 'html', css: 'css', xml: 'xml',
    png: 'image', jpg: 'image', jpeg: 'image', gif: 'image', webp: 'image', svg: 'image',
    mp3: 'audio', wav: 'audio', mp4: 'video', mov: 'video',
    pdf: 'pdf', zip: 'zip', tar: 'tar', gz: 'gzip',
    pem: 'pem', key: 'pem', crt: 'pem', cer: 'pem', p12: 'binary',
    env: 'env', sh: 'shell', bash: 'shell', exe: 'executable',
  };
  return MAP[ext] || 'unknown';
}

/**
 * 拡張子から期待されるlabelを取得（file-type-verify-gateで使用）
 */
function expectedLabelFromExtension(filePath) {
  const ext = path.extname(filePath).toLowerCase().replace(/^\./, '');
  return extToLabel(ext);
}

/**
 * labelが機密扱いか（secret-scan-guard 強化で使用）
 */
function isSecretLike(label) {
  return ['pem', 'env', 'binary'].includes(label);
}

/**
 * labelが実行ファイルか（download-guard 強化で使用）
 */
function isExecutable(label) {
  return label === 'executable' || label === 'shell';
}

module.exports = {
  detectFileType,
  expectedLabelFromExtension,
  isSecretLike,
  isExecutable,
  isMagikaAvailable,
  isFileAvailable,
};
