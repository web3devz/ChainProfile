#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v sui >/dev/null 2>&1; then
  echo "Error: sui CLI is required to publish. Please install the OneChain CLI (one) or Sui CLI." >&2
  exit 1
fi

PUBLISH_CMD=(sui client publish --gas-budget 50000000 --path contracts "$@")
echo "🚀  Publishing ChainProfile package to OneChain testnet"
echo "Command: ${PUBLISH_CMD[*]}"
"${PUBLISH_CMD[@]}"
