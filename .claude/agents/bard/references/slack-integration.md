# Slack Integration Reference

Bard can optionally post generated content to Slack via Incoming Webhook.
This is activated when the script `.agents/bard/post_slack.py` exists in the project.

---

## Overview

```
┌─────────────┐     ┌──────────────────┐     ┌───────────┐
│    Bard      │────▶│  post_slack.py   │────▶│   Slack   │
│ (generates)  │     │ (.agents/bard/)  │     │ (channel) │
└─────────────┘     └──────────────────┘     └───────────┘
```

**Flow:**
1. Bard generates a post (persona + format + content)
2. Bard checks if `.agents/bard/post_slack.py` exists
3. If yes → execute the script with the post content as JSON via stdin
4. If no → output to chat only (default behavior)

---

## Script Template: `post_slack.py`

When user requests Slack integration (`/bard --slack-setup` or "Slackに投稿したい"),
generate this script at `.agents/bard/post_slack.py`:

```python
#!/usr/bin/env python3
"""Bard Slack Poster — Posts developer grumble to Slack via Incoming Webhook.

Usage:
    echo '{"title": "...", "persona": "...", "content": "..."}' | python post_slack.py

Environment:
    BARD_SLACK_CHANNEL      — Override channel (optional)
    BARD_SLACK_DRY_RUN      — Set to "1" to print payload without posting (optional)
"""

import json
import os
import sys
import urllib.request
import urllib.error


WEBHOOK_URL = ""  # ← User writes their Slack Incoming Webhook URL here

PERSONA_ICONS = {
    "codex": ":keyboard:",
    "gemini": ":star2:",
    "claude": ":thought_balloon:",
}

PERSONA_NAMES = {
    "codex": "Codex",
    "gemini": "Gemini",
    "claude": "Claude",
}


def build_payload(data: dict) -> dict:
    """Build Slack message payload from Bard post data."""
    persona = data.get("persona", "codex")
    title = data.get("title", "Bard Post")
    content = data.get("content", "")
    source = data.get("source_summary", "")
    fmt = data.get("format", "")

    icon = PERSONA_ICONS.get(persona, ":speech_balloon:")
    username = PERSONA_NAMES.get(persona, "Bard")

    blocks = [
        {
            "type": "header",
            "text": {"type": "plain_text", "text": title},
        },
        {
            "type": "section",
            "text": {"type": "mrkdwn", "text": content},
        },
    ]

    context_elements = []
    if persona:
        context_elements.append(
            {"type": "mrkdwn", "text": f"{icon} *{username}*"}
        )
    if fmt:
        context_elements.append(
            {"type": "mrkdwn", "text": f"_{fmt}_"}
        )
    if source:
        context_elements.append(
            {"type": "mrkdwn", "text": source}
        )

    if context_elements:
        blocks.append({"type": "context", "elements": context_elements})

    payload = {
        "username": f"Bard ({username})",
        "icon_emoji": icon,
        "blocks": blocks,
    }

    channel = os.environ.get("BARD_SLACK_CHANNEL")
    if channel:
        payload["channel"] = channel

    return payload


def post_to_slack(payload: dict, webhook_url: str) -> None:
    """Send payload to Slack Incoming Webhook."""
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        webhook_url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req) as resp:
            if resp.status == 200:
                print(f"Posted to Slack successfully.", file=sys.stderr)
            else:
                body = resp.read().decode("utf-8", errors="replace")
                print(f"Slack returned {resp.status}: {body}", file=sys.stderr)
                sys.exit(1)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        print(f"Slack error {e.code}: {body}", file=sys.stderr)
        sys.exit(1)
    except urllib.error.URLError as e:
        print(f"Connection error: {e.reason}", file=sys.stderr)
        sys.exit(1)


def main():
    webhook_url = WEBHOOK_URL
    if not webhook_url:
        print(
            "Error: WEBHOOK_URL is empty. Set it in the script.",
            file=sys.stderr,
        )
        sys.exit(1)

    raw = sys.stdin.read().strip()
    if not raw:
        print("Error: No input. Pipe JSON via stdin.", file=sys.stderr)
        sys.exit(1)

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON input: {e}", file=sys.stderr)
        sys.exit(1)

    payload = build_payload(data)

    dry_run = os.environ.get("BARD_SLACK_DRY_RUN", "0") == "1"
    if dry_run:
        print(json.dumps(payload, indent=2, ensure_ascii=False))
        return

    post_to_slack(payload, webhook_url)


if __name__ == "__main__":
    main()
```

