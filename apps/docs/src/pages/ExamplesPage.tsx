import { Avatar, Box, Button, Chip, Divider, GlobalStyles, Menu, MenuItem, TextField } from '@mui/material';
import { MenuItemData, NestedDropdown, NestedMenuItem, nestedMenuItemsFromObject } from 'mui-nested-menu';
import { FC, Fragment, MouseEvent, SyntheticEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { CodeBlock } from '@/components/CodeBlock';
import { PageHeader } from '@/components/ImportSample';
import { SampleBox } from '@/components/SampleBox';
import { Callout, Code, List, P, Subheading } from '@/components/StyledTypography';
import { PathNames } from '@/core/configs/paths';
import { issueUrl } from '@/core/links';

const IssueLink: FC<{ issue: number }> = ({ issue }) => <a href={issueUrl(issue)}>#{issue}</a>;

const sections = [
    { id: 'use-with-mui-select', title: 'Use with MUI Select' },
    { id: 'styling-submenus', title: 'Styling submenus' },
    { id: 'custom-labels', title: 'Custom labels' },
    { id: 'open-to-the-left', title: 'Open to the left' },
    { id: 'callbacks-on-parent-items', title: 'Callbacks on parent items' },
    { id: 'long-submenus', title: 'Long submenus that scroll' },
    { id: 'testing-with-testing-library', title: 'Testing with Testing Library' },
];

const Section: FC<{ id: string }> = ({ id }) => (
    <Subheading id={id}>{sections.find((section) => section.id === id)?.title}</Subheading>
);

/* -------------------------------------------------------------------------------------------------
 * Use with MUI Select (#51)
 * -----------------------------------------------------------------------------------------------*/

const NestedSelectDemo: FC = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [value, setValue] = useState('');
    const open = Boolean(anchorEl);

    const handleClose = () => setAnchorEl(null);

    const choose = (_event: MouseEvent<HTMLElement>, item: MenuItemData) => setValue(item.label ?? '');

    const menuItemsData: MenuItemData[] = [
        {
            items: [
                { callback: choose, label: 'Apple' },
                { callback: choose, label: 'Banana' },
                { callback: choose, label: 'Mango' },
            ],
            label: 'Fruit',
        },
        {
            items: [
                {
                    items: [
                        { callback: choose, label: 'Carrot' },
                        { callback: choose, label: 'Potato' },
                    ],
                    label: 'Roots',
                },
                {
                    items: [
                        { callback: choose, label: 'Lettuce' },
                        { callback: choose, label: 'Spinach' },
                    ],
                    label: 'Leaves',
                },
            ],
            label: 'Vegetables',
        },
        { callback: choose, label: 'Bread' },
    ];

    return (
        <Fragment>
            <TextField
                label="Food"
                select
                slotProps={{
                    select: {
                        onOpen: (event: SyntheticEvent) => setAnchorEl(event.currentTarget as HTMLElement),
                        open: false,
                    },
                }}
                sx={{ minWidth: 240 }}
                value={value}
            >
                <MenuItem value={value}>{value}</MenuItem>
            </TextField>
            <Menu anchorEl={anchorEl} onClose={handleClose} open={open}>
                {nestedMenuItemsFromObject({ handleClose, isOpen: open, menuItemsData })}
            </Menu>
        </Fragment>
    );
};

const nestedSelectCode = `import { Menu, MenuItem, TextField } from '@mui/material';
import { nestedMenuItemsFromObject, type MenuItemData } from 'mui-nested-menu';
import { useState, type MouseEvent, type SyntheticEvent } from 'react';

export function NestedSelect() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [value, setValue] = useState('');
  const open = Boolean(anchorEl);

  const handleClose = () => setAnchorEl(null);
  const choose = (_event: MouseEvent<HTMLElement>, item: MenuItemData) => setValue(item.label ?? '');

  const menuItemsData: MenuItemData[] = [
    {
      label: 'Fruit',
      items: [
        { label: 'Apple', callback: choose },
        { label: 'Banana', callback: choose },
        { label: 'Mango', callback: choose },
      ],
    },
    {
      label: 'Vegetables',
      items: [
        {
          label: 'Roots',
          items: [
            { label: 'Carrot', callback: choose },
            { label: 'Potato', callback: choose },
          ],
        },
        {
          label: 'Leaves',
          items: [
            { label: 'Lettuce', callback: choose },
            { label: 'Spinach', callback: choose },
          ],
        },
      ],
    },
    { label: 'Bread', callback: choose },
  ];

  return (
    <>
      <TextField
        select
        label="Food"
        value={value}
        sx={{ minWidth: 240 }}
        slotProps={{
          select: {
            open: false, // keep MUI's own list closed...
            onOpen: (event: SyntheticEvent) => setAnchorEl(event.currentTarget as HTMLElement), // ...and open ours
          },
        }}
      >
        {/* One option, so the field can show the chosen value */}
        <MenuItem value={value}>{value}</MenuItem>
      </TextField>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {nestedMenuItemsFromObject({ menuItemsData, isOpen: open, handleClose })}
      </Menu>
    </>
  );
}`;

