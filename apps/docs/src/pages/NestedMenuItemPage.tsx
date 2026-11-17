import ContentCopyIcon from '@mui/icons-material/ContentCopyOutlined';
import ContentPasteIcon from '@mui/icons-material/ContentPasteOutlined';
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import ShareIcon from '@mui/icons-material/ShareOutlined';
import { Box, Button, Chip, Menu, MenuItem } from '@mui/material';
import { IconMenuItem, NestedMenuItem } from 'mui-nested-menu';
import { FC, Fragment, MouseEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { CodeBlock } from '@/components/CodeBlock';
import { PageHeader } from '@/components/ImportSample';
import { PropsTable } from '@/components/PropsTable';
import { SampleBox } from '@/components/SampleBox';
import { Code, P, Subheading } from '@/components/StyledTypography';
import { PathNames } from '@/core/configs/paths';

const useMenu = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    return {
        anchorEl,
        handleClick: (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget),
        handleClose: () => setAnchorEl(null),
        open: Boolean(anchorEl),
    };
};

const BasicDemo: FC = () => {
    const { anchorEl, handleClick, handleClose, open } = useMenu();

    return (
        <div>
            <Button endIcon={<ArrowDownIcon />} onClick={handleClick} variant="contained">
                Edit
            </Button>
            <Menu anchorEl={anchorEl} onClose={handleClose} open={open}>
                <IconMenuItem
                    label="Copy"
                    leftIcon={<ContentCopyIcon fontSize="small" />}
                    onClick={handleClose}
                />
                <NestedMenuItem
                    label="Paste special"
                    leftIcon={<ContentPasteIcon fontSize="small" />}
                    parentMenuOpen={open}
                >
                    <MenuItem onClick={handleClose}>Values only</MenuItem>
                    <MenuItem onClick={handleClose}>Formatting only</MenuItem>
                    <NestedMenuItem label="Transposed" parentMenuOpen={open}>
                        <MenuItem onClick={handleClose}>Rows</MenuItem>
                        <MenuItem onClick={handleClose}>Columns</MenuItem>
                    </NestedMenuItem>
                </NestedMenuItem>
                <NestedMenuItem delay={300} label="Share (300 ms delay)" parentMenuOpen={open}>
                    <MenuItem onClick={handleClose}>Copy link</MenuItem>
                    <MenuItem onClick={handleClose}>Email</MenuItem>
                </NestedMenuItem>
            </Menu>
        </div>
    );
};

const basicCode = `import { Button, Menu, MenuItem } from '@mui/material';
import { IconMenuItem, NestedMenuItem } from 'mui-nested-menu';
import { useState } from 'react';

export function EditMenu() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);

  return (
    <div>
      <Button variant="contained" onClick={(event) => setAnchorEl(event.currentTarget)}>
        Edit
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <IconMenuItem label="Copy" leftIcon={<ContentCopyIcon fontSize="small" />} onClick={handleClose} />
        <NestedMenuItem label="Paste special" leftIcon={<ContentPasteIcon fontSize="small" />} parentMenuOpen={open}>
          <MenuItem onClick={handleClose}>Values only</MenuItem>
          <MenuItem onClick={handleClose}>Formatting only</MenuItem>
          <NestedMenuItem label="Transposed" parentMenuOpen={open}>
            <MenuItem onClick={handleClose}>Rows</MenuItem>
            <MenuItem onClick={handleClose}>Columns</MenuItem>
          </NestedMenuItem>
        </NestedMenuItem>
        <NestedMenuItem label="Share (300 ms delay)" delay={300} parentMenuOpen={open}>
          <MenuItem onClick={handleClose}>Copy link</MenuItem>
          <MenuItem onClick={handleClose}>Email</MenuItem>
        </NestedMenuItem>
      </Menu>
    </div>
  );
}`;

const StyledDemo: FC = () => {
    const { anchorEl, handleClick, handleClose, open } = useMenu();

    return (
        <div>
            <Button onClick={handleClick} variant="outlined">
                Share
            </Button>
            <Menu anchorEl={anchorEl} onClose={handleClose} open={open}>
                <NestedMenuItem
                    MenuProps={{
                        className: 'share-submenu',
                        slotProps: {
                            paper: { sx: { borderTop: 3, borderTopColor: 'primary.main', minWidth: 200 } },
                        },
                    }}
                    label="Share to"
                    leftIcon={<ShareIcon fontSize="small" />}
                    parentMenuOpen={open}
                    placement="left"
                >
                    <MenuItem onClick={handleClose}>Copy link</MenuItem>
                    <MenuItem onClick={handleClose}>Email</MenuItem>
                </NestedMenuItem>
                <NestedMenuItem
                    parentMenuOpen={open}
                    placement="left"
                    renderLabel={() => (
                        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, px: 1 }}>
                            Team
                            <Chip color="primary" label="3" size="small" />
                        </Box>
                    )}
                >
                    <MenuItem onClick={handleClose}>Ana</MenuItem>
                    <MenuItem onClick={handleClose}>Ben</MenuItem>
                    <MenuItem onClick={handleClose}>Chi</MenuItem>
                </NestedMenuItem>
            </Menu>
        </div>
    );
};

const styledCode = `<Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
  <NestedMenuItem
    label="Share to"
    leftIcon={<ShareIcon fontSize="small" />}
    parentMenuOpen={open}
    placement="left"
    MenuProps={{
      className: 'share-submenu', // on the submenu, not the row
      slotProps: { paper: { sx: { borderTop: 3, borderTopColor: 'primary.main', minWidth: 200 } } },
    }}
  >
    <MenuItem onClick={handleClose}>Copy link</MenuItem>
    <MenuItem onClick={handleClose}>Email</MenuItem>
  </NestedMenuItem>
  <NestedMenuItem
    parentMenuOpen={open}
    placement="left"
    renderLabel={() => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
        Team <Chip label="3" size="small" color="primary" />
      </Box>
    )}
  >
    <MenuItem onClick={handleClose}>Ana</MenuItem>
    <MenuItem onClick={handleClose}>Ben</MenuItem>
    <MenuItem onClick={handleClose}>Chi</MenuItem>
  </NestedMenuItem>
</Menu>`;

