import { css } from '@emotion/react';
import styled from '@emotion/styled';
import ContentCopyIcon from '@mui/icons-material/ContentCopyOutlined';
import ContentCutIcon from '@mui/icons-material/ContentCutOutlined';
import ContentPasteIcon from '@mui/icons-material/ContentPasteOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Divider } from '@mui/material';
import { ContextMenu, IconMenuItem, MenuItemData } from 'mui-nested-menu';
import { FC, Fragment, MouseEvent } from 'react';
import { Link } from 'react-router-dom';

import { CodeBlock } from '@/components/CodeBlock';
import { PageHeader } from '@/components/ImportSample';
import { PropsTable } from '@/components/PropsTable';
import { SampleBox } from '@/components/SampleBox';
import { Code, P, Subheading } from '@/components/StyledTypography';
import { PathNames } from '@/core/configs/paths';

const ContextArea = styled.div`
    ${({ theme }) => css`
        align-items: center;
        border: 1px dashed ${theme.palette.border1};
        border-radius: ${theme.sizes.borderRadiusMedium};
        color: ${theme.palette.font2};
        display: flex;
        font-family: ${theme.typeography.family};
        font-size: 0.875rem;
        height: 120px;
        justify-content: center;
        max-width: 100%;
        user-select: none;
        width: 320px;
    `}
`;

const logClick = (event: MouseEvent<HTMLElement>, item: MenuItemData) =>
    console.log(`${item.label} clicked`, event, item);

const menuItemsData: MenuItemData[] = [
    { callback: logClick, label: 'Cut', leftIcon: <ContentCutIcon fontSize="small" /> },
    { callback: logClick, label: 'Copy', leftIcon: <ContentCopyIcon fontSize="small" /> },
    {
        MenuItemProps: { divider: true },
        items: [
            { callback: logClick, label: 'Plain text' },
            { callback: logClick, label: 'Values only' },
            {
                delay: 300,
                items: [
                    { callback: logClick, label: 'Rows' },
                    { callback: logClick, label: 'Columns' },
                ],
                label: 'Transposed (300 ms delay)',
            },
        ],
        label: 'Paste special',
        leftIcon: <ContentPasteIcon fontSize="small" />,
    },
    {
        callback: logClick,
        label: 'Delete',
        leftIcon: <DeleteIcon fontSize="small" />,
        sx: { color: 'error.main' },
    },
];

const menuItemsDataCode = `const menuItemsData: MenuItemData[] = [
  { label: 'Cut', leftIcon: <ContentCutIcon fontSize="small" />, callback: logClick },
  { label: 'Copy', leftIcon: <ContentCopyIcon fontSize="small" />, callback: logClick },
  {
    label: 'Paste special',
    leftIcon: <ContentPasteIcon fontSize="small" />,
    MenuItemProps: { divider: true }, // line under this item
    items: [
      { label: 'Plain text', callback: logClick },
      { label: 'Values only', callback: logClick },
      {
        label: 'Transposed (300 ms delay)',
        delay: 300,
        items: [
          { label: 'Rows', callback: logClick },
          { label: 'Columns', callback: logClick },
        ],
      },
    ],
  },
  { label: 'Delete', leftIcon: <DeleteIcon fontSize="small" />, sx: { color: 'error.main' }, callback: logClick },
];

<ContextMenu menuItemsData={menuItemsData}>
  <div>Right-click here</div>
</ContextMenu>`;

const submenuStyle = { slotProps: { paper: { sx: { borderRadius: 2, minWidth: 200 } } } };

