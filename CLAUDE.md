# CLAUDE.md

## Project overview

`mui-nested-menu` — npm package providing infinitely nested menu components for MUI (Material UI). Monorepo managed with Yarn workspaces and Turborepo.

## Monorepo structure

```
apps/docs/                          # Docs site (Vite + React 19 + MUI v7)
packages/mui-nested-menu/           # The published npm package
packages/ui/                        # Internal Emotion-based UI components (used by docs)
packages/common/                    # Shared types/utils
```

## Key commands

```sh
yarn docs start          # Run docs site on localhost:1000
yarn docs build          # Build docs for production
yarn menu publish:patch  # Bump patch version, build, and publish to npm
yarn menu dist           # Build package without publishing
yarn lint                # Run eslint + prettier + sort-package-json
```

## Important files

- `packages/mui-nested-menu/package.template.json` — **The published package.json**. Peer deps are defined here, NOT in the regular package.json.
- `packages/mui-nested-menu/package.json` — Dev/build config only. Direct deps here are for local development.
- `packages/mui-nested-menu/dist/` — Built output that gets published to npm.
- `apps/docs/package.json` — Docs site deps. Keep MUI version aligned with the main package.

## Publishing workflow

1. Update root `README.md` changelog table
2. Run `yarn menu publish:patch` (or minor/major) from repo root
3. Authenticate with npm 2FA when prompted
4. If the script fails mid-way (e.g. auth issue), the build may already be in `dist/` — just run `cd packages/mui-nested-menu/dist && npm publish`
5. Commit version bump changes and push

See `packages/mui-nested-menu/README.md` for detailed publishing notes.

## Gotchas

- **Peer deps live in `package.template.json`**, not `package.json`. When adding support for new major versions of MUI or React, update both files.
- **Postinstall runs** `yarn deduplicate && yarn lint:sortpackages` — this may reformat package.json files (indentation, key ordering). Commit these changes.
- **Pre-commit hooks** run lint-staged with prettier on staged files.
- **`packages/ui` uses Storybook 6** which doesn't support React 19. The peer dep warnings during install are harmless — Storybook isn't used during docs builds.
- **Parcel caching** can cause stale builds. If builds behave unexpectedly: `rm -rf **/.parcel-cache`
- **The docs site** wraps demos in `<MTP theme={createTheme()}>` (MUI's ThemeProvider) — this is separate from the `packages/ui` ThemeProvider used for the site shell.
- **TypeScript versions vary** across packages. The docs and main package use TS 5.x. The `packages/ui` package still uses TS 4.9.x.
- **`tsc --noEmit` in docs** will show errors from `packages/ui` (custom Emotion Theme type not augmented). These are pre-existing and don't affect the Vite build.