export const NestedMenuItemPage: FC = () => {
    return (
        <Fragment>
            <PageHeader
                description={
                    <Fragment>
                        A menu item that opens a submenu. Use it inside your own MUI <Code>{'<Menu>'}</Code>{' '}
                        when you want full control over the items; nest it as deep as you like.
                    </Fragment>
                }
            />

            <SampleBox hint="Click Edit, then hover Paste special or Share.">
                <BasicDemo />
            </SampleBox>
            <CodeBlock code={basicCode} collapsable />
            <P>
                Children can be MUI <Code>MenuItem</Code>s, <Code>IconMenuItem</Code>s or more{' '}
                <Code>NestedMenuItem</Code>s. Pass every <Code>NestedMenuItem</Code> the <Code>open</Code> of
                the root <Code>Menu</Code> as <Code>parentMenuOpen</Code>, so its submenu closes with the
                menu. A click on a parent item opens its submenu and never closes the whole menu.
            </P>

            <Subheading>Styling, placement and custom labels</Subheading>
            <P>
                The submenu renders in a portal, so a <Code>className</Code> on the item can&apos;t reach it.
                Put classes and styles on the submenu through <Code>MenuProps</Code>; since 4.1 your{' '}
                <Code>style</Code>, <Code>sx</Code>, <Code>className</Code> and <Code>slotProps.paper</Code>{' '}
                no longer break hover. <Code>renderLabel</Code> replaces the text with any element.
            </P>
            <SampleBox hint="Click Share: both submenus open to the left." justify="flex-end">
                <StyledDemo />
            </SampleBox>
            <CodeBlock code={styledCode} />
            <P>
                More in <Link to={`/${PathNames.EXAMPLES}#styling-submenus`}>Styling submenus</Link> and{' '}
                <Link to={`/${PathNames.EXAMPLES}#custom-labels`}>Custom labels</Link>.
            </P>

            <Subheading>Props</Subheading>
            <PropsTable
                rows={[
                    {
                        description: (
                            <Fragment>
                                Whether the menu this item sits in is open. Pass the root <Code>Menu</Code>
                                &apos;s <Code>open</Code>.
                            </Fragment>
                        ),
                        name: 'parentMenuOpen',
                        required: true,
                        type: 'boolean',
                    },
                    {
                        description: "The item's text.",
                        name: 'label',
                        type: 'string',
                    },
                    {
                        description: (
                            <Fragment>
                                Custom label, used instead of <Code>label</Code>.
                            </Fragment>
                        ),
                        name: 'renderLabel',
                        type: '() => ReactNode',
                    },
                    {
                        description: 'Icon before the label.',
                        name: 'leftIcon',
                        type: 'ReactNode',
                    },
                    {
                        default: 'chevron',
                        description:
                            'Icon after the label. Defaults to a chevron pointing towards the submenu.',
                        name: 'rightIcon',
                        type: 'ReactNode',
                    },
                    {
                        description: (
                            <Fragment>
                                The submenu&apos;s items (<Code>MenuItem</Code>, <Code>IconMenuItem</Code> or
                                more <Code>NestedMenuItem</Code>s).
                            </Fragment>
                        ),
                        name: 'children',
                        type: 'ReactNode',
                    },
                    {
                        default: "'right'",
                        description: 'Which side the submenu opens on. The arrow keys follow it.',
                        name: 'placement',
                        since: '4.1',
                        type: "'right' | 'left'",
                    },
                    {
                        default: '0',
                        description: 'Milliseconds to wait on hover before the submenu opens.',
                        name: 'delay',
                        type: 'number',
                    },
                    {
                        description: (
                            <Fragment>
                                Props for the submenu&apos;s MUI <Code>Menu</Code>: <Code>className</Code>,{' '}
                                <Code>sx</Code>, <Code>slotProps</Code>, <Code>hideBackdrop</Code>… Since 4.1
                                your styles are merged with the submenu&apos;s own, so hover keeps working.
                            </Fragment>
                        ),
                        name: 'MenuProps',
                        type: 'Partial<MenuProps>',
                    },
                    {
                        description: (
                            <Fragment>
                                Props for the <Code>{'<div>'}</Code> that wraps the item and its submenu.
                            </Fragment>
                        ),
                        name: 'ContainerProps',
                        type: 'HTMLAttributes<HTMLElement>',
                    },
                    {
                        default: 'false',
                        description: 'Disables the item and its submenu.',
                        name: 'disabled',
                        type: 'boolean',
                    },
                    {
                        description: (
                            <Fragment>
                                Class for the item row. To style the submenu, use <Code>MenuProps</Code>.
                            </Fragment>
                        ),
                        name: 'className',
                        type: 'string',
                    },
                ]}
            />
            <P>
                Any other MUI <Code>MenuItem</Code> prop (<Code>onClick</Code>, <Code>sx</Code>,{' '}
                <Code>data-*</Code>…) goes to the item. The item has{' '}
                <Code>aria-haspopup=&quot;menu&quot;</Code> and <Code>aria-expanded</Code>; see{' '}
                <Link to={`/${PathNames.KEYBOARD_AND_TOUCH}`}>Keyboard and touch</Link> for how it responds to
                keys and taps.
            </P>
        </Fragment>
    );
};
