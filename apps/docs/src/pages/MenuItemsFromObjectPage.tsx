import ContentCopyIcon from '@mui/icons-material/ContentCopyOutlined';
import ContentCutIcon from '@mui/icons-material/ContentCutOutlined';
import ContentPasteIcon from '@mui/icons-material/ContentPasteOutlined';
import { Button, Menu } from '@mui/material';
import { MenuItemData, nestedMenuItemsFromObject } from 'mui-nested-menu';
import { FC, Fragment, MouseEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { CodeBlock } from '@/components/CodeBlock';
import { PageHeader } from '@/components/ImportSample';
import { PropsTable } from '@/components/PropsTable';
import { SampleBox } from '@/components/SampleBox';
import { Code, P, Subheading } from '@/components/StyledTypography';
import { PathNames } from '@/core/configs/paths';

const menuItemsData: MenuItemData[] = [
    { callback: () => console.log('Cut'), label: 'Cut', leftIcon: <ContentCutIcon fontSize="small" /> },
    { callback: () => console.log('Copy'), label: 'Copy', leftIcon: <ContentCopyIcon fontSize="small" /> },
    {
        items: [
            { callback: () => console.log('Paste as plain text'), label: 'Plain text' },
            { callback: () => console.log('Paste values only'), label: 'Values only' },
            {
                items: [
                    { callback: () => console.log('Paste rows'), label: 'Rows' },
                    { callback: () => console.log('Paste columns'), label: 'Columns' },
                ],
                label: 'Transposed',
            },
        ],
        label: 'Paste special',
        leftIcon: <ContentPasteIcon fontSize="small" />,
    },
];

const submenuStyle = { slotProps: { paper: { sx: { minWidth: 180 } } } };

const ObjectMenuDemo: FC = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);

    const handleClose = () => setAnchorEl(null);

    return (
        <div>
            <Button onClick={handleClick} variant="outlined">
                Edit
            </Button>
            <Menu anchorEl={anchorEl} onClose={handleClose} open={open}>
                {nestedMenuItemsFromObject({
                    MenuProps: submenuStyle,
                    handleClose,
                    isOpen: open,
                    menuItemsData,
                })}
            </Menu>
        </div>
    );
};

const demoCode = `import { Button, Menu } from '@mui/material';
import { nestedMenuItemsFromObject, type MenuItemData } from 'mui-nested-menu';
import { useState, type MouseEvent } from 'react';

const menuItemsData: MenuItemData[] = [
  { label: 'Cut', leftIcon: <ContentCutIcon fontSize="small" />, callback: () => console.log('Cut') },
  { label: 'Copy', leftIcon: <ContentCopyIcon fontSize="small" />, callback: () => console.log('Copy') },
  {
    label: 'Paste special',
    leftIcon: <ContentPasteIcon fontSize="small" />,
    items: [
      { label: 'Plain text', callback: () => console.log('Paste as plain text') },
      { label: 'Values only', callback: () => console.log('Paste values only') },
      {
        label: 'Transposed',
        items: [
          { label: 'Rows', callback: () => console.log('Paste rows') },
          { label: 'Columns', callback: () => console.log('Paste columns') },
        ],
      },
    ],
  },
];

export function EditMenu() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <div>
      <Button variant="outlined" onClick={handleClick}>
        Edit
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {nestedMenuItemsFromObject({
          menuItemsData,
          isOpen: open,
          handleClose,
          // Applied to every submenu, at every depth
          MenuProps: { slotProps: { paper: { sx: { minWidth: 180 } } } },
        })}
      </Menu>
    </div>
  );
}`;