/* -------------------------------------------------------------------------------------------------
 * Styling submenus (#54, #36, #46, #43)
 * -----------------------------------------------------------------------------------------------*/

const fancySubmenuStyles = {
    '.fancy-submenu .MuiMenuItem-root:hover, .fancy-submenu .MuiMenuItem-root.Mui-focusVisible': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '.fancy-submenu .MuiPaper-root': {
        background: 'linear-gradient(135deg, #333, #444)',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        color: '#fff',
    },
};

const SubmenuClassDemo: FC = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const handleClose = () => setAnchorEl(null);

    return (
        <div>
            <GlobalStyles styles={fancySubmenuStyles} />
            <Button onClick={(event) => setAnchorEl(event.currentTarget)} variant="outlined">
                Edit
            </Button>
            <Menu anchorEl={anchorEl} onClose={handleClose} open={open}>
                <MenuItem onClick={handleClose}>Cut</MenuItem>
                <MenuItem onClick={handleClose}>Copy</MenuItem>
                <Divider />
                <NestedMenuItem
                    MenuProps={{ className: 'fancy-submenu' }}
                    label="Paste special"
                    parentMenuOpen={open}
                >
                    <MenuItem onClick={handleClose}>Values only</MenuItem>
                    <MenuItem onClick={handleClose}>Formatting only</MenuItem>
                    <MenuItem onClick={handleClose}>Transposed</MenuItem>
                </NestedMenuItem>
            </Menu>
        </div>
    );
};

const submenuClassCode = `/* styles.css */
.fancy-submenu .MuiPaper-root {
  background: linear-gradient(135deg, #333, #444);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  color: #fff;
}

// The class goes on the submenu, through MenuProps
<Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
  <MenuItem onClick={handleClose}>Cut</MenuItem>
  <MenuItem onClick={handleClose}>Copy</MenuItem>
  <Divider />
  <NestedMenuItem
    label="Paste special"
    parentMenuOpen={open}
    MenuProps={{ className: 'fancy-submenu' }}
  >
    <MenuItem onClick={handleClose}>Values only</MenuItem>
    <MenuItem onClick={handleClose}>Formatting only</MenuItem>
    <MenuItem onClick={handleClose}>Transposed</MenuItem>
  </NestedMenuItem>
</Menu>`;

const roundedPaper = {
    slotProps: {
        paper: {
            sx: {
                '& .MuiMenuItem-root': { borderRadius: 1, mx: 0.5 },
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                minWidth: 200,
            },
        },
    },
};

const editMenuData: MenuItemData = {
    items: [
        { callback: () => console.log('Undo'), label: 'Undo' },
        { MenuItemProps: { divider: true }, callback: () => console.log('Redo'), label: 'Redo' },
        {
            items: [
                { callback: () => console.log('Find'), label: 'Find…' },
                { callback: () => console.log('Find and replace'), label: 'Find and replace…' },
                {
                    items: [
                        { callback: () => console.log('Match case'), label: 'Match case' },
                        { callback: () => console.log('Regular expression'), label: 'Regular expression' },
                    ],
                    label: 'Options',
                },
            ],
            label: 'Find',
        },
        {
            items: [
                { callback: () => console.log('UPPERCASE'), label: 'UPPERCASE' },
                { callback: () => console.log('lowercase'), label: 'lowercase' },
            ],
            label: 'Change case',
        },
    ],
    label: 'Edit',
};

