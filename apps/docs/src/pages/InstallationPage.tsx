import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { MenuItemData, NestedDropdown } from 'mui-nested-menu';
import { FC, Fragment } from 'react';
import { Link } from 'react-router-dom';

import { CodeBlock } from '@/components/CodeBlock';
import { PageHeader } from '@/components/ImportSample';
import { InstallTabs } from '@/components/InstallTabs';
import { SampleBox } from '@/components/SampleBox';
import { Callout, Code, List, OrderedList, P, Subheading } from '@/components/StyledTypography';
import { WahluBanner } from '@/components/WahluBanner';
import { PathNames } from '@/core/configs/paths';
import { CHANGELOG_URL, GITHUB_URL, NPM_URL } from '@/core/links';

const Facts = styled.div`
    ${({ theme }) => css`
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 8px;

        span {
            background-color: ${theme.palette.bg2};
            border: 1px solid ${theme.palette.border1};
            border-radius: 999px;
            color: ${theme.palette.font2};
            font-family: ${theme.typeography.family};
            font-size: 0.75rem;
            font-weight: 500;
            padding: 2px 10px;
        }
    `}
`;

const quickStartData: MenuItemData = {
    items: [
        { callback: () => console.log('New'), label: 'New' },
        { callback: () => console.log('Save'), label: 'Save' },
        {
            items: [
                { callback: () => console.log('PDF'), label: 'PDF' },
                {
                    items: [
                        { callback: () => console.log('PNG'), label: 'PNG' },
                        { callback: () => console.log('JPEG'), label: 'JPEG' },
                    ],
                    label: 'Image',
                },
            ],
            label: 'Export',
        },
    ],
    label: 'File',
};

const quickStartCode = `import { NestedDropdown, type MenuItemData } from 'mui-nested-menu';

const menuItemsData: MenuItemData = {
  label: 'File',
  items: [
    { label: 'New', callback: () => console.log('New') },
    { label: 'Save', callback: () => console.log('Save') },
    {
      label: 'Export',
      items: [
        { label: 'PDF', callback: () => console.log('PDF') },
        {
          label: 'Image',
          items: [
            { label: 'PNG', callback: () => console.log('PNG') },
            { label: 'JPEG', callback: () => console.log('JPEG') },
          ],
        },
      ],
    },
  ],
};

export default function App() {
  return <NestedDropdown menuItemsData={menuItemsData} />;
}`;

