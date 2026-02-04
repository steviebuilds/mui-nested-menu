# Author Notes

## Publishing to npm

### Quick publish (when scripts cooperate)

From the repo root:

```sh
yarn menu publish:patch   # or publish:minor / publish:major
```

This runs: `prepare` → `npm version` → `dist` (clean + parcel build + copy) → `npm publish` from `dist/`.

### Manual publish (when parcel or scripts act up)

```sh
# From repo root
rm -rf **/.parcel-cache **/node_modules
yarn

# Bump version manually
cd packages/mui-nested-menu
npm version patch   # bumps package.json AND syncs package.template.json via postversion hook

# Build
yarn dist

# Publish from dist/ (you'll need npm 2FA)
cd dist
npm publish
cd ../../..
```

### If publish fails mid-script (e.g. auth expired)

The version bump and build may have already completed. Check `dist/package.json` for the version. If the build is there, just re-auth and publish:

```sh
npm login
cd packages/mui-nested-menu/dist && npm publish
```

## Key files

| File | Purpose |
|---|---|
| `package.json` | Dev dependencies + build scripts. **Not** what gets published. |
| `package.template.json` | **This is the published package.json.** Peer deps live here. Copied to `dist/` during build. |
| `dist/` | Built output that gets published to npm. Contains index.js, module.js, index.d.ts, package.json (from template), README, LICENSE. |

## Peer dependencies vs dependencies

- `package.json` has MUI, React, Emotion as **direct dependencies** (for local dev/build).
- `package.template.json` has them as **peer dependencies** (what npm consumers see).
- When adding support for a new MUI/React major version, update **both** files.

## Version syncing

- `prepare` script: fetches the current published version from npm and sets it locally.
- `postversion` script: after `npm version` bumps `package.json`, it syncs the new version into `package.template.json` using `fx`.
- After publishing, commit the version bump changes and push.

## Build

Uses Parcel. The build outputs:
- `dist/index.js` — CJS bundle
- `dist/module.js` — ESM bundle
- `dist/index.d.ts` — TypeScript declarations

The `set-package:build` / `set-package:dev` scripts toggle `module` and `types` fields between dist paths (for build) and src paths (for local dev).

## Changelog

Update the changelog table in the **root** `README.md` when publishing a new version.