const submenuPropsCode = `const roundedPaper = {
  slotProps: {
    paper: {
      sx: {
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        minWidth: 200,
        '& .MuiMenuItem-root': { borderRadius: 1, mx: 0.5 },
      },
    },
  },
};

const menuItemsData: MenuItemData = {
  label: 'Edit',
  items: [
    { label: 'Undo', callback: () => console.log('Undo') },
    // A divider under this item
    { label: 'Redo', callback: () => console.log('Redo'), MenuItemProps: { divider: true } },
    {
      label: 'Find',
      items: [
        { label: 'Find…', callback: () => console.log('Find') },
        { label: 'Find and replace…', callback: () => console.log('Find and replace') },
        {
          label: 'Options',
          items: [
            { label: 'Match case', callback: () => console.log('Match case') },
            { label: 'Regular expression', callback: () => console.log('Regular expression') },
          ],
        },
      ],
    },
    {
      label: 'Change case',
      items: [
        { label: 'UPPERCASE', callback: () => console.log('UPPERCASE') },
        { label: 'lowercase', callback: () => console.log('lowercase') },
      ],
    },
  ],
};

<NestedDropdown
  menuItemsData={menuItemsData}
  MenuProps={roundedPaper}     // the root menu
  SubmenuProps={roundedPaper}  // every submenu, at every depth
/>`;

/* -------------------------------------------------------------------------------------------------
 * Custom labels (#39, #50)
 * -----------------------------------------------------------------------------------------------*/

const StatusLabel: FC<{ color: string; text: string }> = ({ color, text }) => (
    <Box component="span" sx={{ alignItems: 'center', display: 'inline-flex', gap: 1, px: 1 }}>
        <Box component="span" sx={{ bgcolor: color, borderRadius: '50%', height: 8, width: 8 }} />
        {text}
    </Box>
);

const accountMenuData: MenuItemData = {
    items: [
        {
            items: [
                {
                    callback: () => console.log('Available'),
                    renderLabel: () => <StatusLabel color="success.main" text="Available" />,
                    uid: 'available',
                },
                {
                    callback: () => console.log('Busy'),
                    renderLabel: () => <StatusLabel color="error.main" text="Busy" />,
                    uid: 'busy',
                },
                {
                    callback: () => console.log('Away'),
                    renderLabel: () => <StatusLabel color="warning.main" text="Away" />,
                    uid: 'away',
                },
            ],
            renderLabel: () => <StatusLabel color="success.main" text="Status: Available" />,
            uid: 'status',
        },
        {
            callback: () => console.log('Notifications'),
            renderLabel: () => (
                <Box component="span" sx={{ alignItems: 'center', display: 'inline-flex', gap: 1, px: 1 }}>
                    Notifications
                    <Chip color="primary" label="3 new" size="small" />
                </Box>
            ),
            uid: 'notifications',
        },
        { callback: () => console.log('Sign out'), label: 'Sign out' },
    ],
    renderLabel: () => (
        <Box component="span" sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}>
            <Avatar sx={{ fontSize: 12, height: 24, width: 24 }}>ST</Avatar>
            Sam Taylor
        </Box>
    ),
};

const customLabelsCode = `const StatusLabel = ({ color, text }: { color: string; text: string }) => (
  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 1 }}>
    <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
    {text}
  </Box>
);

const menuItemsData: MenuItemData = {
  // On the root, renderLabel is the button label
  renderLabel: () => (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>ST</Avatar>
      Sam Taylor
    </Box>
  ),
  items: [
    {
      uid: 'status', // a stable key when there is no plain label
      renderLabel: () => <StatusLabel color="success.main" text="Status: Available" />,
      items: [
        { uid: 'available', renderLabel: () => <StatusLabel color="success.main" text="Available" /> },
        { uid: 'busy', renderLabel: () => <StatusLabel color="error.main" text="Busy" /> },
        { uid: 'away', renderLabel: () => <StatusLabel color="warning.main" text="Away" /> },
      ],
    },
    {
      uid: 'notifications',
      renderLabel: () => (
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 1 }}>
          Notifications
          <Chip color="primary" label="3 new" size="small" />
        </Box>
      ),
    },
    { label: 'Sign out' },
  ],
};

<NestedDropdown menuItemsData={menuItemsData} ButtonProps={{ variant: 'outlined' }} />`;

/* -------------------------------------------------------------------------------------------------
 * Open to the left (#33)
 * -----------------------------------------------------------------------------------------------*/

