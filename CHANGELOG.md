# Changelog

All notable changes to `mui-nested-menu` are listed here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[semantic versioning](https://semver.org/).

## [4.1.0] - 2026-11-17

Mostly additions and bug fixes. No prop, type or export was removed or renamed, but a few behaviours changed: see Changed.

### Added

-   `placement` prop (`'right'` or `'left'`) on `NestedMenuItem`, `NestedDropdown`, `ContextMenu` and
    `nestedMenuItemsFromObject`. Submenus can open to the left, and the arrow keys follow the side (#33).
-   `SubmenuProps` on `NestedDropdown` and `ContextMenu`, and `MenuProps` on `nestedMenuItemsFromObject`: props
    for the submenus at every depth. `NestedDropdown`'s `MenuProps` still means the root menu (#46).
-   `renderLabel` in menu data. On the `NestedDropdown` root data it renders the button label (#39, #50).
-   `MenuItemProps` in menu data: extra props for that item's MUI `MenuItem`, such as `className`, `divider` or
    `data-testid`.
-   `MenuProps` and `SubmenuProps` on `ContextMenu`.
-   `aria-haspopup="menu"` and `aria-expanded` on parent items.
-   MUI 9 in the `@mui/material` peer range, so a fresh install with the current MUI no longer fails with
    `ERESOLVE`. MUI 5, 6, 7 and 9 are tested with React 18 and 19, and MUI 5 also with React 17.
-   Tests (vitest and Testing Library), a MUI x React compatibility matrix (`scripts/test-matrix.sh`) and a
    packaging smoke test (`scripts/smoke-dist.sh`).

### Fixed

-   Keyboard: the arrow keys no longer leave several submenus open, and no key crashes after a submenu has been
    closed. Focus moving out of a submenu closes it, so only the active path is ever open (#9, #55, #40).
-   Escape closes one submenu level and returns focus to its parent item.
-   Touch devices: a tap on a parent item toggles its submenu, and the tap that opens a submenu can no longer select an
    item in it (#45).
-   A `callback` on an item with children now fires when the row is clicked. Clicks on nested items inside
    `ContextMenu` now fire their callbacks and close the menu (#34).
-   `MenuProps` with `style`, `sx`, `className` or paper props no longer break hover-to-close, and `className`
    and `hideBackdrop` reach the submenu (#44, #43, #54).
-   Long submenus scroll with the mouse wheel and trackpad (#2).
-   `userEvent.click` works on items inside a submenu (#66).
-   Items with the same label no longer produce duplicate React keys. Items are keyed by `uid`, then by label
    and position (#42).
-   `ContextMenu` no longer calls a hook conditionally.
-   Moving the pointer from an item onto its submenu no longer closes and reopens the submenu with React 18.

### Changed

-   The package is built with tsup instead of Parcel: `dist/index.js` (CommonJS), `dist/index.mjs` (ES module)
    and type declarations for both, with `"use client"` at the top of both bundles. An `exports` map makes the
    package load with `require()` and with Node ESM `import` for MUI 5, 6, 7 and 9, and in the Next.js app
    router without `transpilePackages` (#20, #29, #63).
-   `sideEffects: false`, so bundlers can tree-shake the package.
-   The new `exports` map means deep imports such as `mui-nested-menu/index.js` no longer resolve. Import from
    `mui-nested-menu`.
-   Clicking a parent item opens its submenu and fires its `callback`; the menu stays open.
-   Escape closes one submenu level at a time instead of the whole menu.
-   `PaperProps` on `Menu` is ignored by MUI 9, so use `slotProps.paper` there (MUI 5.14 and later).
-   Hover opening and closing is the same as before. A parent item now also opens on click.
-   The repository uses pnpm. Publishing is `pnpm --filter mui-nested-menu release`.

## [4.0.3]

-   Add MUI v7 to the peer dependency range. Upgrade the docs to React 19 and Vite 5.

## [4.0.2]

-   Upgrade to MUI 7 and fix TypeScript compatibility.

## [4.0.1]

-   Add React 19 to the peer dependencies.

## [4.0.0]

-   Upgrade to MUI 6.3.1. Probably not breaking.

## [3.4.0]

-   Fix the `disabled` prop. Add a `delay` prop to `NestedMenuItem`.

## [3.2.2]

-   Documentation updates.

## [3.2.1]

-   Fix the 4 level import of `@mui/material/styles/styled`
    ([#32](https://github.com/steviebuilds/mui-nested-menu/pull/32)).

## [3.2.0]

-   Provide the event and the item in the callback.

## [3.1.0]

-   Breaking: make the `disabled` and `sx` props available. Fix the typo `nesteMenuItemsFromObjectProps`, now
    `nestedMenuItemsFromObjectProps`.

## [3.0.0]

-   Support for ESM and CJS modules.
