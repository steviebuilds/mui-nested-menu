import type { MenuProps as MuiMenuProps } from '@mui/material';
import { Menu } from '@mui/material';
import { forwardRef, MouseEvent, ReactNode, useImperativeHandle, useRef, useState } from 'react';

import { MenuItemData, SubmenuPlacement } from '../definitions';
import { nestedMenuItemsFromObject } from './nestedMenuItemsFromObject';

export type ContextMenuProps = {
    children?: ReactNode;
    menuItems?: ReactNode[];
    menuItemsData?: MenuItemData[];
    /** Props for the root menu. */
    MenuProps?: Partial<MuiMenuProps>;
    /** Props for every submenu, at every depth. */
    SubmenuProps?: Partial<Omit<MuiMenuProps, 'children'>>;
    /** Side the submenus open on. */
    placement?: SubmenuPlacement;
};

type Position = {
    top: number;
    left: number;
};

export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(function ContextMenu(
    { children, menuItems, menuItemsData, MenuProps, SubmenuProps, placement },
    ref
) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => wrapperRef.current as HTMLDivElement);

    const [menuPosition, setMenuPosition] = useState<Position | null>(null);

    const handleClose = () => setMenuPosition(null);

    const openAt = (e: MouseEvent) => {
        let { clientX: left, clientY: top } = e;

        // Keyboard-triggered events can report 0, 0: open at the wrapper instead.
        if (left === 0 && top === 0) {
            const bounds = wrapperRef.current?.getBoundingClientRect();
            left = bounds?.left ?? 0;
            top = bounds?.top ?? 0;
        }

        setMenuPosition({ left, top });
    };

    // Native `contextmenu` covers right-click, Ctrl-click on macOS, touch long-press (where the
    // browser fires it) and the keyboard Menu key / Shift+F10.
    const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        openAt(e);
    };

    // The menu renders in a portal, but its events still bubble to the wrapper.
    const handleMenuContextMenu = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        // A right-click on the backdrop over the wrapper moves the menu there, as in 4.0. On the menu
        // itself, or outside the wrapper, it closes the menu.
        const bounds = wrapperRef.current?.getBoundingClientRect();
        const overWrapper =
            !!bounds &&
            e.clientX >= bounds.left &&
            e.clientX <= bounds.right &&
            e.clientY >= bounds.top &&
            e.clientY <= bounds.bottom;

        if (overWrapper && !(e.target as Element).closest('[role="menu"]')) {
            openAt(e);
        } else {
            handleClose();
        }
    };

    // A static `menuItems` list has no `handleClose` to call, so a click on an item (a parent item
    // that only opens a submenu does not count) closes the menu here. Clicks inside submenus bubble
    // through their portals to this handler.
    const handleMenuClick = (e: MouseEvent<HTMLDivElement>) => {
        MenuProps?.onClick?.(e);

        if (menuItems && (e.target as Element).closest('[role="menuitem"]:not([aria-haspopup])')) {
            handleClose();
        }
    };

    const menuContents =
        menuItems ??
        (menuItemsData &&
            nestedMenuItemsFromObject({
                MenuProps: SubmenuProps,
                handleClose,
                isOpen: !!menuPosition,
                menuItemsData: menuItemsData,
                placement,
            }));

    return (
        <div ref={wrapperRef} onContextMenu={handleContextMenu}>
            {menuPosition && (
                <Menu
                    {...MenuProps}
                    onClick={handleMenuClick}
                    onContextMenu={handleMenuContextMenu}
                    open={!!menuPosition}
                    onClose={(event, reason) => {
                        handleClose();
                        MenuProps?.onClose?.(event, reason);
                    }}
                    anchorReference="anchorPosition"
                    anchorPosition={menuPosition}
                >
                    {menuContents}
                </Menu>
            )}
            {children}
        </div>
    );
});
