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

    // Native `contextmenu` covers right-click, Ctrl-click on macOS, touch long-press (where the
    // browser fires it) and the keyboard Menu key / Shift+F10.
    const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();

        let { clientX: left, clientY: top } = e;

        // Keyboard-triggered events can report 0, 0: open at the wrapper instead.
        if (left === 0 && top === 0) {
            const bounds = wrapperRef.current?.getBoundingClientRect();
            left = bounds?.left ?? 0;
            top = bounds?.top ?? 0;
        }

        setMenuPosition({ left, top });
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
                    onContextMenu={(e) => {
                        // The menu renders in a portal, but its events still bubble to the wrapper.
                        e.preventDefault();
                        e.stopPropagation();
                        handleClose();
                    }}
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