const settingsMenuData: MenuItemData = {
    items: [
        {
            items: [
                { callback: () => console.log('Light'), label: 'Light' },
                { callback: () => console.log('Dark'), label: 'Dark' },
                { callback: () => console.log('System'), label: 'System' },
            ],
            label: 'Theme',
        },
        {
            items: [
                { callback: () => console.log('English'), label: 'English' },
                { callback: () => console.log('Deutsch'), label: 'Deutsch' },
                {
                    items: [
                        { callback: () => console.log('Español (España)'), label: 'Español (España)' },
                        { callback: () => console.log('Español (México)'), label: 'Español (México)' },
                    ],
                    label: 'Español',
                },
            ],
            label: 'Language',
        },
        { callback: () => console.log('Keyboard shortcuts'), label: 'Keyboard shortcuts' },
    ],
    label: 'Settings',
};

const alignRight = {
    anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
    transformOrigin: { horizontal: 'right', vertical: 'top' },
} as const;

const openLeftCode = `<NestedDropdown
  menuItemsData={menuItemsData}
  placement="left"
  // Optional: line the root menu up with the button's right edge too
  MenuProps={{
    anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
    transformOrigin: { vertical: 'top', horizontal: 'right' },
  }}
/>

// The same prop works on the other components:
<ContextMenu menuItemsData={items} placement="left">…</ContextMenu>
<NestedMenuItem label="Language" parentMenuOpen={open} placement="left">…</NestedMenuItem>
nestedMenuItemsFromObject({ menuItemsData, isOpen, handleClose, placement: 'left' });`;

/* -------------------------------------------------------------------------------------------------
 * Callbacks on parent items (#34)
 * -----------------------------------------------------------------------------------------------*/

const ParentCallbackDemo: FC = () => {
    const [lastClicked, setLastClicked] = useState('nothing yet');

    const log = (_event: MouseEvent<HTMLElement>, item: MenuItemData) => setLastClicked(item.label ?? '');

    const menuItemsData: MenuItemData = {
        items: [
            {
                callback: log,
                items: [
                    { callback: log, label: 'report.pdf' },
                    { callback: log, label: 'budget.xlsx' },
                    { callback: log, label: 'notes.md' },
                ],
                label: 'Recent files',
            },
            { callback: log, label: 'Open…' },
        ],
        label: 'File',
    };

    return (
        <Fragment>
            <NestedDropdown ButtonProps={{ variant: 'outlined' }} menuItemsData={menuItemsData} />
            <Box component="span" sx={{ color: 'text.secondary', fontSize: 14 }}>
                Last clicked: <strong>{lastClicked}</strong>
            </Box>
        </Fragment>
    );
};

const parentCallbackCode = `const [lastClicked, setLastClicked] = useState('nothing yet');
const log = (_event: MouseEvent<HTMLElement>, item: MenuItemData) => setLastClicked(item.label ?? '');

const menuItemsData: MenuItemData = {
  label: 'File',
  items: [
    {
      label: 'Recent files',
      callback: log, // fires on click; the menu stays open and the submenu opens
      items: [
        { label: 'report.pdf', callback: log },
        { label: 'budget.xlsx', callback: log },
        { label: 'notes.md', callback: log },
      ],
    },
    { label: 'Open…', callback: log },
  ],
};

<NestedDropdown menuItemsData={menuItemsData} />`;

/* -------------------------------------------------------------------------------------------------
 * Long submenus (#2)
 * -----------------------------------------------------------------------------------------------*/

const fontSizes = Array.from({ length: 34 }, (_, index) => 6 + index * 2);

const longMenuData: MenuItemData = {
    items: [
        {
            items: fontSizes.map((size) => ({
                callback: () => console.log(`${size} pt`),
                label: `${size} pt`,
            })),
            label: 'Font size',
        },
        { callback: () => console.log('Bold'), label: 'Bold' },
        { callback: () => console.log('Italic'), label: 'Italic' },
    ],
    label: 'Format',
};

const scrollingPaper = { slotProps: { paper: { sx: { maxHeight: 320 } } } };

const longMenuCode = `const sizes = Array.from({ length: 34 }, (_, index) => 6 + index * 2);

const menuItemsData: MenuItemData = {
  label: 'Format',
  items: [
    {
      label: 'Font size',
      items: sizes.map((size) => ({ label: \`\${size} pt\`, callback: () => console.log(size) })),
    },
    { label: 'Bold' },
    { label: 'Italic' },
  ],
};

<NestedDropdown
  menuItemsData={menuItemsData}
  SubmenuProps={{ slotProps: { paper: { sx: { maxHeight: 320 } } } }}
/>`;

/* -------------------------------------------------------------------------------------------------
 * Testing with Testing Library (#66)
 * -----------------------------------------------------------------------------------------------*/

