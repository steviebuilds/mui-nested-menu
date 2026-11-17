import type { MenuItemProps, SxProps } from '@mui/material';

/** Which side of the parent item a submenu opens on. */
export type SubmenuPlacement = 'left' | 'right';

export interface MenuItemData {
    uid?: string;
    label?: string;
    /** Custom label. On the `NestedDropdown` root data it renders the button label. */
    renderLabel?: () => React.ReactNode;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    /** Fires on a click of the item, including items that have children (which stay open). */
    callback?: (event: React.MouseEvent<HTMLElement>, item: MenuItemData) => void;
    items?: MenuItemData[];
    disabled?: boolean;
    sx?: SxProps;
    delay?: number;
    /** Extra props for this item's MUI `MenuItem`, e.g. `className`, `divider`, `data-testid`. */
    MenuItemProps?: Partial<MenuItemProps>;
}
