#!/usr/bin/env node
'use strict';

/**
 * _ogsm-review-api.js — Anthropic API呼び出しヘルパー
 *
 * ogsm-review.js から execSync で呼ばれる。
 * stdin: JSON { model, max_tokens, temperature, system, messages }
 * stdout: JSON (APIレスポンスのcontent[0].text)
 */

const https = require('https');

function main() {
  let input = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => { input += chunk; });
  process.stdin.on('end', () => {
    const params = JSON.parse(input);
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      process.stderr.write('ANTHROPIC_API_KEY not set');
      process.exit(1);
    }

    const body = JSON.stringify({
      model: params.model,
      max_tokens: params.max_tokens || 1024,
      temperature: params.temperature ?? 0.0,
      system: params.system,
      messages: params.messages,
    });

    const options = {
      hostname: 'api.anthropic.com',
      port: 443,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.content && response.content[0]) {
            process.stdout.write(JSON.stringify({ text: response.content[0].text }));
          } else {
            process.stderr.write('Unexpected response: ' + data.substring(0, 200));
            process.exit(1);
          }
        } catch (e) {
          process.stderr.write('Parse error: ' + e.message);
          process.exit(1);
        }
      });
    });

    req.on('error', (e) => {
      process.stderr.write('Request error: ' + e.message);
      process.exit(1);
    });

    req.write(body);
    req.end();
  });
}

main();
