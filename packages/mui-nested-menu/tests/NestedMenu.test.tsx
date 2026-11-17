import { Checkbox, FormControlLabel, Menu, MenuItem } from '@mui/material';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MenuItemData, NestedDropdown, NestedMenuItem } from '../src';
import { activeText, renderMenu, threeLevelData } from './helpers';

const openDropdown = async (user: UserEvent) => user.click(screen.getByRole('button', { name: 'Menu' }));

const isOpen = (label: string) => screen.queryByText(label) !== null;

describe('opening and closing', () => {
    it('opens a submenu on hover and closes it when the pointer moves to another item', async () => {
        const { user } = renderMenu(<NestedDropdown menuItemsData={threeLevelData()} />);
        await openDropdown(user);
        expect(isOpen('Open')).toBe(false);

        await user.hover(screen.getByText('File'));
        await waitFor(() => expect(isOpen('Open')).toBe(true));

        await user.hover(screen.getByText('Omega'));
        await waitFor(() => expect(isOpen('Open')).toBe(false));
    });

    it('opens a submenu on click, keeps the menu open and flags the parent as expanded', async () => {
        const { user } = renderMenu(<NestedDropdown menuItemsData={threeLevelData()} />);
        await openDropdown(user);
        const file = screen.getByRole('menuitem', { name: 'File' });
        expect(file.getAttribute('aria-haspopup')).toBe('menu');
        expect(file.getAttribute('aria-expanded')).toBe('false');

        await user.click(file);

        expect(isOpen('Open')).toBe(true);
        expect(isOpen('Omega')).toBe(true);
        expect(file.getAttribute('aria-expanded')).toBe('true');
    });

    it('keeps only the active path open across three levels', async () => {
        const { user } = renderMenu(<NestedDropdown menuItemsData={threeLevelData()} />);
        await openDropdown(user);

        await user.hover(screen.getByText('File'));
        await waitFor(() => expect(isOpen('Export')).toBe(true));
        await user.hover(screen.getByText('Export'));
        await waitFor(() => expect(isOpen('PDF')).toBe(true));
        expect(isOpen('Open')).toBe(true);

        await user.hover(screen.getByText('Edit'));

        await waitFor(() => expect(isOpen('Cut')).toBe(true));
        expect(isOpen('Open')).toBe(false);
        expect(isOpen('PDF')).toBe(false);
    });

    it('never opens a disabled parent item', async () => {
        const data: MenuItemData = {
            items: [{ disabled: true, items: [{ label: 'Hidden' }], label: 'Locked' }],
        };
        const { user } = renderMenu(<NestedDropdown menuItemsData={data} />);
        await openDropdown(user);

        fireEvent.mouseEnter(screen.getByText('Locked'));
        fireEvent.click(screen.getByText('Locked'));
        await new Promise((resolve) => setTimeout(resolve, 50));

        expect(isOpen('Hidden')).toBe(false);
    });
});