const testMenuData: MenuItemData = {
    items: [
        { callback: () => console.log('Save'), label: 'Save' },
        { items: [{ callback: () => console.log('PDF'), label: 'PDF' }], label: 'Export' },
    ],
    label: 'File',
};

const testingCode = `import { Checkbox, FormControlLabel, Menu, MenuItem } from '@mui/material';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NestedDropdown, NestedMenuItem, type MenuItemData } from 'mui-nested-menu';
import { expect, test, vi } from 'vitest'; // or Jest: jest.fn()

test('picks an item from a submenu', async () => {
  const user = userEvent.setup();
  const onPdf = vi.fn();
  const menuItemsData: MenuItemData = {
    label: 'File',
    items: [
      { label: 'Save' },
      { label: 'Export', items: [{ label: 'PDF', callback: onPdf }] },
    ],
  };

  render(<NestedDropdown menuItemsData={menuItemsData} />);

  await user.click(screen.getByRole('button', { name: 'File' }));
  await user.hover(screen.getByRole('menuitem', { name: 'Export' }));
  // Submenus open asynchronously, so wait for the item with findBy
  await user.click(await screen.findByRole('menuitem', { name: 'PDF' }));

  expect(onPdf).toHaveBeenCalledTimes(1);
});

test('ticks a checkbox inside a submenu', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();

  render(
    <Menu open anchorEl={document.body}>
      <NestedMenuItem label="Options" parentMenuOpen>
        <MenuItem>
          <FormControlLabel control={<Checkbox onChange={onChange} />} label="Notify me" />
        </MenuItem>
      </NestedMenuItem>
    </Menu>
  );

  await user.hover(screen.getByText('Options'));
  await user.click(await screen.findByRole('checkbox', { name: 'Notify me' }));

  expect(onChange).toHaveBeenCalledTimes(1);
});`;

/* -------------------------------------------------------------------------------------------------
 * Page
 * -----------------------------------------------------------------------------------------------*/