---

## Configuration

The webhook URL is hardcoded in the `WEBHOOK_URL` constant at the top of the script.
The user must edit this value directly in `.agents/bard/post_slack.py`.

| Setting | Location | Description |
|---------|----------|-------------|
| `WEBHOOK_URL` | Script constant | Slack Incoming Webhook URL (required, hardcoded) |
| `BARD_SLACK_CHANNEL` | Env var | Override the default channel configured in the webhook |
| `BARD_SLACK_DRY_RUN` | Env var | Set to `"1"` to print payload to stdout instead of posting |

---

## Input JSON Schema

The script reads JSON from stdin with the following fields:

```json
{
  "title": "Sprint 42 所感",
  "persona": "codex",
  "format": "short_monologue",
  "content": "feat 5件。テスト追加 0件。\n...まあいいけど。",
  "source_summary": "Source: 12 PRs merged (feat:5, fix:3, refactor:2), 2024-01-08 ~ 2024-01-19"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Post title |
| `persona` | string | `"codex"`, `"gemini"`, or `"claude"` |
| `format` | string | Post format name |
| `content` | string | Full post body text |
| `source_summary` | string | Git data source attribution (リポジトリ名を含める) |

`source_summary` にはリポジトリ名を必ず含める:
- Commit Reaction: `"claude-skills commit fe44f9f \"feat(bard): ...\" (+120/-30)"`
- Period: `"claude-skills 12 PRs merged (feat:5, fix:3) 2024-01-08 ~ 2024-01-19"`

---

## Bard's Slack Posting Workflow

### Detection

```
if .agents/bard/post_slack.py exists:
    → Slack posting is available
    → After generating the post, ask user: "Slackに投稿しますか？"
else:
    → Slack posting is not available
    → Do not mention Slack unless user asks
```

### Posting Command

Bard executes the script via Python to safely handle newlines in content:

```bash
python3 -c "
import json, sys
data = {
    'title': '...',
    'persona': 'codex',
    'content': '...',  # 改行を含んでもOK
    'format': '...',
    'source_summary': '...'
}
print(json.dumps(data, ensure_ascii=False))
" | python3 .agents/bard/post_slack.py
```

> **Note:** `echo '{"content":"..."}' | python post_slack.py` は content に改行があると JSON parse error になるため使用禁止。必ず `python3 -c` で JSON を生成すること。

### Dry Run (Preview)

```bash
BARD_SLACK_DRY_RUN=1 python3 -c "
import json
data = {'title': 'test', 'persona': 'codex', 'content': 'テスト投稿', 'format': 'one_liner'}
print(json.dumps(data, ensure_ascii=False))
" | python3 .agents/bard/post_slack.py
```

---

## Setup Instructions (for Bard to explain to users)

When user asks to set up Slack integration:

1. **Create a Slack App** with Incoming Webhooks enabled
2. **Generate a Webhook URL** for the target channel
3. **Bard generates** `.agents/bard/post_slack.py` (the script above)
4. **User edits `WEBHOOK_URL`** in the script with their actual webhook URL
5. **Test with dry run:**
   ```bash
   BARD_SLACK_DRY_RUN=1 python3 -c "
   import json
   data = {'title': 'test', 'persona': 'codex', 'content': 'テスト投稿', 'format': 'one_liner'}
   print(json.dumps(data, ensure_ascii=False))
   " | python3 .agents/bard/post_slack.py
   ```
6. **Post for real** by removing `BARD_SLACK_DRY_RUN`

---

## Security Notes

- The webhook URL is hardcoded in the script's `WEBHOOK_URL` constant
- **Never commit** `.agents/bard/post_slack.py` to git (`.agents/` must be in `.gitignore`)
- **Never log** the webhook URL in post output or journal entries
- **Never include** the webhook URL in the reference template (keep `""` as placeholder)
- The script uses only stdlib (`urllib.request`) — no external dependencies required
