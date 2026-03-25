#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
echo "🧪 Running Move tests..."
one move test --path contracts "$@"
echo "✅ Tests passed."
