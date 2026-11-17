import ImportExportRoundedIcon from '@mui/icons-material/ImportExportRounded';
import NewIcon from '@mui/icons-material/InsertDriveFileOutlined';
import SaveAsIcon from '@mui/icons-material/SaveOutlined';
import SaveIcon from '@mui/icons-material/SaveRounded';
import { MenuItemData, NestedDropdown } from 'mui-nested-menu';
import { FC, Fragment, MouseEvent } from 'react';
import { Link } from 'react-router-dom';

import { CodeBlock } from '@/components/CodeBlock';
import { PageHeader } from '@/components/ImportSample';
import { PropsTable } from '@/components/PropsTable';
import { SampleBox } from '@/components/SampleBox';
import { Code, P, Subheading } from '@/components/StyledTypography';
import { PathNames } from '@/core/configs/paths';

const menuItemsData: MenuItemData = {
    items: [
        {
            callback: (event: MouseEvent<HTMLElement>, item: MenuItemData) =>
                console.log('New clicked', event, item),
            label: 'New',
            leftIcon: <NewIcon />,
        },
        {
            callback: (event: MouseEvent<HTMLElement>, item: MenuItemData) =>
                console.log('Save clicked', event, item),
            label: 'Save',
            leftIcon: <SaveIcon />,
        },
        {
            delay: 300,
            items: [
                {
                    callback: (event: MouseEvent<HTMLElement>, item: MenuItemData) =>
                        console.log('Save As > Option 1 clicked', event, item),
                    label: 'Option 1',
                    rightIcon: <SaveAsIcon />,
                },
                {
                    callback: (event: MouseEvent<HTMLElement>, item: MenuItemData) =>
                        console.log('Save As > Option 2 clicked', event, item),
                    disabled: true,
                    label: 'Option 2 (disabled)',
                    leftIcon: <SaveAsIcon />,
                },
            ],
            label: 'Save As (300 ms delay)',
            leftIcon: <SaveAsIcon />,
        },
        {
            items: [
                {
                    items: [
                        {
                            callback: (event: MouseEvent<HTMLElement>, item: MenuItemData) =>
                                console.log('Export > File Type 1 > Option 1 clicked', event, item),
                            label: 'Option 1',
                            rightIcon: <SaveAsIcon />,
                            sx: { color: 'error.main' },
                        },
                        {
                            callback: (event: MouseEvent<HTMLElement>, item: MenuItemData) =>
                                console.log('Export > File Type 1 > Option 2 clicked', event, item),
                            label: 'Option 2',
                            leftIcon: <SaveAsIcon />,
                        },
                    ],
                    label: 'File Type 1',
                },
                {
                    callback: (event: MouseEvent<HTMLElement>, item: MenuItemData) =>
                        console.log('Export > File Type 2 clicked', event, item),
                    label: 'File Type 2',
                },
            ],
            label: 'Export',
            leftIcon: <ImportExportRoundedIcon />,
            rightIcon: <ImportExportRoundedIcon />,
        },
    ],
    label: 'File',
};

const menuItemsDataCode = `const menuItemsData: MenuItemData = {
  label: 'File',
  items: [
    {
      label: 'New',
      leftIcon: <NewIcon />,
      callback: (event, item) => console.log('New clicked', event, item),
    },
    {
      label: 'Save',
      leftIcon: <SaveIcon />,
      callback: (event, item) => console.log('Save clicked', event, item),
    },
    {
      label: 'Save As (300 ms delay)',
      leftIcon: <SaveAsIcon />,
      delay: 300,
      items: [
        {
          label: 'Option 1',
          rightIcon: <SaveAsIcon />,
          callback: (event, item) => console.log('Save As > Option 1 clicked', event, item),
        },
        {
          label: 'Option 2 (disabled)',
          leftIcon: <SaveAsIcon />,
          disabled: true,
          callback: (event, item) => console.log('Save As > Option 2 clicked', event, item),
        },
      ],
    },
    {
      label: 'Export',
      leftIcon: <ImportExportRoundedIcon />,
      rightIcon: <ImportExportRoundedIcon />,
      items: [
        {
          label: 'File Type 1',
          items: [
            {
              label: 'Option 1',
              rightIcon: <SaveAsIcon />,
              sx: { color: 'error.main' },
              callback: (event, item) => console.log('Export > File Type 1 > Option 1 clicked', event, item),
            },
            {
              label: 'Option 2',
              leftIcon: <SaveAsIcon />,
              callback: (event, item) => console.log('Export > File Type 1 > Option 2 clicked', event, item),
            },
          ],
        },
        {
          label: 'File Type 2',
          callback: (event, item) => console.log('Export > File Type 2 clicked', event, item),
        },
      ],
    },
  ],
};`;