export const ContextMenuPage: FC = () => {
    return (
        <Fragment>
            <PageHeader
                description={
                    <Fragment>
                        Wrap any element to give it a nested right-click menu. It opens at the pointer on the
                        browser&apos;s native <Code>contextmenu</Code> event.
                    </Fragment>
                }
            />

            <SampleBox hint="Right-click the box (Ctrl-click on a Mac, long-press on touch). Clicks are logged to the console.">
                <ContextMenu menuItemsData={menuItemsData}>
                    <ContextArea>Right-click here</ContextArea>
                </ContextMenu>
            </SampleBox>
            <CodeBlock code={menuItemsDataCode} collapsable />
            <P>
                Besides right-click, it opens on a Ctrl-click on macOS, a long-press on touch browsers that
                fire <Code>contextmenu</Code>, and the Menu key or Shift+F10. See{' '}
                <Link to={`/${PathNames.KEYBOARD_AND_TOUCH}`}>Keyboard and touch</Link>. Item clicks, at the
                top level and in submenus, fire their callbacks and close the menu.
            </P>

            <Subheading>Elements instead of data</Subheading>
            <P>
                Pass <Code>menuItems</Code> instead of <Code>menuItemsData</Code> to build the menu from your
                own elements, such as <Code>IconMenuItem</Code>s, <Code>NestedMenuItem</Code>s and{' '}
                <Code>Divider</Code>s.
            </P>
            <SampleBox hint="Right-click the box.">
                <ContextMenu
                    menuItems={[
                        <IconMenuItem key="cut" label="Cut" leftIcon={<ContentCutIcon fontSize="small" />} />,
                        <IconMenuItem
                            key="copy"
                            label="Copy"
                            leftIcon={<ContentCopyIcon fontSize="small" />}
                        />,
                        <Divider key="divider" />,
                        <IconMenuItem
                            key="delete"
                            label="Delete"
                            leftIcon={<DeleteIcon fontSize="small" />}
                        />,
                    ]}
                >
                    <ContextArea>Right-click here</ContextArea>
                </ContextMenu>
            </SampleBox>
            <CodeBlock
                code={`<ContextMenu
  menuItems={[
    <IconMenuItem key="cut" label="Cut" leftIcon={<ContentCutIcon fontSize="small" />} />,
    <IconMenuItem key="copy" label="Copy" leftIcon={<ContentCopyIcon fontSize="small" />} />,
    <Divider key="divider" />,
    <IconMenuItem key="delete" label="Delete" leftIcon={<DeleteIcon fontSize="small" />} />,
  ]}
>
  <div>Right-click here</div>
</ContextMenu>`}
            />
            <P>
                Either way, a click on an item closes the menu, as do Escape and a click outside. A parent
                item only opens its submenu.
            </P>

            <Subheading>Menu and submenu props</Subheading>
            <P>
                <Code>MenuProps</Code> goes to the root menu and <Code>SubmenuProps</Code> to every submenu at
                every depth. Use <Code>placement=&quot;left&quot;</Code> when the area sits near the right
                edge of the screen.
            </P>
            <SampleBox
                hint="Right-click the box: submenus open to the left with rounded corners."
                justify="flex-end"
            >
                <ContextMenu
                    MenuProps={submenuStyle}
                    SubmenuProps={submenuStyle}
                    menuItemsData={menuItemsData}
                    placement="left"
                >
                    <ContextArea>Right-click here</ContextArea>
                </ContextMenu>
            </SampleBox>
            <CodeBlock
                code={`const paperStyle = { slotProps: { paper: { sx: { borderRadius: 2, minWidth: 200 } } } };

<ContextMenu
  menuItemsData={menuItemsData}
  placement="left"
  MenuProps={paperStyle}      // root menu
  SubmenuProps={paperStyle}   // every submenu, at every depth
>
  <div>Right-click here</div>
</ContextMenu>`}
            />

            <Subheading>Props</Subheading>
            <PropsTable
                rows={[
                    {
                        description: 'The area that opens the menu.',
                        name: 'children',
                        type: 'ReactNode',
                    },
                    {
                        description: (
                            <Fragment>
                                The menu, as data. Every field is described under{' '}
                                <Link to={`/${PathNames.MENU_ITEMS_FROM_OBJECT}#menu-item-data`}>
                                    MenuItemData
                                </Link>
                                .
                            </Fragment>
                        ),
                        name: 'menuItemsData',
                        type: 'MenuItemData[]',
                    },
                    {
                        description: (
                            <Fragment>
                                The menu, as elements. Used instead of <Code>menuItemsData</Code>.
                            </Fragment>
                        ),
                        name: 'menuItems',
                        type: 'ReactNode[]',
                    },
                    {
                        description: (
                            <Fragment>
                                Props for the root MUI <Code>Menu</Code>.
                            </Fragment>
                        ),
                        name: 'MenuProps',
                        since: '4.1',
                        type: 'Partial<MenuProps>',
                    },
                    {
                        description: (
                            <Fragment>
                                Props for every submenu&apos;s MUI <Code>Menu</Code>, at every depth (
                                <Code>sx</Code>, <Code>className</Code>, <Code>slotProps</Code>,{' '}
                                <Code>hideBackdrop</Code>…). Applies to <Code>menuItemsData</Code>.
                            </Fragment>
                        ),
                        name: 'SubmenuProps',
                        since: '4.1',
                        type: 'Partial<MenuProps>',
                    },
                    {
                        default: "'right'",
                        description: 'Which side submenus open on. The arrow keys follow it.',
                        name: 'placement',
                        since: '4.1',
                        type: "'right' | 'left'",
                    },
                    {
                        description: 'Forwarded to the wrapping <div>.',
                        name: 'ref',
                        type: 'Ref<HTMLDivElement>',
                    },
                ]}
            />
        </Fragment>
    );
};
