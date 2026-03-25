#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v one >/dev/null 2>&1; then
  echo "❌ 'one' CLI not found. Install it with:" >&2
  echo "   cargo install --locked --git https://github.com/one-chain-labs/onechain.git one_chain --features tracing" >&2
  exit 1
fi

echo "🔗 Switching to OneChain testnet..."
one client new-env --alias testnet --rpc https://rpc-testnet.onelabs.cc:443 2>/dev/null || true
one client switch --env testnet

echo "🚀 Publishing ChainProfile to OneChain testnet..."
RESULT=$(one client publish --gas-budget 100000000 --path contracts --json "$@")

PACKAGE_ID=$(echo "$RESULT" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for obj in data.get('objectChanges', []):
    if obj.get('type') == 'published':
        print(obj['packageId'])
        break
")

echo ""
echo "✅ Deployed! Package ID: $PACKAGE_ID"
echo ""
echo "Add to your .env file:"
echo "VITE_PACKAGE_ID=$PACKAGE_ID"