export const InstallationPage: FC = () => {
    return (
        <Fragment>
            <WahluBanner />
            <div style={{ height: 40 }} />
            <PageHeader
                description={
                    <Fragment>
                        Infinitely nested menus for MUI (Material UI): dropdowns, context menus and submenus
                        that work with a mouse, a keyboard and touch.
                    </Fragment>
                }
                importCode={false}
                title="MUI Nested Menu"
            />
            <Facts>
                <span>MUI 5, 6, 7 and 9</span>
                <span>React 17, 18 and 19</span>
                <span>ESM and CommonJS</span>
                <span>TypeScript types included</span>
                <span>MIT licence</span>
            </Facts>

            <Subheading>Install</Subheading>
            <InstallTabs packages="mui-nested-menu" />
            <P>The package uses your app&apos;s MUI. If you don&apos;t have MUI yet, install it too:</P>
            <InstallTabs packages="@mui/material @emotion/react @emotion/styled" />

            <Subheading>Quick start</Subheading>
            <P>
                Describe the menu as data and pass it to <Code>NestedDropdown</Code>. Items with{' '}
                <Code>items</Code> open a submenu; nest them as deep as you like.
            </P>
            <SampleBox hint="Click File, then hover Export or use the arrow keys.">
                <NestedDropdown menuItemsData={quickStartData} />
            </SampleBox>
            <CodeBlock code={quickStartCode} />

            <Subheading>What&apos;s in the package</Subheading>
            <List>
                <li>
                    <Link to={`/${PathNames.NESTED_DROPDOWN}`}>NestedDropdown</Link>: a button that opens a
                    nested menu built from data.
                </li>
                <li>
                    <Link to={`/${PathNames.CONTEXT_MENU}`}>ContextMenu</Link>: a right-click (and long-press)
                    menu around any element.
                </li>
                <li>
                    <Link to={`/${PathNames.NESTED_MENU_ITEM}`}>NestedMenuItem</Link>: a menu item with a
                    submenu, for use inside your own MUI <Code>{'<Menu>'}</Code>.
                </li>
                <li>
                    <Link to={`/${PathNames.ICON_MENU_ITEM}`}>IconMenuItem</Link>: a menu item with icons on
                    the left and right.
                </li>
                <li>
                    <Link to={`/${PathNames.MENU_ITEMS_FROM_OBJECT}`}>nestedMenuItemsFromObject</Link> and{' '}
                    <Link to={`/${PathNames.MENU_ITEMS_FROM_OBJECT}#menu-item-data`}>MenuItemData</Link>: turn
                    data into menu items for any MUI <Code>{'<Menu>'}</Code>, and the type that describes
                    them.
                </li>
            </List>
            <P>
                Common tasks (MUI Select, styling submenus, opening to the left, custom labels, testing) are
                on the <Link to={`/${PathNames.EXAMPLES}`}>Examples</Link> page.
            </P>

            <Subheading>Compatibility</Subheading>
            <List>
                <li>
                    <strong>MUI</strong>: <Code>@mui/material</Code> 5, 6, 7 and 9 (there is no MUI 8).
                </li>
                <li>
                    <strong>React</strong>: 17, 18 and 19.
                </li>
                <li>
                    <strong>Modules</strong>: ships ESM and CommonJS builds with TypeScript types, so it works
                    with <Code>import</Code> and <Code>require()</Code>.
                </li>
                <li>
                    <strong>Next.js</strong>: the bundles start with <Code>&quot;use client&quot;</Code>, so
                    you can import the components in an App Router page without <Code>transpilePackages</Code>
                    .
                </li>
            </List>

            <Subheading>What&apos;s new in 4.1</Subheading>
            <List>
                <li>
                    <Code>placement=&quot;left&quot;</Code> opens submenus to the left, and the arrow keys
                    follow it.
                </li>
                <li>
                    <Code>SubmenuProps</Code> on <Code>NestedDropdown</Code> and <Code>ContextMenu</Code>{' '}
                    styles every submenu at every depth.
                </li>
                <li>
                    <Code>renderLabel</Code> and <Code>MenuItemProps</Code> in <Code>MenuItemData</Code>, and{' '}
                    <Code>callback</Code> now fires on items that have children.
                </li>
                <li>
                    Keyboard, touch and scrolling fixes: only the active path stays open, taps don&apos;t
                    select items by accident, and long submenus scroll.
                </li>
                <li>ESM and CommonJS builds that work in Next.js App Router and Node.</li>
                <li>MUI 9 joins MUI 5, 6 and 7 in the supported range.</li>
            </List>
            <P>
                Nothing was removed or renamed, so upgrading from 4.0 needs no code changes. Every release is
                listed in the <a href={CHANGELOG_URL}>changelog</a>.
            </P>

            <Subheading>Contributing</Subheading>
            <P>
                Pull requests on <a href={GITHUB_URL}>GitHub</a> are welcome. The repository is a pnpm
                monorepo: the package lives in <Code>packages/mui-nested-menu</Code> and this site in{' '}
                <Code>apps/docs</Code>, which uses the package source directly, so your changes show up here
                as you work.
            </P>
            <OrderedList>
                <li>Fork and clone the repository.</li>
                <li>
                    Run <Code>pnpm install</Code>, then <Code>pnpm start</Code> to open the docs on{' '}
                    <Code>localhost:1000</Code>.
                </li>
                <li>Make your change on a new branch.</li>
                <li>Open a pull request that explains what it fixes.</li>
            </OrderedList>
            <Callout>
                Found a bug or missing a feature? Open an issue on <a href={`${GITHUB_URL}/issues`}>GitHub</a>
                . The package is published on <a href={NPM_URL}>npm</a>.
            </Callout>
        </Fragment>
    );
};