const submenuStyle = {
    slotProps: { paper: { sx: { borderRadius: 2, minWidth: 180 } } },
};

export const NestedDropdownPage: FC = () => {
    return (
        <Fragment>
            <PageHeader description="A button that opens a nested menu. Describe the menu as data and pass it in; nest it as deep as you like." />

            <SampleBox hint="Click File, then hover Save As or Export. Clicks are logged to the console.">
                <NestedDropdown
                    ButtonProps={{ variant: 'outlined' }}
                    MenuProps={{ elevation: 3 }}
                    menuItemsData={menuItemsData}
                    onClick={() => console.log('Button clicked')}
                />
            </SampleBox>
            <CodeBlock
                code={`<NestedDropdown
  menuItemsData={menuItemsData}
  MenuProps={{ elevation: 3 }}
  ButtonProps={{ variant: 'outlined' }}
  onClick={() => console.log('Button clicked')}
/>`}
            />

            <Subheading>Data structure</Subheading>
            <P>
                The root object&apos;s <Code>label</Code> (or <Code>renderLabel</Code>) is the button&apos;s
                text, and its <Code>items</Code> are the menu. Every field is described under{' '}
                <Link to={`/${PathNames.MENU_ITEMS_FROM_OBJECT}#menu-item-data`}>MenuItemData</Link>.
            </P>
            <CodeBlock code={menuItemsDataCode} collapsable />

            <Subheading>Submenu props and placement</Subheading>
            <P>
                <Code>MenuProps</Code> styles the root menu only. Use <Code>SubmenuProps</Code> for every
                submenu at every depth, and <Code>placement=&quot;left&quot;</Code> when the button sits near
                the right edge of the screen.
            </P>
            <SampleBox hint="Submenus open to the left and share the same rounded paper." justify="flex-end">
                <NestedDropdown
                    ButtonProps={{ variant: 'contained' }}
                    MenuProps={submenuStyle}
                    SubmenuProps={submenuStyle}
                    menuItemsData={menuItemsData}
                    placement="left"
                />
            </SampleBox>
            <CodeBlock
                code={`const paperStyle = {
  slotProps: { paper: { sx: { borderRadius: 2, minWidth: 180 } } },
};

<NestedDropdown
  menuItemsData={menuItemsData}
  placement="left"
  MenuProps={paperStyle}      // root menu
  SubmenuProps={paperStyle}   // every submenu, at every depth
  ButtonProps={{ variant: 'contained' }}
/>`}
            />

            <Subheading>Props</Subheading>
            <PropsTable
                rows={[
                    {
                        description: (
                            <Fragment>
                                The menu. The root&apos;s <Code>label</Code> or <Code>renderLabel</Code> is
                                the button label (default &quot;Menu&quot;); its <Code>items</Code> are the
                                menu items.
                            </Fragment>
                        ),
                        name: 'menuItemsData',
                        type: 'MenuItemData',
                    },
                    {
                        description: 'Called when the button is clicked, as the menu opens.',
                        name: 'onClick',
                        type: '(event: MouseEvent<HTMLButtonElement>) => void',
                    },
                    {
                        description: (
                            <Fragment>
                                Props for the MUI <Code>Button</Code>, e.g. <Code>variant</Code>,{' '}
                                <Code>color</Code> or <Code>startIcon</Code>.
                            </Fragment>
                        ),
                        name: 'ButtonProps',
                        type: 'Partial<ButtonProps>',
                    },
                    {
                        description: (
                            <Fragment>
                                Props for the root MUI <Code>Menu</Code> only.
                            </Fragment>
                        ),
                        name: 'MenuProps',
                        type: 'Partial<MenuProps>',
                    },
                    {
                        description: (
                            <Fragment>
                                Props for every submenu&apos;s MUI <Code>Menu</Code>, at every depth (
                                <Code>sx</Code>, <Code>className</Code>, <Code>slotProps</Code>,{' '}
                                <Code>hideBackdrop</Code>…).
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
