import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ContextMenu, IconMenuItem, NestedMenuItem } from '../src';
import { renderMenu, threeLevelData } from './helpers';

const items = (callbacks: Record<string, () => void> = {}) => threeLevelData(callbacks).items ?? [];

describe('ContextMenu', () => {
    it('opens on the contextmenu event and suppresses the browser menu', () => {
        renderMenu(
            <ContextMenu menuItemsData={items()}>
                <p>Right click me</p>
            </ContextMenu>
        );
        expect(screen.queryByText('Alpha')).toBeNull();

        const notPrevented = fireEvent.contextMenu(screen.getByText('Right click me'), {
            clientX: 40,
            clientY: 60,
        });

        expect(notPrevented).toBe(false);
        expect(screen.queryByText('Alpha')).not.toBeNull();
    });

    it('fires a nested item callback and closes the menu (#34)', async () => {
        const callback = vi.fn();
        const { user } = renderMenu(
            <ContextMenu menuItemsData={items({ Open: callback })}>
                <p>Right click me</p>
            </ContextMenu>
        );
        fireEvent.contextMenu(screen.getByText('Right click me'), { clientX: 40, clientY: 60 });

        await user.hover(screen.getByText('File'));
        await user.click(await screen.findByText('Open'));

        expect(callback).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(screen.queryByText('Alpha')).toBeNull());
    });

    it('closes a menuItems list when an item is clicked', async () => {
        const onClick = vi.fn();
        const { user } = renderMenu(
            <ContextMenu menuItems={[<IconMenuItem key="a" label="Copy" onClick={onClick} />]}>
                <p>Right click me</p>
            </ContextMenu>
        );
        fireEvent.contextMenu(screen.getByText('Right click me'), { clientX: 40, clientY: 60 });

        await user.click(screen.getByText('Copy'));

        expect(onClick).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(screen.queryByText('Copy')).toBeNull());
    });

    it('keeps a menuItems list open on a parent item, closes on its submenu items, and calls MenuProps.onClick', async () => {
        const onMenuClick = vi.fn();
        const { user } = renderMenu(
            <ContextMenu
                MenuProps={{ onClick: onMenuClick }}
                menuItems={[
                    <NestedMenuItem key="p" label="More" parentMenuOpen>
                        <IconMenuItem label="Deeper" />
                    </NestedMenuItem>,
                ]}
            >
                <p>Right click me</p>
            </ContextMenu>
        );
        fireEvent.contextMenu(screen.getByText('Right click me'), { clientX: 40, clientY: 60 });

        await user.click(screen.getByText('More'));
        expect(screen.queryByText('Deeper')).not.toBeNull();
        expect(onMenuClick).toHaveBeenCalledTimes(1);

        await user.click(screen.getByText('Deeper'));
        await waitFor(() => expect(screen.queryByText('More')).toBeNull());
        expect(onMenuClick).toHaveBeenCalledTimes(2);
    });

    it('moves the open menu to a right-click on the page, and closes it on a right-click on the menu', async () => {
        renderMenu(
            <ContextMenu menuItemsData={items()}>
                <p>Right click me</p>
            </ContextMenu>
        );
        const wrapper = screen.getByText('Right click me').parentElement as HTMLElement;
        wrapper.getBoundingClientRect = () => ({
            bottom: 500,
            height: 500,
            left: 0,
            right: 500,
            toJSON: () => ({}),
            top: 0,
            width: 500,
            x: 0,
            y: 0,
        });
        const paperTop = () => (screen.getByRole('menu').closest('.MuiPaper-root') as HTMLElement).style.top;

        fireEvent.contextMenu(screen.getByText('Right click me'), { clientX: 40, clientY: 60 });
        expect(paperTop()).toBe('60px');

        // The invisible backdrop sits over the page, so that is where the second right-click lands.
        fireEvent.contextMenu(document.querySelector('.MuiBackdrop-root') as HTMLElement, {
            clientX: 80,
            clientY: 120,
        });
        expect(paperTop()).toBe('120px');

        fireEvent.contextMenu(screen.getByText('Alpha'), { clientX: 80, clientY: 120 });
        await waitFor(() => expect(screen.queryByText('Alpha')).toBeNull());
    });
});
