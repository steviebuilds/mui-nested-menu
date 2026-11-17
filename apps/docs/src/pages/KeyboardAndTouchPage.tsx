import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ContextMenu, MenuItemData, NestedDropdown } from 'mui-nested-menu';
import { FC, Fragment } from 'react';
import { Link } from 'react-router-dom';

import { CodeBlock } from '@/components/CodeBlock';
import { PageHeader } from '@/components/ImportSample';
import { SampleBox } from '@/components/SampleBox';
import { Callout, Code, List, P, Subheading } from '@/components/StyledTypography';
import { PathNames } from '@/core/configs/paths';

const log = (label: string) => () => console.log(`${label} clicked`);

const fileMenu: MenuItemData = {
    items: [
        { callback: log('New'), label: 'New' },
        { callback: log('Open'), label: 'Open' },
        {
            items: [
                { callback: log('PDF'), label: 'PDF' },
                { callback: log('PNG'), label: 'PNG' },
                {
                    items: [
                        { callback: log('Markdown'), label: 'Markdown' },
                        { callback: log('Plain text'), label: 'Plain text' },
                    ],
                    label: 'Text',
                },
            ],
            label: 'Export',
        },
        { callback: log('Close'), label: 'Close' },
    ],
    label: 'File',
};

const contextItems: MenuItemData[] = fileMenu.items ?? [];

const KeyTable = styled.table`
    ${({ theme }) => css`
        border: 1px solid ${theme.palette.border1};
        border-collapse: separate;
        border-radius: ${theme.sizes.borderRadiusLarge};
        border-spacing: 0;
        color: ${theme.palette.font2};
        font-family: ${theme.typeography.family};
        font-size: 0.875rem;
        line-height: 1.55;
        margin: 8px 0 24px;
        overflow: hidden;
        width: 100%;

        th {
            background-color: ${theme.palette.bg2};
            border-bottom: 1px solid ${theme.palette.border1};
            color: ${theme.palette.font3};
            font-size: 0.6875rem;
            font-weight: 600;
            letter-spacing: 0.06em;
            padding: 8px 12px;
            text-align: left;
            text-transform: uppercase;
        }

        td {
            border-bottom: 1px solid ${theme.palette.border1};
            padding: 10px 12px;
            vertical-align: top;
        }

        td:first-of-type {
            white-space: nowrap;
        }

        tr:last-of-type td {
            border-bottom: none;
        }
    `}
`;

const Kbd = styled.kbd`
    ${({ theme }) => css`
        background-color: ${theme.palette.bg2};
        border: 1px solid ${theme.palette.border1};
        border-bottom-width: 2px;
        border-radius: ${theme.sizes.borderRadiusSmall};
        color: ${theme.palette.font1};
        display: inline-block;
        font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
        font-size: 0.75rem;
        line-height: 1.4;
        margin-right: 4px;
        padding: 1px 6px;
    `}
`;

const ContextArea = styled.div`
    ${({ theme }) => css`
        align-items: center;
        border: 1px dashed ${theme.palette.border1};
        border-radius: ${theme.sizes.borderRadiusMedium};
        color: ${theme.palette.font2};
        display: flex;
        font-family: ${theme.typeography.family};
        font-size: 0.875rem;
        height: 96px;
        justify-content: center;
        width: 260px;
    `}
`;

const keys: { keys: string[]; action: string }[] = [
    { action: 'Move between items in the current menu. Submenus stay closed.', keys: ['↑', '↓'] },
    { action: 'Open the submenu and focus its first item.', keys: ['→', 'Enter', 'Space'] },
    { action: 'Close the current submenu and go back to its parent item.', keys: ['←', 'Esc'] },
    { action: 'Close the whole menu and move focus on.', keys: ['Tab'] },
    { action: 'Choose the focused item.', keys: ['Enter', 'Space'] },
];

const testCode = `import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NestedDropdown } from 'mui-nested-menu';

test('opens the Export submenu with the keyboard', async () => {
  const user = userEvent.setup();
  render(<NestedDropdown menuItemsData={fileMenu} />);

  // Opening the dropdown focuses its first item
  await user.click(screen.getByRole('button', { name: 'File' }));

  // Down to Export, then open it: focus moves to the first submenu item
  await user.keyboard('{ArrowDown}{ArrowDown}{ArrowRight}');
  await waitFor(() => expect(document.activeElement).toHaveTextContent('PDF'));

  // ArrowLeft closes just that level and returns focus to Export
  await user.keyboard('{ArrowLeft}');
  await waitFor(() => expect(document.activeElement).toHaveTextContent('Export'));
});`;

