#!/usr/bin/env bash
# Compatibility matrix: type-check and run the test suite against each MUI x React pair.
#
# Usage: scripts/test-matrix.sh [mui:react ...]     e.g. scripts/test-matrix.sh 5:18 7:19
# With no arguments it runs MUI 5 x React 17 and all eight combinations of MUI 5, 6, 7, 9 x React 18, 19, one at a time. Each combination gets a throwaway
# project under /tmp with matching @types/react and testing libraries, then `tsc --noEmit` (covers
# #53) and vitest run on a copy of src/ and tests/. Needs network (pnpm install) and Node >= 22.
set -uo pipefail

PNPM=(npx -y pnpm@10.28.0)
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/packages/mui-nested-menu"
BASE="$(mktemp -d /tmp/mnm-matrix.XXXXXX)"
trap '[ -n "${KEEP:-}" ] || rm -rf "$BASE"' EXIT

COMBOS=("$@")
if [ ${#COMBOS[@]} -eq 0 ]; then
    COMBOS=(5:17 5:18 5:19 6:18 6:19 7:18 7:19 9:18 9:19)
fi

RESULTS=()
FAILED=0

run_combo() {
    local mui="${1%%:*}" react="${1##*:}"
    local dir="$BASE/mui$mui-react$react"
    local install="skipped" types="skipped" tests="skipped"
    # React 17 needs Testing Library 12 (which brings @testing-library/dom 8).
    local rtl="^16" tldom="\"@testing-library/dom\": \"^10\","
    if [ "$react" = 17 ]; then rtl="^12" tldom=""; fi
    mkdir -p "$dir"
    cp -r "$PKG/src" "$PKG/tests" "$PKG/vitest.config.ts" "$dir/"

    cat >"$dir/package.json" <<JSON
{
    "name": "matrix-mui$mui-react$react",
    "private": true,
    "dependencies": {
        "@emotion/react": "^11.14.0",
        "@emotion/styled": "^11.14.0",
        "@mui/material": "^$mui",
        "react": "^$react",
        "react-dom": "^$react"
    },
    "devDependencies": {
        $tldom
        "@testing-library/react": "$rtl",
        "@testing-library/user-event": "^14",
        "@types/node": "^22",
        "@types/react": "^$react",
        "@types/react-dom": "^$react",
        "jsdom": "^31",
        "typescript": "5.7.3",
        "vite": "^7",
        "vitest": "^4 || ^5"
    },
    "pnpm": { "onlyBuiltDependencies": ["esbuild"] }
}
JSON
    # Only src, tests and the vitest config are type-checked here.
    cat >"$dir/tsconfig.json" <<'JSON'
{
    "extends": "./tsconfig.base.json",
    "include": ["src/**/*", "tests/**/*", "vitest.config.ts"]
}
JSON
    node -e '
        const fs = require("fs");
        // tsconfig.json may have trailing commas (prettier adds them).
        const c = JSON.parse(fs.readFileSync(process.argv[1], "utf8").replace(/,(\s*[}\]])/g, "$1"));
        delete c.include; delete c.exclude;
        fs.writeFileSync(process.argv[2], JSON.stringify(c));
    ' "$PKG/tsconfig.json" "$dir/tsconfig.base.json"

    echo "=== MUI $mui x React $react: installing" >&2
    if (cd "$dir" && "${PNPM[@]}" install --ignore-workspace --ignore-scripts >"$dir/install.log" 2>&1); then
        install="ok"
    else
        install="FAILED"
        tail -15 "$dir/install.log" >&2
    fi

    local versions="-"
    if [ "$install" = ok ]; then
        versions="$(cd "$dir" && node -p '
            const v = (n) => require(n + "/package.json").version;
            `mui ${v("@mui/material")}, react ${v("react")}, @types/react ${v("@types/react")}`')"

        echo "=== MUI $mui x React $react: tsc --noEmit ($versions)" >&2
        if (cd "$dir" && ./node_modules/.bin/tsc --noEmit -p . >"$dir/tsc.log" 2>&1); then
            types="ok"
        else
            types="FAILED"
            head -20 "$dir/tsc.log" >&2
        fi

        echo "=== MUI $mui x React $react: vitest" >&2
        if (cd "$dir" && ./node_modules/.bin/vitest run >"$dir/vitest.log" 2>&1); then
            tests="ok ($(grep -oE 'Tests +[0-9]+ passed' "$dir/vitest.log" | grep -oE '[0-9]+') passed)"
        else
            tests="FAILED"
            grep -E "FAIL|×|Error" "$dir/vitest.log" | head -20 >&2
        fi
    fi

    [ "$install" = ok ] && [ "$types" = ok ] && [[ "$tests" == ok* ]] || FAILED=1
    RESULTS+=("| MUI $mui | React $react | $versions | $types | $tests |")
    [ -n "${KEEP:-}" ] || rm -rf "$dir"
}

for combo in "${COMBOS[@]}"; do
    run_combo "$combo"
done

echo
echo "| MUI | React | Resolved versions | tsc --noEmit | vitest |"
echo "|---|---|---|---|---|"
printf '%s\n' "${RESULTS[@]}"
exit $FAILED
