import type { MenuProps } from '@mui/material';

type PaperSlot = Record<string, unknown> | ((ownerState: unknown) => Record<string, unknown>) | undefined;

const withPointerEvents = (paper: Record<string, unknown> | undefined) => ({
    ...paper,
    style: { ...(paper?.style as object | undefined), pointerEvents: 'auto' },
});

const mergePaper = (paper: PaperSlot) =>
    typeof paper === 'function'
        ? (ownerState: unknown) => withPointerEvents(paper(ownerState))
        : withPointerEvents(paper);

/**
 * Merge a user's `MenuProps` with what a submenu needs to keep its hover and pointer handling:
 * the (invisible) popover root ignores pointer events so the parent menu stays reachable, and
 * the paper takes them back so the submenu can be hovered, clicked and scrolled. The user's own
 * `style`, `PaperProps` and `slotProps.paper` are kept, with only `pointerEvents` forced.
 */
export function mergeSubmenuProps(menuProps: Partial<Omit<MenuProps, 'children'>> = {}) {
    const { PaperProps, slotProps, style, ...rest } = menuProps;
    const paperSlot = slotProps?.paper as PaperSlot;
    const paperProps =
        paperSlot !== undefined
            ? { slotProps: { ...slotProps, paper: mergePaper(paperSlot) } }
            : { PaperProps: mergePaper(PaperProps as PaperSlot), slotProps };

    return {
        ...rest,
        ...paperProps,
        style: { ...style, pointerEvents: 'none' as const },
    } as Partial<Omit<MenuProps, 'children'>>;
}
