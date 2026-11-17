# Author Notes

The package is built with [tsup](https://tsup.egoist.dev/) and published from `dist/`. The repo uses pnpm 10.28:
run every command with `pnpm` (or `npx -y pnpm@10.28.0` if your global pnpm is a different major version).

## Releasing

1. Update `CHANGELOG.md` at the repo root (and the changelog table in the root `README.md`).
2. Set the new version in **both** `packages/mui-nested-menu/package.json` and `package.template.json`.
3. Check everything on a clean tree, from the repo root:

    ```sh
    pnpm --filter mui-nested-menu typecheck
    pnpm --filter mui-nested-menu test
    scripts/test-matrix.sh     # MUI 5/6/7/9 x React 18/19: tsc --noEmit and vitest
    scripts/smoke-dist.sh      # builds dist, npm packs it, require() and import() under plain Node
    ```

4. Publish (needs `npm login` and your 2FA code):

    ```sh
    pnpm --filter mui-nested-menu release
    ```

    `release` runs `dist` (clean, tsup build, copy) and then `npm publish` from `dist/`.

If publishing fails part-way (for example the auth expired), the build is already in `dist/`. Log in again and run
`cd packages/mui-nested-menu/dist && npm publish`.

## Scripts

| Script      | What it does                                                                                                                                                                                                                                               |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `build`     | tsup: `dist/index.js` (CJS), `dist/index.mjs` (ESM), `dist/index.d.ts`, `dist/index.d.mts`. Both bundles start with `"use client"`.                                                                                                                        |
| `dist`      | `clean`, `build`, then `copy`.                                                                                                                                                                                                                             |
| `copy`      | `scripts/copy-dist.mjs`: copies the root `README.md`, `LICENSE` and `package.template.json` (as `package.json`) into `dist/`. In the README copy, `utm_medium=github` becomes `utm_medium=npm-readme`, so analytics can tell GitHub and npm readers apart. |
| `release`   | `dist`, then `npm publish` from `dist/`.                                                                                                                                                                                                                   |
| `test`      | vitest (jsdom, Testing Library, user-event).                                                                                                                                                                                                               |
| `typecheck` | `tsc --noEmit` over `src` and `tests`.                                                                                                                                                                                                                     |

## Key files

| File                    | Purpose                                                                                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json`          | Dev dependencies and scripts. **Not** what gets published. Its `main`, `module` and `types` point at `src`, so the docs workspace builds from source. |
| `package.template.json` | **The published `package.json`.** Version, `exports` map, `sideEffects` and peer dependencies live here. Copied to `dist/package.json` by `copy`.     |
| `tsup.config.ts`        | Bundling. MUI, Emotion and React are external. MUI is imported from the `@mui/material` root so Node ESM resolves it.                                 |
| `dist/`                 | Built output that gets published to npm. Not committed.                                                                                               |

## Peer dependencies vs dependencies

-   `package.json` has MUI, React and Emotion as **direct dependencies** (for local development and the tests).
-   `package.template.json` has them as **peer dependencies** (what npm consumers see).
-   When adding support for a new MUI or React major, update the peer range in `package.template.json`, add the
    version to `scripts/test-matrix.sh` and `scripts/smoke-dist.sh`, and make sure both pass.
-   Don't use props MUI has removed in a newer major (`PaperProps`, `disableEscapeKeyDown`, ...): the matrix
    type-checks against every supported MUI.

## Versioning

The version is set by hand in `package.json` and `package.template.json`. Nothing reads it from npm any more.
