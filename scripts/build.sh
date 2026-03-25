#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
echo "🛠  Building ChainProfile Move package..."
one move build --path contracts "$@"
echo "✅ Build complete."
