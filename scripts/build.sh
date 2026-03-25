#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
echo "🛠️  Building ChainProfile Move package"
sui move build --path contracts "$@"
