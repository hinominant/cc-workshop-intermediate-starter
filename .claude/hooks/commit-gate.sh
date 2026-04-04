#!/bin/bash
# commit-gate.sh
# PreToolUse hook: git commit / git push を物理的にブロックし、
# テスト通過を強制する。プロンプトのルールでは守れないため、
# 仕組みで強制する（OPS-023: 5回再発の根本対策）。
#
# Install: .claude/hooks/commit-gate.sh
# Settings: settings.json の hooks.PreToolUse に登録

INPUT=$(cat)

TOOL_NAME=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_name',''))" 2>/dev/null)
COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('command',''))" 2>/dev/null)

if [ "$TOOL_NAME" != "Bash" ]; then
  exit 0
fi

# git commit または git push をインターセプト
IS_COMMIT=false
IS_PUSH=false
if echo "$COMMAND" | grep -q "git commit"; then
  IS_COMMIT=true
fi
if echo "$COMMAND" | grep -q "git push"; then
  IS_PUSH=true
fi

if [ "$IS_COMMIT" = false ] && [ "$IS_PUSH" = false ]; then
  exit 0
fi

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
if [ -z "$REPO_ROOT" ]; then
  exit 0
fi

ACTION="git commit"
if [ "$IS_PUSH" = true ]; then
  ACTION="git push"
fi

# テストランナーを自動検出して実行
TEST_PASSED=false

# Python (pytest)
if [ -d "$REPO_ROOT/tests" ] && [ -f "$REPO_ROOT/pyproject.toml" ]; then
  if command -v uv >/dev/null 2>&1; then
    RESULT=$(cd "$REPO_ROOT" && uv run pytest tests/ -q --tb=short 2>&1)
  else
    RESULT=$(cd "$REPO_ROOT" && python3 -m pytest tests/ -q --tb=short 2>&1)
  fi
  EXIT_CODE=$?
  if [ $EXIT_CODE -eq 0 ]; then
    TEST_PASSED=true
  fi
# Node.js (npm test)
elif [ -f "$REPO_ROOT/package.json" ]; then
  RESULT=$(cd "$REPO_ROOT" && npm test 2>&1)
  EXIT_CODE=$?
  if [ $EXIT_CODE -eq 0 ]; then
    TEST_PASSED=true
  fi
# Go
elif [ -f "$REPO_ROOT/go.mod" ]; then
  RESULT=$(cd "$REPO_ROOT" && go test ./... 2>&1)
  EXIT_CODE=$?
  if [ $EXIT_CODE -eq 0 ]; then
    TEST_PASSED=true
  fi
# テストなし → 通過（ブロックしない）
else
  TEST_PASSED=true
  RESULT="(テストランナー未検出 — スキップ)"
fi

if [ "$TEST_PASSED" = false ]; then
  cat <<MSG >&2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⛔ テスト失敗 — $ACTION をブロック
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
操作:   $ACTION
理由:   テストが通過していません
対応:   テストを修正してから再度コミットしてください

テスト結果:
$RESULT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MSG
  exit 2
fi

echo ""
echo "┌─────────────────────────────────────"
echo "│ ✅ テスト通過 — $ACTION を許可"
echo "└─────────────────────────────────────"
echo ""
exit 0