export const ExamplesPage: FC = () => {
    return (
        <Fragment>
            <PageHeader
                description="Recipes for the questions people ask most, each with a live demo and the code behind it."
                importCode={false}
                title="Examples"
            />
            <List>
                {sections.map((section) => (
                    <li key={section.id}>
                        <Link to={`#${section.id}`}>{section.title}</Link>
                    </li>
                ))}
            </List>

            <Section id="use-with-mui-select" />
            <P>
                MUI&apos;s <Code>Select</Code> can&apos;t hold submenus, but you can keep its look and open a
                nested menu in its place: keep the Select&apos;s own list closed, open a <Code>Menu</Code>{' '}
                from <Code>onOpen</Code>, and set the value from each item&apos;s <Code>callback</Code>. This
                pattern comes from <a href="https://github.com/mike-iqmo">@mike-iqmo</a> in{' '}
                <IssueLink issue={51} />.
            </P>
            <SampleBox hint="Click the field, or focus it and press the down arrow.">
                <NestedSelectDemo />
            </SampleBox>
            <CodeBlock code={nestedSelectCode} collapsable />
            <Callout>
                On MUI 5, pass the same object as <Code>SelectProps</Code> instead of{' '}
                <Code>slotProps.select</Code>.
            </Callout>

            <Section id="styling-submenus" />
            <P>
                <strong>A class on one submenu.</strong> <Code>className</Code> on a{' '}
                <Code>NestedMenuItem</Code> styles the item itself. To style its submenu, pass the class in{' '}
                <Code>MenuProps</Code> and target the paper inside it (<IssueLink issue={54} />
                ). Your own <Code>style</Code>, <Code>sx</Code> and <Code>slotProps.paper</Code> are kept too,
                and no longer break hover or pointer events.
            </P>
            <SampleBox hint="Open Edit, then hover Paste special.">
                <SubmenuClassDemo />
            </SampleBox>
            <CodeBlock code={submenuClassCode} />

            <P>
                <strong>Every submenu of a dropdown.</strong> On <Code>NestedDropdown</Code> and{' '}
                <Code>ContextMenu</Code>, <Code>MenuProps</Code> styles the root menu and{' '}
                <Code>SubmenuProps</Code> styles every submenu at every depth (<IssueLink issue={36} />,{' '}
                <IssueLink issue={46} />
                ). When you build items with <Code>nestedMenuItemsFromObject</Code>, pass{' '}
                <Code>MenuProps</Code> to it instead.
            </P>
            <SampleBox hint="Every level shares the rounded, bordered paper. Redo has a divider under it.">
                <NestedDropdown
                    ButtonProps={{ variant: 'outlined' }}
                    MenuProps={roundedPaper}
                    SubmenuProps={roundedPaper}
                    menuItemsData={editMenuData}
                />
            </SampleBox>
            <CodeBlock code={submenuPropsCode} collapsable />

            <P>
                <strong>Dividers.</strong> In your own <Code>Menu</Code>, put an MUI{' '}
                <Code>{'<Divider />'}</Code> between items, as in the Edit menu above. With data, add{' '}
                <Code>MenuItemProps: {'{ divider: true }'}</Code> to the item above the line. Other{' '}
                <Code>Menu</Code> props such as <Code>hideBackdrop</Code> go in <Code>MenuProps</Code> or{' '}
                <Code>SubmenuProps</Code> the same way (<IssueLink issue={43} />
                ).
            </P>

            <Section id="custom-labels" />
            <P>
                Use <Code>renderLabel</Code> wherever a plain string isn&apos;t enough: on any item, and on
                the root of <Code>NestedDropdown</Code>&apos;s data, where it becomes the button label (
                <IssueLink issue={39} />, <IssueLink issue={50} />
                ). Give items without a <Code>label</Code> a <Code>uid</Code>, which is used as their key. A
                custom label replaces the plain label&apos;s padding too, so add <Code>px: 1</Code> to line it
                up with the other items.
            </P>
            <SampleBox hint="The button, Status and Notifications all use renderLabel.">
                <NestedDropdown ButtonProps={{ variant: 'outlined' }} menuItemsData={accountMenuData} />
            </SampleBox>
            <CodeBlock code={customLabelsCode} collapsable />

            <Section id="open-to-the-left" />
            <P>
                Set <Code>placement=&quot;left&quot;</Code> when the menu sits near the right edge of the
                screen (<IssueLink issue={33} />
                ). Submenus open to the left and the keyboard follows: the left arrow opens a submenu and the
                right arrow closes it.
            </P>
            <SampleBox hint="Open Settings, then hover Language and Español." justify="flex-end">
                <NestedDropdown
                    ButtonProps={{ variant: 'outlined' }}
                    MenuProps={alignRight}
                    menuItemsData={settingsMenuData}
                    placement="left"
                />
            </SampleBox>
            <CodeBlock code={openLeftCode} />

            <Section id="callbacks-on-parent-items" />
            <P>
                A <Code>callback</Code> on an item that has children fires when it&apos;s clicked, and the
                menu stays open so the submenu can be used (<IssueLink issue={34} />
                ). Items without children close the menu after their callback.
            </P>
            <SampleBox hint="Click Recent files, then one of the files.">
                <ParentCallbackDemo />
            </SampleBox>
            <CodeBlock code={parentCallbackCode} />

            <Section id="long-submenus" />
            <P>
                Long submenus scroll with the mouse wheel and trackpad (<IssueLink issue={2} />
                ). They are capped at the window height by default; set a <Code>maxHeight</Code> on the paper
                to make them shorter.
            </P>
            <SampleBox hint="Open Format, hover Font size and scroll the list.">
                <NestedDropdown
                    ButtonProps={{ variant: 'outlined' }}
                    SubmenuProps={scrollingPaper}
                    menuItemsData={longMenuData}
                />
            </SampleBox>
            <CodeBlock code={longMenuCode} />

            <Section id="testing-with-testing-library" />
            <P>
                Submenus open on hover, so in tests hover the parent item with <Code>user.hover</Code>, then{' '}
                <Code>user.click</Code> the item inside it (<IssueLink issue={66} />
                ). Submenus open asynchronously, so find the inner item with <Code>findBy…</Code>. These tests
                exercise the menu below.
            </P>
            <SampleBox hint="The menu the first test drives: File, then Export, then PDF.">
                <NestedDropdown ButtonProps={{ variant: 'outlined' }} menuItemsData={testMenuData} />
            </SampleBox>
            <CodeBlock code={testingCode} collapsable />
            <Callout>
                If <Code>user.click</Code> still complains about <Code>pointer-events: none</Code>, turn the
                check off: <Code>{'userEvent.setup({ pointerEventsCheck: 0 })'}</Code>. For keyboard tests,
                see <Link to={`/${PathNames.KEYBOARD_AND_TOUCH}`}>Keyboard and touch</Link>.
            </Callout>
        </Fragment>
    );
};
