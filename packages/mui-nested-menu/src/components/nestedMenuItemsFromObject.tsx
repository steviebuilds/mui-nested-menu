import type { MenuProps } from '@mui/material';
import React from 'react';

import { MenuItemData, SubmenuPlacement } from '../definitions';
import { IconMenuItem } from './IconMenuItem';
import { NestedMenuItem } from './NestedMenuItem';

export interface nestedMenuItemsFromObjectProps {
    menuItemsData: MenuItemData[];
    isOpen: boolean;
    handleClose: () => void;
    /** Applied to every submenu, at every depth. */
    MenuProps?: Partial<Omit<MenuProps, 'children'>>;
    /** Side the submenus open on. Applied to every submenu. */
    placement?: SubmenuPlacement;
}

/**
 * Create a JSX element with nested elements creating a nested menu.
 * Items are keyed by `uid`, falling back to their label and position.
 */
export function nestedMenuItemsFromObject({
    menuItemsData: items,
    isOpen,
    handleClose,
    MenuProps,
    placement,
}: nestedMenuItemsFromObjectProps) {
    return items.map((item, index) => {
        const {
            leftIcon,
            rightIcon,
            label,
            renderLabel,
            items,
            callback,
            sx,
            disabled,
            delay,
            MenuItemProps,
            uid,
        } = item;
        const key = uid ?? `${label}-${index}`;

        if (items && items.length > 0) {
            // Recurse deeper
            return (
                <NestedMenuItem
                    key={key}
                    leftIcon={leftIcon}
                    rightIcon={rightIcon}
                    label={label}
                    renderLabel={renderLabel}
                    parentMenuOpen={isOpen}
                    sx={sx}
                    delay={delay}
                    disabled={disabled}
                    MenuProps={MenuProps}
                    placement={placement}
                    // A click on a parent row opens its submenu; the menu stays open.
                    onClick={(event: React.MouseEvent<HTMLElement>) => callback && callback(event, item)}
                    {...MenuItemProps}
                >
                    {/* Call this function to nest more items */}
                    {nestedMenuItemsFromObject({
                        MenuProps,
                        handleClose,
                        isOpen,
                        menuItemsData: items,
                        placement,
                    })}
                </NestedMenuItem>
            );
        } else {
            // No children elements, return MenuItem
            return (
                <IconMenuItem
                    key={key}
                    MenuItemProps={MenuItemProps}
                    leftIcon={leftIcon}
                    rightIcon={rightIcon}
                    label={label}
                    renderLabel={renderLabel}
                    onClick={(event: React.MouseEvent<HTMLElement>) => {
                        handleClose();
                        callback && callback(event, item);
                    }}
                    sx={sx}
                    disabled={disabled}
                />
            );
        }
    });
}