describe('keyboard', () => {
    it('walks over parent items with the arrow keys without opening their submenus', async () => {
        const { user } = renderMenu(<NestedDropdown menuItemsData={threeLevelData()} />);
        await openDropdown(user);
        expect(activeText()).toBe('Alpha');

        await user.keyboard('{ArrowDown}');
        expect(activeText()).toBe('File');
        await user.keyboard('{ArrowDown}');
        expect(activeText()).toBe('Edit');
        await user.keyboard('{ArrowUp}{ArrowUp}');

        expect(activeText()).toBe('Alpha');
        expect(isOpen('Open')).toBe(false);
        expect(isOpen('Cut')).toBe(false);
    });

    it('opens with the right arrow, closes one level with the left arrow and returns focus to the parent', async () => {
        const { user } = renderMenu(<NestedDropdown menuItemsData={threeLevelData()} />);
        await openDropdown(user);
        await user.keyboard('{ArrowDown}{ArrowRight}');
        expect(activeText()).toBe('Open');

        await user.keyboard('{ArrowDown}{ArrowRight}');
        expect(activeText()).toBe('PDF');

        await user.keyboard('{ArrowLeft}');
        expect(activeText()).toBe('Export');
        await waitFor(() => expect(isOpen('PDF')).toBe(false));
        expect(isOpen('Open')).toBe(true);

        await user.keyboard('{ArrowLeft}');
        expect(activeText()).toBe('File');
        await waitFor(() => expect(isOpen('Open')).toBe(false));
        expect(isOpen('Omega')).toBe(true);
    });

    it('does not close a submenu on the arrow keys typed in a field inside it', async () => {
        const { user } = renderMenu(
            <Menu open anchorEl={document.body}>
                <NestedMenuItem parentMenuOpen label="Options">
                    <MenuItem>
                        <input aria-label="Name" defaultValue="abc" />
                    </MenuItem>
                </NestedMenuItem>
            </Menu>
        );
        await user.hover(screen.getByText('Options'));
        const input = await screen.findByRole('textbox', { name: 'Name' });
        input.focus();

        await user.keyboard('{ArrowLeft}');
        expect(isOpen('Options')).toBe(true);
        expect(screen.queryByRole('textbox', { name: 'Name' })).not.toBeNull();

        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('textbox', { name: 'Name' })).toBeNull());
    });

    it.each([['Enter'], [' ']])('opens a parent item with %j and focuses its first item', async (key) => {
        const { user } = renderMenu(<NestedDropdown menuItemsData={threeLevelData()} />);
        await openDropdown(user);
        await user.keyboard('{ArrowDown}');

        await user.keyboard(key === ' ' ? ' ' : `{${key}}`);

        expect(activeText()).toBe('Open');
    });

    it('closes only the innermost submenu on Escape, then the menu on the next', async () => {
        const { user } = renderMenu(<NestedDropdown menuItemsData={threeLevelData()} />);
        await openDropdown(user);
        await user.keyboard('{ArrowDown}{ArrowRight}{ArrowDown}{ArrowRight}');
        expect(activeText()).toBe('PDF');

        await user.keyboard('{Escape}');
        await waitFor(() => expect(isOpen('PDF')).toBe(false));
        expect(isOpen('Open')).toBe(true);
        expect(activeText()).toBe('Export');

        await user.keyboard('{Escape}');
        await waitFor(() => expect(isOpen('Open')).toBe(false));
        expect(isOpen('Omega')).toBe(true);
        expect(activeText()).toBe('File');

        await user.keyboard('{Escape}');
        await waitFor(() => expect(isOpen('Omega')).toBe(false));
    });

    it('closes every submenu on the path when focus moves out of it', async () => {
        const { user } = renderMenu(<NestedDropdown menuItemsData={threeLevelData()} />);
        await openDropdown(user);
        await user.keyboard('{ArrowDown}{ArrowRight}{ArrowDown}{ArrowRight}');
        expect(isOpen('PDF')).toBe(true);

        act(() => screen.getByText('Alpha').closest('li')?.focus());

        await waitFor(() => expect(isOpen('PDF')).toBe(false));
        expect(isOpen('Open')).toBe(false);
        expect(isOpen('Omega')).toBe(true);
    });

    it('keeps a submenu open while focus moves between its own items', async () => {
        const { user } = renderMenu(<NestedDropdown menuItemsData={threeLevelData()} />);
        await openDropdown(user);
        await user.keyboard('{ArrowDown}{ArrowRight}{ArrowDown}');
        expect(activeText()).toBe('Export');

        await new Promise((resolve) => setTimeout(resolve, 50));

        expect(isOpen('Open')).toBe(true);
    });

    it('survives any key after a submenu has been closed', async () => {
        const { user } = renderMenu(<NestedDropdown menuItemsData={threeLevelData()} />);
        await openDropdown(user);
        await user.keyboard('{ArrowDown}{ArrowRight}{ArrowLeft}');
        await waitFor(() => expect(isOpen('Open')).toBe(false));

        await user.keyboard('{Alt}{Shift}{ArrowLeft}x');

        await user.keyboard('{ArrowRight}');
        expect(activeText()).toBe('Open');
    });

    it('follows the placement: left arrow opens, right arrow closes', async () => {
        const { user } = renderMenu(<NestedDropdown menuItemsData={threeLevelData()} placement="left" />);
        await openDropdown(user);
        await user.keyboard('{ArrowDown}{ArrowRight}');
        expect(isOpen('Open')).toBe(false);

        await user.keyboard('{ArrowLeft}');
        expect(activeText()).toBe('Open');

        await user.keyboard('{ArrowRight}');
        expect(activeText()).toBe('File');
    });
});

