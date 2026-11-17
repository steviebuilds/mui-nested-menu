import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ContextMenu } from '../src';
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
});
