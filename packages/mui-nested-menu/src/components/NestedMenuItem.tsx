import type { MenuItemProps, MenuProps } from '@mui/material';
import { Menu } from '@mui/material';
import {
    ElementType,
    FocusEvent,
    forwardRef,
    HTMLAttributes,
    KeyboardEvent,
    MouseEvent,
    PointerEvent,
    ReactNode,
    Ref,
    RefAttributes,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';

import { SubmenuPlacement } from '../definitions';
import { ChevronLeft } from '../icons/ChevronLeft';
import { ChevronRight } from '../icons/ChevronRight';
import { IconMenuItem } from './IconMenuItem';
import { mergeSubmenuProps } from './submenuProps';

export type NestedMenuItemProps = Omit<MenuItemProps, 'button'> & {
    parentMenuOpen: boolean;
    component?: ElementType;
    label?: string;
    renderLabel?: () => ReactNode;
    rightIcon?: ReactNode;
    leftIcon?: ReactNode;
    children?: ReactNode;
    className?: string;
    tabIndex?: number;
    disabled?: boolean;
    ContainerProps?: HTMLAttributes<HTMLElement> & RefAttributes<HTMLElement | null>;
    MenuProps?: Partial<Omit<MenuProps, 'children'>>;
    button?: true | undefined;
    delay?: number;
    /** Side of the parent item the submenu opens on. Keyboard navigation follows it. Default `'right'`. */
    placement?: SubmenuPlacement;
};

/** How long after a touch tap opens a submenu its items ignore clicks (see #45). */
const TOUCH_OPEN_GUARD_MS = 500;

const NestedMenuItem = forwardRef<HTMLLIElement | null, NestedMenuItemProps>(
    function NestedMenuItem(props, ref) {
        const {
            parentMenuOpen,
            label,
            renderLabel,
            rightIcon,
            leftIcon = null,
            children,
            className,
            tabIndex: tabIndexProp,
            ContainerProps: ContainerPropsProp = {},
            MenuProps,
            delay = 0,
            placement = 'right',
            ...MenuItemProps
        } = props;

        const { ref: containerRefProp, ...ContainerProps } = ContainerPropsProp;

        const menuItemRef = useRef<HTMLLIElement | null>(null);
        useImperativeHandle(ref, () => menuItemRef.current!); // eslint-disable-line @typescript-eslint/no-non-null-assertion

        const containerRef = useRef<HTMLDivElement | null>(null);
        useImperativeHandle(
            containerRefProp as Ref<HTMLElement | null> | undefined,
            () => containerRef.current as HTMLDivElement
        );

        const menuContainerRef = useRef<HTMLDivElement | null>(null);

        const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
        const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
        const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
        const focusFirstItemRef = useRef(false);
        const isTouchRef = useRef(false);
        const touchGuardUntilRef = useRef(0);

        const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

        const open = isSubMenuOpen && parentMenuOpen;

        const openKey = placement === 'left' ? 'ArrowLeft' : 'ArrowRight';
        const closeKey = placement === 'left' ? 'ArrowRight' : 'ArrowLeft';

        const focusFirstItem = useCallback(() => {
            const items = Array.from(menuContainerRef.current?.children ?? []) as HTMLElement[];
            const first = items.find(
                (el) => el.hasAttribute('tabindex') && el.getAttribute('aria-disabled') !== 'true'
            );
            first?.focus({ preventScroll: true });

            return !!first;
        }, []);

        // The submenu content mounts after `open` flips (it renders in a portal), so focusing the first
        // item on a keyboard open happens either when the content mounts or in the effect below.
        const setMenuContainer = useCallback(
            (node: HTMLDivElement | null) => {
                menuContainerRef.current = node;

                if (node && focusFirstItemRef.current && focusFirstItem()) {
                    focusFirstItemRef.current = false;
                }
            },
            [focusFirstItem]
        );

        useEffect(() => {
            if (open && focusFirstItemRef.current && focusFirstItem()) {
                focusFirstItemRef.current = false;
            }
        }, [open, focusFirstItem]);

        // A submenu should not come back open when the parent menu is reopened.
        useEffect(() => {
            if (!parentMenuOpen) {
                setIsSubMenuOpen(false);
            }
        }, [parentMenuOpen]);

        useEffect(
            () => () => {
                hoverTimeoutRef.current && clearTimeout(hoverTimeoutRef.current);
                blurTimeoutRef.current && clearTimeout(blurTimeoutRef.current);
            },
            []
        );

        const openWithKeyboard = () => {
            if (props.disabled) {
                return;
            }

            if (open && focusFirstItem()) {
                return;
            }

            focusFirstItemRef.current = true;
            setIsSubMenuOpen(true);
        };

        const closeAndFocusItem = () => {
            setIsSubMenuOpen(false);
            containerRef.current?.focus({ preventScroll: true });
        };

        const rememberPointerType = (e: PointerEvent<HTMLElement>) => {
            isTouchRef.current = e.pointerType === 'touch';
        };

        const handleMouseEnter = (e: MouseEvent<HTMLElement>) => {
            leaveTimeoutRef.current && clearTimeout(leaveTimeoutRef.current);

            // Touch devices emulate hover before the click. Opening on that makes the submenu appear
            // under the finger, and the click then selects one of its items (#45).
            if (isTouchRef.current) {
                return;
            }

            hoverTimeoutRef.current && clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = setTimeout(() => {
                if (!props.disabled) {
                    setIsSubMenuOpen(true);
                }

                if (ContainerProps.onMouseEnter) {
                    ContainerProps.onMouseEnter(e);
                }
            }, delay);
        };

        const handleMouseLeave = (e: MouseEvent<HTMLElement>) => {
            hoverTimeoutRef.current && clearTimeout(hoverTimeoutRef.current);

            if (!isTouchRef.current) {
                setIsSubMenuOpen(false);
            }

            if (ContainerProps.onMouseLeave) {
                ContainerProps.onMouseLeave(e);
            }
        };

        const handleItemClick = (e: MouseEvent<HTMLLIElement>) => {
            MenuItemProps.onClick?.(e as MouseEvent<HTMLLIElement> & MouseEvent<HTMLButtonElement>);

            if (props.disabled) {
                return;
            }

            // Focus lives on the container so that arrow keys keep working after a click.
            containerRef.current?.focus({ preventScroll: true });

            if (isTouchRef.current) {
                if (!open) {
                    touchGuardUntilRef.current = Date.now() + TOUCH_OPEN_GUARD_MS;
                }
                setIsSubMenuOpen(!open);
            } else {
                focusFirstItemRef.current = e.detail === 0;
                setIsSubMenuOpen(true);
            }
        };

        // React focus and blur events bubble through portals, so this container sees focus moving
        // anywhere in the submenu and in every submenu below it. Focus leaving the whole path closes it.
        const handleFocus = (e: FocusEvent<HTMLElement>) => {
            blurTimeoutRef.current && clearTimeout(blurTimeoutRef.current);

            if (ContainerProps.onFocus) {
                ContainerProps.onFocus(e);
            }
        };

        const handleBlur = (e: FocusEvent<HTMLElement>) => {
            blurTimeoutRef.current && clearTimeout(blurTimeoutRef.current);
            blurTimeoutRef.current = setTimeout(() => setIsSubMenuOpen(false), 0);

            if (ContainerProps.onBlur) {
                ContainerProps.onBlur(e);
            }
        };

        const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
            if (ContainerProps.onKeyDown) {
                ContainerProps.onKeyDown(e);
            }

            const isOnContainer = e.target === containerRef.current;
            const isOnItem = isOnContainer || e.target === menuItemRef.current;

            if (isOnItem) {
                if (props.disabled) {
                    return;
                }

                if (e.key === openKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    openWithKeyboard();
                } else if (isOnContainer && e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    focusFirstItemRef.current = true;
                    menuItemRef.current?.click();
                } else if (isOnContainer && e.key === ' ') {
                    // Space activates on key up (see handleKeyUp); stop it scrolling the page meanwhile.
                    e.preventDefault();
                    e.stopPropagation();
                } else if (isSubMenuOpen && (e.key === closeKey || e.key === 'Escape')) {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsSubMenuOpen(false);
                }

                // Other keys (ArrowUp, ArrowDown, ...) move focus in the parent menu.
                return;
            }

            // The key came from inside the submenu. Keep it from reaching the parent menu's list, which
            // would move focus there too. Tab is left to bubble so that the whole menu closes.
            if (e.key === 'Tab') {
                return;
            }

            e.stopPropagation();

            if (e.key === 'Escape' || e.key === closeKey) {
                e.preventDefault();
                closeAndFocusItem();
            }
        };

        // Space opens on key up. Opening on key down would move focus to the first submenu item, and the
        // key up would then land on it and select it.
        const handleKeyUp = (e: KeyboardEvent<HTMLElement>) => {
            if (ContainerProps.onKeyUp) {
                ContainerProps.onKeyUp(e);
            }

            if (e.key === ' ' && e.target === containerRef.current && !props.disabled) {
                e.preventDefault();
                focusFirstItemRef.current = true;
                menuItemRef.current?.click();
            }
        };

        // Root element must have a `tabIndex` attribute for keyboard navigation
        let tabIndex;
        if (!props.disabled) {
            tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1;
        }

        const { onClose: onMenuClose, ...menuProps } = mergeSubmenuProps(MenuProps);

        return (
            <div
                {...ContainerProps}
                ref={containerRef}
                onBlur={handleBlur}
                onFocus={handleFocus}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onPointerDown={(e) => {
                    rememberPointerType(e);
                    ContainerProps.onPointerDown?.(e);
                }}
                onPointerEnter={(e) => {
                    rememberPointerType(e);
                    ContainerProps.onPointerEnter?.(e);
                }}
                onPointerMove={(e) => {
                    rememberPointerType(e);
                    ContainerProps.onPointerMove?.(e);
                }}
                tabIndex={tabIndex}
            >
                <IconMenuItem
                    MenuItemProps={{
                        ...MenuItemProps,
                        'aria-expanded': open,
                        'aria-haspopup': 'menu',
                        onClick: handleItemClick,
                    }}
                    className={className}
                    ref={menuItemRef}
                    leftIcon={leftIcon}
                    rightIcon={rightIcon ?? (placement === 'left' ? <ChevronLeft /> : <ChevronRight />)}
                    label={label}
                    renderLabel={renderLabel}
                />

                <Menu
                    anchorEl={menuItemRef.current}
                    anchorOrigin={{
                        horizontal: placement,
                        vertical: 'top',
                    }}
                    transformOrigin={{
                        horizontal: placement === 'left' ? 'right' : 'left',
                        vertical: 'top',
                    }}
                    open={open}
                    autoFocus={false}
                    disableAutoFocus
                    disableEnforceFocus
                    disableEscapeKeyDown
                    disableRestoreFocus
                    {...menuProps}
                    onClose={(event, reason) => {
                        setIsSubMenuOpen(false);
                        onMenuClose?.(event, reason);
                    }}
                >
                    <div
                        ref={setMenuContainer}
                        onClickCapture={(e) => {
                            if (Date.now() < touchGuardUntilRef.current) {
                                e.stopPropagation();
                                e.preventDefault();
                            }
                        }}
                        style={{ pointerEvents: 'auto' }}
                    >
                        {children}
                    </div>
                </Menu>
            </div>
        );
    }
);

NestedMenuItem.displayName = 'NestedMenuItem';
export { NestedMenuItem };