describe('touch', () => {
    const tap = (element: Element) => {
        fireEvent.pointerDown(element, { pointerType: 'touch' });
        fireEvent.pointerUp(element, { pointerType: 'touch' });
        // Mobile browsers emulate hover and a click after a tap.
        fireEvent.mouseEnter(element);
        fireEvent.mouseMove(element);
        fireEvent.click(element);
    };

    afterEach(() => {
        vi.useRealTimers();
    });

    it('toggles a submenu with taps instead of opening it through emulated hover', async () => {
        const { user } = renderMenu(<NestedDropdown menuItemsData={threeLevelData()} />);
        await openDropdown(user);
        const file = screen.getByText('File');

        fireEvent.pointerDown(file, { pointerType: 'touch' });
        fireEvent.mouseEnter(file);
        await new Promise((resolve) => setTimeout(resolve, 50));
        expect(isOpen('Open')).toBe(false);

        fireEvent.click(file);
        expect(isOpen('Open')).toBe(true);

        tap(file);
        await waitFor(() => expect(isOpen('Open')).toBe(false));
    });

    it('still calls ContainerProps.onMouseEnter for emulated hover without opening', async () => {
        const onMouseEnter = vi.fn();
        renderMenu(
            <Menu open anchorEl={document.body}>
                <NestedMenuItem parentMenuOpen label="Options" ContainerProps={{ onMouseEnter }}>
                    <MenuItem>Child</MenuItem>
                </NestedMenuItem>
            </Menu>
        );
        const label = screen.getByText('Options');

        fireEvent.pointerDown(label, { pointerType: 'touch' });
        fireEvent.mouseEnter(label);
        await new Promise((resolve) => setTimeout(resolve, 50));

        expect(onMouseEnter).toHaveBeenCalledTimes(1);
        expect(isOpen('Child')).toBe(false);
    });

    it('does not select an item in a submenu that the same tap just opened', async () => {
        const open = vi.fn();
        const { user } = renderMenu(<NestedDropdown menuItemsData={threeLevelData({ Open: open })} />);
        await openDropdown(user);
        vi.useFakeTimers({ toFake: ['Date'] });

        tap(screen.getByText('File'));
        // On a tablet the submenu can render under the finger, so the tap's click reaches its first item.
        fireEvent.click(screen.getByText('Open'));
        expect(open).not.toHaveBeenCalled();

        vi.setSystemTime(Date.now() + 1000);
        fireEvent.click(screen.getByText('Open'));
        expect(open).toHaveBeenCalledTimes(1);
    });
});

describe('MenuProps', () => {
    it('still closes on hover out when MenuProps change the submenu size', async () => {
        const data = threeLevelData();
        const { user } = renderMenu(
            <NestedDropdown
                menuItemsData={data}
                SubmenuProps={{
                    slotProps: { paper: { style: { height: '300px' } } },
                    style: { maxHeight: 'auto' },
                }}
            />
        );
        await openDropdown(user);

        await user.hover(screen.getByText('File'));
        await waitFor(() => expect(isOpen('Open')).toBe(true));
        await user.hover(screen.getByText('Omega'));

        await waitFor(() => expect(isOpen('Open')).toBe(false));
    });

    it('keeps the submenu paper reachable by the pointer so it can scroll', async () => {
        const { user } = renderMenu(
            <NestedDropdown
                menuItemsData={threeLevelData()}
                SubmenuProps={{ slotProps: { paper: { style: { maxHeight: 120 } } } }}
            />
        );
        await openDropdown(user);
        await user.click(screen.getByText('File'));

        const paper = screen.getByText('Open').closest('.MuiPaper-root') as HTMLElement;

        expect(paper.style.maxHeight).toBe('120px');
        expect(getComputedStyle(paper).pointerEvents).toBe('auto');
        expect(getComputedStyle(paper.parentElement as HTMLElement).pointerEvents).toBe('none');
    });

    it('lets user-event click a checkbox inside a submenu (#66)', async () => {
        const onChange = vi.fn();
        const { user } = renderMenu(
            <Menu open anchorEl={document.body}>
                <NestedMenuItem parentMenuOpen label="Options">
                    <MenuItem>
                        <FormControlLabel control={<Checkbox onChange={onChange} />} label="Notify me" />
                    </MenuItem>
                </NestedMenuItem>
            </Menu>
        );

        await user.hover(screen.getByText('Options'));
        await user.click(await screen.findByRole('checkbox', { name: 'Notify me' }));

        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('passes hideBackdrop and className to the submenu (#43, #54)', async () => {
        const { user } = renderMenu(
            <Menu open anchorEl={document.body}>
                <NestedMenuItem
                    MenuProps={{ className: 'custom', hideBackdrop: true }}
                    parentMenuOpen
                    label="Options"
                >
                    <MenuItem>Inner</MenuItem>
                </NestedMenuItem>
            </Menu>
        );

        await user.click(screen.getByText('Options'));

        expect(document.querySelector('.custom .MuiPaper-root')?.textContent).toBe('Inner');
        expect(document.querySelector('.custom .MuiBackdrop-root')).toBeNull();
    });
});

describe('NestedDropdown', () => {
    it('shows the renderLabel of the root data on the button (#50)', () => {
        renderMenu(<NestedDropdown menuItemsData={{ items: [], renderLabel: () => <b>Fancy label</b> }} />);

        expect(screen.getByRole('button', { name: 'Fancy label' })).toBeTruthy();
    });

    it('applies SubmenuProps to the submenus at every depth (#46, #54)', async () => {
        const { user } = renderMenu(
            <NestedDropdown menuItemsData={threeLevelData()} SubmenuProps={{ className: 'custom' }} />
        );
        await openDropdown(user);
        await user.click(screen.getByText('File'));
        await user.click(screen.getByText('Export'));

        expect(isOpen('PDF')).toBe(true);
        expect(document.querySelectorAll('.custom .MuiPaper-root').length).toBe(2);
    });
});