export const MenuItemsFromObjectPage: FC = () => {
    return (
        <Fragment>
            <PageHeader
                description={
                    <Fragment>
                        Turns menu data into elements you can put in any MUI <Code>{'<Menu>'}</Code>.{' '}
                        <Code>NestedDropdown</Code> and <Code>ContextMenu</Code> use it under the hood; use it
                        yourself when you need your own trigger or your own <Code>Menu</Code>.
                    </Fragment>
                }
                importCode="import { nestedMenuItemsFromObject, type MenuItemData } from 'mui-nested-menu';"
            />

            <SampleBox hint="Click Edit, then hover Paste special and Transposed. Clicks are logged to the console.">
                <ObjectMenuDemo />
            </SampleBox>
            <CodeBlock code={demoCode} collapsable />

            <Subheading>Options</Subheading>
            <P>
                Call it with one object. It returns an array of elements: an <Code>IconMenuItem</Code> for
                each item without children and a <Code>NestedMenuItem</Code> for each item with children.
            </P>
            <PropsTable
                nameLabel="Option"
                rows={[
                    {
                        description: 'The items to render.',
                        name: 'menuItemsData',
                        required: true,
                        type: 'MenuItemData[]',
                    },
                    {
                        description: (
                            <Fragment>
                                Whether the menu is open. Pass the <Code>open</Code> of the <Code>Menu</Code>{' '}
                                the items sit in, so submenus close with it.
                            </Fragment>
                        ),
                        name: 'isOpen',
                        required: true,
                        type: 'boolean',
                    },
                    {
                        description: 'Closes the menu. Called after a click on an item without children.',
                        name: 'handleClose',
                        required: true,
                        type: '() => void',
                    },
                    {
                        description: (
                            <Fragment>
                                Props for every submenu&apos;s MUI <Code>Menu</Code>, at every depth (
                                <Code>sx</Code>, <Code>className</Code>, <Code>slotProps</Code>,{' '}
                                <Code>hideBackdrop</Code>…).
                            </Fragment>
                        ),
                        name: 'MenuProps',
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
                ]}
            />

            <Subheading id="menu-item-data">MenuItemData</Subheading>
            <P>
                The type behind <Code>menuItemsData</Code> on every component. <Code>NestedDropdown</Code>{' '}
                takes one root object (its <Code>label</Code> is the button and its <Code>items</Code> are the
                menu); <Code>ContextMenu</Code> and <Code>nestedMenuItemsFromObject</Code> take an array.
            </P>
            <PropsTable
                nameLabel="Field"
                rows={[
                    {
                        description: "The item's text.",
                        name: 'label',
                        type: 'string',
                    },
                    {
                        description: (
                            <Fragment>
                                Custom label, used instead of <Code>label</Code>. On{' '}
                                <Code>NestedDropdown</Code>&apos;s root data it&apos;s the button label. See{' '}
                                <Link to={`/${PathNames.EXAMPLES}#custom-labels`}>Custom labels</Link>.
                            </Fragment>
                        ),
                        name: 'renderLabel',
                        since: '4.1',
                        type: '() => ReactNode',
                    },
                    {
                        description: 'Child items. An item with items opens a submenu.',
                        name: 'items',
                        type: 'MenuItemData[]',
                    },
                    {
                        description: (
                            <Fragment>
                                Fires when the item is clicked. Items without children then close the menu.
                                Since 4.1 it also fires for items with children, and the menu stays open (
                                <Link to={`/${PathNames.EXAMPLES}#callbacks-on-parent-items`}>example</Link>
                                ).
                            </Fragment>
                        ),
                        name: 'callback',
                        type: '(event: MouseEvent<HTMLElement>, item: MenuItemData) => void',
                    },
                    {
                        description: 'Icon before the label.',
                        name: 'leftIcon',
                        type: 'ReactNode',
                    },
                    {
                        description: 'Icon after the label.',
                        name: 'rightIcon',
                        type: 'ReactNode',
                    },
                    {
                        description: 'Disables the item.',
                        name: 'disabled',
                        type: 'boolean',
                    },
                    {
                        default: '0',
                        description: "Hover delay in milliseconds before this item's submenu opens.",
                        name: 'delay',
                        type: 'number',
                    },
                    {
                        description: 'Styles for the item.',
                        name: 'sx',
                        type: 'SxProps',
                    },
                    {
                        description: (
                            <Fragment>
                                Extra props for the item&apos;s MUI <Code>MenuItem</Code>, such as{' '}
                                <Code>className</Code>, <Code>divider</Code> or <Code>data-testid</Code>.
                            </Fragment>
                        ),
                        name: 'MenuItemProps',
                        since: '4.1',
                        type: 'Partial<MenuItemProps>',
                    },
                    {
                        description:
                            "Stable React key. Without one, the key is the label plus the item's position, so duplicate labels are fine.",
                        name: 'uid',
                        type: 'string',
                    },
                ]}
            />
        </Fragment>
    );
};
