#!/usr/bin/env bash
# Packaging smoke test: build dist, `npm pack` it, then install the tarball in a throwaway project for
# each MUI version and check that both `require()` and a Node ESM `import()` load it and render a
# NestedDropdown and a NestedMenuItem to a string with react-dom/server under plain Node.
#
# React 17 combos also run a tiny webpack 5 production build (target node) of an ESM entry that imports the
# package, then run the bundle. React 17 has no exports map, so this catches an ESM build that imports
# 'react/jsx-runtime' (Node ESM: ERR_MODULE_NOT_FOUND; webpack 5: "fully specified" resolve error).
#
# Usage: scripts/smoke-dist.sh [mui:react ...]     e.g. scripts/smoke-dist.sh 5:17 7:19
# With no arguments it runs MUI 5 with React 17, and MUI 5, 6, 7 and 9 with React 18 and 19. Needs network.
set -uo pipefail

PNPM=(npx -y pnpm@10.28.0)
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/packages/mui-nested-menu"
BASE="$(mktemp -d /tmp/mnm-smoke.XXXXXX)"
trap '[ -n "${KEEP:-}" ] || rm -rf "$BASE"' EXIT

COMBOS=("$@")
if [ ${#COMBOS[@]} -eq 0 ]; then
    COMBOS=(5:17 5:18 5:19 6:18 6:19 7:18 7:19 9:18 9:19)
fi

echo "=== building dist" >&2
(cd "$PKG" && "${PNPM[@]}" run dist >"$BASE/build.log" 2>&1) || { cat "$BASE/build.log" >&2; exit 1; }

for file in index.js index.mjs index.d.ts index.d.mts package.json README.md LICENSE; do
    [ -f "$PKG/dist/$file" ] || { echo "dist/$file is missing" >&2; exit 1; }
done
for file in index.js index.mjs; do
    if grep -q 'react/jsx-runtime' "$PKG/dist/$file"; then
        echo "dist/$file imports react/jsx-runtime, which React 17 cannot resolve from ESM" >&2
        exit 1
    fi
    [ "$(head -n 1 "$PKG/dist/$file")" = '"use client";' ] || { echo "dist/$file does not start with \"use client\"" >&2; exit 1; }
done
if grep -q 'utm_medium=github' "$PKG/dist/README.md"; then
    echo "dist/README.md still has utm_medium=github" >&2
    exit 1
fi

(cd "$PKG/dist" && npm pack --pack-destination "$BASE" >"$BASE/pack.log" 2>&1) || { cat "$BASE/pack.log" >&2; exit 1; }
TARBALL="$(ls "$BASE"/mui-nested-menu-*.tgz)"
echo "=== packed $(basename "$TARBALL") ($(tar -tzf "$TARBALL" | wc -l) files)" >&2

# Written once, run by both module systems. Plain JS, no JSX, so no build step is needed.
CHECK_BODY='
const React = require("react");
const { renderToString } = require("react-dom/server");
// `mui` comes from the caller so that it is the same module instance (CJS or ESM) the package loaded.
module.exports = function check(lib, mui, label) {
    const menu = renderToString(
        React.createElement(lib.NestedDropdown, {
            menuItemsData: { label: "Menu", items: [{ label: "One" }] },
        })
    );
    // MUI 9 requires menu items to sit inside a MenuList.
    const item = renderToString(
        React.createElement(
            mui.MenuList,
            null,
            React.createElement(
                lib.NestedMenuItem,
                { label: "Parent", parentMenuOpen: false },
                React.createElement("div", null, "child")
            )
        )
    );
    if (!menu.includes("Menu") || !item.includes("Parent")) {
        throw new Error(label + ": unexpected markup: " + menu.slice(0, 120) + " | " + item.slice(0, 120));
    }
    return label + " ok (" + Object.keys(lib).sort().join(", ") + ")";
};
'

RESULTS=()
FAILED=0

run_combo() {
    local mui="${1%%:*}" react="${1##*:}"
    local dir="$BASE/mui$mui-react$react"
    local install="FAILED" req="-" esm="-" pack="-" versions="-"
    mkdir -p "$dir"
    cat >"$dir/package.json" <<JSON
{ "name": "smoke-mui$mui-react$react", "private": true, "version": "0.0.0" }
JSON
    printf '%s' "$CHECK_BODY" >"$dir/check.cjs"
    cat >"$dir/cjs.cjs" <<'JS'
const check = require('./check.cjs');
console.log(check(require('mui-nested-menu'), require('@mui/material'), 'require'));
JS
    cat >"$dir/esm.mjs" <<'JS'
import { createRequire } from 'node:module';
const check = createRequire(import.meta.url)('./check.cjs');
console.log(check(await import('mui-nested-menu'), await import('@mui/material'), 'import'));
JS
    # Webpack entry: ESM syntax in a .js file (not strict), so the package resolves through its "import" condition.
    cat >"$dir/entry.js" <<'JS'
import * as MuiMenu from 'mui-nested-menu';
import * as Mui from '@mui/material';
import React from 'react';
import { renderToString } from 'react-dom/server';

const html = renderToString(
    React.createElement(
        Mui.MenuList,
        null,
        React.createElement(MuiMenu.NestedMenuItem, { label: 'Parent', parentMenuOpen: false }, React.createElement('div', null, 'child'))
    )
);
if (!html.includes('Parent')) throw new Error('webpack bundle rendered: ' + html.slice(0, 120));
console.log('webpack bundle ok');
JS

    echo "=== MUI $mui x React $react: installing" >&2
    if (cd "$dir" && npm install --no-audit --no-fund --loglevel=error \
        "@mui/material@^$mui" "@emotion/react@^11" "@emotion/styled@^11" "react@^$react" "react-dom@^$react" \
        "$TARBALL" >"$dir/install.log" 2>&1); then
        install="ok"
        versions="$(cd "$dir" && node -p '
            const v = (n) => require(n + "/package.json").version;
            `mui ${v("@mui/material")}, react ${v("react")}`')"
        if out="$(cd "$dir" && node cjs.cjs 2>&1)"; then req="ok"; else req="FAILED"; echo "$out" | head -10 >&2; fi
        if out="$(cd "$dir" && node esm.mjs 2>&1)"; then esm="ok"; else esm="FAILED"; echo "$out" | head -10 >&2; fi
        if [ "$react" = 17 ]; then
            pack="FAILED"
            if (cd "$dir" && npm install --no-save --no-audit --no-fund --loglevel=error webpack@^5 webpack-cli@^5 >"$dir/webpack-install.log" 2>&1) \
                && out="$(cd "$dir" && ./node_modules/.bin/webpack --mode production --target node --entry ./entry.js --output-path ./out --output-filename bundle.cjs 2>&1)" \
                && out="$out"$'\n'"$(cd "$dir" && node out/bundle.cjs 2>&1)" && echo "$out" | grep -q 'webpack bundle ok'; then
                pack="ok"
            else
                echo "${out:-$(tail -15 "$dir/webpack-install.log")}" | head -20 >&2
            fi
        fi
    else
        tail -15 "$dir/install.log" >&2
    fi

    [ "$install" = ok ] && [ "$req" = ok ] && [ "$esm" = ok ] && [ "$pack" != FAILED ] || FAILED=1
    RESULTS+=("| MUI $mui | React $react | $versions | $req | $esm | $pack |")
    [ -n "${KEEP:-}" ] || rm -rf "$dir"
}

for combo in "${COMBOS[@]}"; do
    run_combo "$combo"
done

echo
echo "| MUI | React | Resolved versions | require() | import() | webpack 5 build + run |"
echo "|---|---|---|---|---|---|"
printf '%s\n' "${RESULTS[@]}"
exit $FAILED
