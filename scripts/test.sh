#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
echo "✅  Running ChainProfile Move tests"
sui move test --path contracts "$@"
