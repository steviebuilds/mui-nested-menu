import { screen } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MenuItemData, NestedDropdown } from '../src';
import { renderMenu, threeLevelData } from './helpers';

const openDropdown = async (user: UserEvent) => user.click(screen.getByRole('button', { name: 'Menu' }));

describe('callbacks', () => {
    it('fires a leaf callback with the event and the item, and closes the menu', async () => {
        const callback = vi.fn();
        const { user } = renderMenu(<NestedDropdown menuItemsData={threeLevelData({ Open: callback })} />);
        await openDropdown(user);
        await user.click(screen.getByText('File'));

        await user.click(screen.getByText('Open'));

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][1].label).toBe('Open');
        expect(screen.queryByText('Omega')).toBeNull();
    });

    it('fires a parent item callback on click without closing the menu (#34)', async () => {
        const callback = vi.fn();
        const { user } = renderMenu(<NestedDropdown menuItemsData={threeLevelData({ File: callback })} />);
        await openDropdown(user);

        await user.click(screen.getByText('File'));

        expect(callback).toHaveBeenCalledTimes(1);
        expect(screen.queryByText('Open')).not.toBeNull();
        expect(screen.queryByText('Omega')).not.toBeNull();
    });
});

describe('item data', () => {
    it('renders items with the same label without a duplicate key warning (#42)', async () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        const data: MenuItemData = {
            items: [
                { label: 'Same' },
                { label: 'Same' },
                { items: [{ label: 'Same' }], label: 'Same', uid: 'parent' },
            ],
        };
        const { user } = renderMenu(<NestedDropdown menuItemsData={data} />);

        await openDropdown(user);

        expect(screen.getAllByText('Same').length).toBe(3);
        expect(error.mock.calls.filter(([message]) => String(message).includes('same key'))).toEqual([]);
        error.mockRestore();
    });

    it('renders renderLabel and forwards MenuItemProps to the MUI item', async () => {
        const data: MenuItemData = {
            items: [
                { MenuItemProps: { divider: true }, label: 'Above the line' },
                {
                    MenuItemProps: { 'data-testid': 'custom-item' } as object,
                    label: 'ignored',
                    renderLabel: () => <em>Custom label</em>,
                },
            ],
        };
        const { user } = renderMenu(<NestedDropdown menuItemsData={data} />);
        await openDropdown(user);

        expect(screen.getByText('Above the line').closest('li')?.className).toContain('divider');
        expect(screen.getByTestId('custom-item').textContent).toBe('Custom label');
    });

    afterEach(() => vi.restoreAllMocks());
});