export const KeyboardAndTouchPage: FC = () => {
    return (
        <Fragment>
            <PageHeader
                description="How the menus respond to a mouse, a keyboard and a finger. Version 4.1 reworked all three."
                importCode={false}
                title="Keyboard and touch"
            />

            <SampleBox hint="Click File, then use the arrow keys. Or tap File and Export on a phone.">
                <NestedDropdown ButtonProps={{ variant: 'outlined' }} menuItemsData={fileMenu} />
            </SampleBox>

            <Subheading id="mouse">Mouse</Subheading>
            <List>
                <li>Hovering a parent item opens its submenu, after its optional delay.</li>
                <li>Moving off the item and its submenu closes the submenu again.</li>
                <li>
                    Clicking a parent item opens its submenu and keeps the menu open. Since 4.1 the
                    item&apos;s <Code>callback</Code> fires too (
                    <Link to={`/${PathNames.EXAMPLES}#callbacks-on-parent-items`}>example</Link>).
                </li>
                <li>Clicking an item without children fires its callback and closes the menu.</li>
            </List>

            <Subheading id="keyboard">Keyboard</Subheading>
            <P>
                Opening a <Code>NestedDropdown</Code> from its button puts focus on the first item. Only the
                path you&apos;re on stays open.
            </P>
            <KeyTable>
                <thead>
                    <tr>
                        <th>Keys</th>
                        <th>What happens</th>
                    </tr>
                </thead>
                <tbody>
                    {keys.map((row) => (
                        <tr key={row.action}>
                            <td>
                                {row.keys.map((key) => (
                                    <Kbd key={key}>{key}</Kbd>
                                ))}
                            </td>
                            <td>{row.action}</td>
                        </tr>
                    ))}
                </tbody>
            </KeyTable>
            <P>
                With <Code>placement=&quot;left&quot;</Code> the arrows swap: <Kbd>←</Kbd>opens a submenu and{' '}
                <Kbd>→</Kbd>closes it. Moving focus out of a parent item and its submenu closes the submenu,
                so stale menus never stay open.
            </P>

            <Subheading id="touch">Touch</Subheading>
            <List>
                <li>A tap on a parent item opens its submenu; a second tap closes it.</li>
                <li>
                    The tap that opens a submenu can&apos;t select an item in it, even when the submenu
                    appears under your finger.
                </li>
                <li>Emulated hover on touch screens no longer opens submenus by accident.</li>
            </List>

            <Subheading id="context-menu">Context menu</Subheading>
            <P>
                <Code>ContextMenu</Code> listens for the browser&apos;s native <Code>contextmenu</Code> event,
                so it opens on a right-click, a Ctrl-click on macOS, a long-press on touch browsers that fire
                the event, and the <Kbd>Menu</Kbd>key or <Kbd>Shift</Kbd>+<Kbd>F10</Kbd>on a keyboard. From a
                keyboard it opens at the wrapped element.
            </P>
            <SampleBox hint="Right-click, Ctrl-click or long-press the box.">
                <ContextMenu menuItemsData={contextItems}>
                    <ContextArea>Right-click here</ContextArea>
                </ContextMenu>
            </SampleBox>

            <Subheading id="scrolling">Scrolling</Subheading>
            <P>
                Submenus taller than the screen scroll with the mouse wheel and the trackpad. See{' '}
                <Link to={`/${PathNames.EXAMPLES}#long-submenus`}>Long submenus</Link>.
            </P>

            <Subheading id="accessibility">Accessibility</Subheading>
            <P>
                Parent items have <Code>aria-haspopup=&quot;menu&quot;</Code> and <Code>aria-expanded</Code>,
                and their default chevron points the way the submenu opens. Submenus are MUI <Code>Menu</Code>
                s, so they keep MUI&apos;s roles and focus handling.
            </P>

            <Subheading id="testing-the-keyboard">Testing the keyboard</Subheading>
            <P>
                Testing Library&apos;s <Code>user.keyboard</Code> drives the same keys. For mouse tests, see{' '}
                <Link to={`/${PathNames.EXAMPLES}#testing-with-testing-library`}>
                    Testing with Testing Library
                </Link>
                .
            </P>
            <CodeBlock code={testCode} />
            <Callout>
                <Code>toHaveTextContent</Code> comes from <Code>@testing-library/jest-dom</Code>. The menus
                render in a portal, so query them through <Code>screen</Code> rather than the container.
            </Callout>
        </Fragment>
    );
};
