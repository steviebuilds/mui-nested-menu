import type { ButtonProps as MuiButtonProps, MenuProps as MuiMenuProps } from '@mui/material';
import { Button, Menu } from '@mui/material';
import { forwardRef, useState } from 'react';

import { MenuItemData, SubmenuPlacement } from '../definitions';
import { ChevronDown } from '../icons/ChevronDown';
import { nestedMenuItemsFromObject } from './nestedMenuItemsFromObject';

interface NestedDropdownProps {
    children?: React.ReactNode;
    menuItemsData?: MenuItemData;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    ButtonProps?: Partial<MuiButtonProps>;
    /** Props for the root menu. */
    MenuProps?: Partial<MuiMenuProps>;
    /** Props for every submenu, at every depth. */
    SubmenuProps?: Partial<Omit<MuiMenuProps, 'children'>>;
    /** Side the submenus open on. */
    placement?: SubmenuPlacement;
}

export const NestedDropdown = forwardRef<HTMLDivElement | null, NestedDropdownProps>(
    function NestedDropdown(props, ref) {
        const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
        const open = Boolean(anchorEl);

        const {
            menuItemsData: data,
            onClick,
            ButtonProps,
            MenuProps,
            SubmenuProps,
            placement,
            ...rest
        } = props;

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(e.currentTarget);
            onClick && onClick(e);
        };
        const handleClose = () => setAnchorEl(null);

        const menuItems = nestedMenuItemsFromObject({
            MenuProps: SubmenuProps,
            handleClose,
            isOpen: open,
            menuItemsData: data?.items ?? [],
            placement,
        });

        return (
            <div ref={ref} {...rest}>
                <Button onClick={handleClick} endIcon={<ChevronDown />} {...ButtonProps}>
                    {data?.renderLabel?.() ?? data?.label ?? 'Menu'}
                </Button>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose} {...MenuProps}>
                    {menuItems}
                </Menu>
            </div>
        );
    }
);
