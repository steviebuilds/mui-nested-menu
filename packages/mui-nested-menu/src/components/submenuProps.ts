import type { MenuProps } from '@mui/material';

type SubmenuMenuProps = Partial<Omit<MenuProps, 'children'>>;

// pointer-events is inherited, so the paper needs its own value to take pointer events back from the root.
const paperTakesPointerEvents = { '& .MuiPaper-root': { pointerEvents: 'auto' } };

/**
 * Merge a user's `MenuProps` with what a submenu needs to keep its hover and pointer handling:
 * the (invisible) popover root ignores pointer events so the parent menu stays reachable, and
 * the paper takes them back so the submenu can be hovered, clicked and scrolled.
 *
 * The user's `style`, `sx`, `className` and slot props are kept as they are. The paper is reached with
 * a selector rather than `PaperProps` or `slotProps.paper`, because `PaperProps` is gone in MUI 9 and
 * `slotProps.paper` only exists on `Menu` from MUI 5.14.
 */
export function mergeSubmenuProps(menuProps: SubmenuMenuProps = {}): SubmenuMenuProps {
    const { style, sx, ...rest } = menuProps;
    const userSx = (Array.isArray(sx) ? sx : sx === undefined ? [] : [sx]) as SubmenuMenuProps['sx'][];

    return {
        ...rest,
        style: { ...style, pointerEvents: 'none' },
        sx: [paperTakesPointerEvents, ...userSx] as SubmenuMenuProps['sx'],
    };
}
