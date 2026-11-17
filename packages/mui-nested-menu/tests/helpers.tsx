import { createTheme, ThemeProvider } from '@mui/material';
import type { RenderResult } from '@testing-library/react';
import { render } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import userEvent from '@testing-library/user-event';
import { ReactElement } from 'react';

import { MenuItemData } from '../src';

// No transitions or ripples: closed menus leave the DOM straight away, so tests can assert on
// what a user would see without waiting out animations.
const theme = createTheme({
    components: {
        MuiButtonBase: { defaultProps: { disableRipple: true } },
        MuiMenu: { defaultProps: { transitionDuration: 0 } },
        MuiPopover: { defaultProps: { transitionDuration: 0 } },
    },
});

export function renderMenu(ui: ReactElement): RenderResult & { user: UserEvent } {
    const user = userEvent.setup();

    return { user, ...render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>) };
}

/** A three-level menu: Menu > File > Export > PDF. */
export function threeLevelData(callbacks: Record<string, MenuItemData['callback']> = {}): MenuItemData {
    const cb = (name: string) => callbacks[name];

    return {
        items: [
            { callback: cb('Alpha'), label: 'Alpha' },
            {
                callback: cb('File'),
                items: [
                    { callback: cb('Open'), label: 'Open' },
                    {
                        callback: cb('Export'),
                        items: [
                            { callback: cb('PDF'), label: 'PDF' },
                            { callback: cb('PNG'), label: 'PNG' },
                        ],
                        label: 'Export',
                    },
                ],
                label: 'File',
            },
            { items: [{ label: 'Cut' }], label: 'Edit' },
            { label: 'Omega' },
        ],
        label: 'Menu',
    };
}

export const activeText = () => document.activeElement?.textContent;
