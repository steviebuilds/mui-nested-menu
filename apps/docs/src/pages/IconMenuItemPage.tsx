import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import NewIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import ShareIcon from '@mui/icons-material/ShareOutlined';
import { Box, Button, Chip, Menu, Typography } from '@mui/material';
import { IconMenuItem } from 'mui-nested-menu';
import { FC, Fragment, MouseEvent, useState } from 'react';

import { CodeBlock } from '@/components/CodeBlock';
import { PageHeader } from '@/components/ImportSample';
import { PropsTable } from '@/components/PropsTable';
import { SampleBox } from '@/components/SampleBox';
import { Code, P, Subheading } from '@/components/StyledTypography';

const Shortcut: FC<{ keys: string }> = ({ keys }) => (
    <Typography color="text.secondary" component="span" sx={{ pl: 3, pr: 1 }} variant="body2">
        {keys}
    </Typography>
);

const IconMenuItemDemo: FC = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);

    const handleClose = () => setAnchorEl(null);

    return (
        <div>
            <Button endIcon={<ArrowDownIcon />} onClick={handleClick} variant="contained">
                File
            </Button>
            <Menu anchorEl={anchorEl} onClose={handleClose} open={open}>
                <IconMenuItem
                    label="New"
                    leftIcon={<NewIcon fontSize="small" />}
                    onClick={handleClose}
                    rightIcon={<Shortcut keys="⌘N" />}
                />
                <IconMenuItem
                    MenuItemProps={{ divider: true }}
                    label="Save"
                    leftIcon={<SaveIcon fontSize="small" />}
                    onClick={handleClose}
                    rightIcon={<Shortcut keys="⌘S" />}
                />
                <IconMenuItem
                    leftIcon={<ShareIcon fontSize="small" />}
                    onClick={handleClose}
                    renderLabel={() => (
                        <Box
                            component="span"
                            sx={{ alignItems: 'center', display: 'inline-flex', gap: 1, px: 1 }}
                        >
                            Share
                            <Chip color="primary" label="New" size="small" />
                        </Box>
                    )}
                />
                <IconMenuItem
                    MenuItemProps={{ 'aria-label': 'Delete file' }}
                    label="Delete"
                    leftIcon={<DeleteIcon fontSize="small" />}
                    onClick={handleClose}
                    sx={{ color: 'error.main' }}
                />
            </Menu>
        </div>
    );
};

const demoCode = `import { Box, Button, Chip, Menu, Typography } from '@mui/material';
import { IconMenuItem } from 'mui-nested-menu';
import { useState } from 'react';

const Shortcut = ({ keys }: { keys: string }) => (
  <Typography component="span" variant="body2" color="text.secondary" sx={{ pl: 3, pr: 1 }}>
    {keys}
  </Typography>
);

export function FileMenu() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);

  return (
    <div>
      <Button variant="contained" onClick={(event) => setAnchorEl(event.currentTarget)}>
        File
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <IconMenuItem
          label="New"
          leftIcon={<NewIcon fontSize="small" />}
          rightIcon={<Shortcut keys="⌘N" />}
          onClick={handleClose}
        />
        <IconMenuItem
          label="Save"
          leftIcon={<SaveIcon fontSize="small" />}
          rightIcon={<Shortcut keys="⌘S" />}
          MenuItemProps={{ divider: true }}
          onClick={handleClose}
        />
        <IconMenuItem
          leftIcon={<ShareIcon fontSize="small" />}
          renderLabel={() => (
            // px: 1 lines the custom label up with the plain ones
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 1 }}>
              Share <Chip label="New" size="small" color="primary" />
            </Box>
          )}
          onClick={handleClose}
        />
        <IconMenuItem
          label="Delete"
          leftIcon={<DeleteIcon fontSize="small" />}
          sx={{ color: 'error.main' }}
          MenuItemProps={{ 'aria-label': 'Delete file' }}
          onClick={handleClose}
        />
      </Menu>
    </div>
  );
}`;

export const IconMenuItemPage: FC = () => {
    return (
        <Fragment>
            <PageHeader
                description={
                    <Fragment>
                        A MUI <Code>MenuItem</Code> with optional icons on either side. The other components
                        use it for every item without a submenu, and you can use it in any MUI{' '}
                        <Code>{'<Menu>'}</Code>.
                    </Fragment>
                }
            />

            <SampleBox hint="Click File.">
                <IconMenuItemDemo />
            </SampleBox>
            <CodeBlock code={demoCode} collapsable />
            <P>
                <Code>rightIcon</Code> takes any element, here a keyboard shortcut, and sits at the far end.{' '}
                <Code>renderLabel</Code> replaces the text with any element; add <Code>px: 1</Code> to line it
                up with plain labels. <Code>MenuItemProps</Code> passes anything else to the underlying{' '}
                <Code>MenuItem</Code>, such as <Code>divider</Code>, ARIA attributes or{' '}
                <Code>data-testid</Code>.
            </P>

            <Subheading>Props</Subheading>
            <PropsTable
                rows={[
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
                        description: 'Icon after the label.',
                        name: 'rightIcon',
                        type: 'ReactNode',
                    },
                    {
                        description: 'Called when the item is clicked.',
                        name: 'onClick',
                        type: '(event: MouseEvent<HTMLElement>) => void',
                    },
                    {
                        default: 'false',
                        description: 'Disables the item.',
                        name: 'disabled',
                        type: 'boolean',
                    },
                    {
                        description: 'Styles for the item.',
                        name: 'sx',
                        type: 'SxProps',
                    },
                    {
                        description: 'Class for the item.',
                        name: 'className',
                        type: 'string',
                    },
                    {
                        description: (
                            <Fragment>
                                Any other props for the underlying MUI <Code>MenuItem</Code>. Its{' '}
                                <Code>sx</Code>, <Code>className</Code> and <Code>onClick</Code> are combined
                                with the props above.
                            </Fragment>
                        ),
                        name: 'MenuItemProps',
                        type: 'Partial<MenuItemProps>',
                    },
                    {
                        description: (
                            <Fragment>
                                Forwarded to the <Code>{'<li>'}</Code>.
                            </Fragment>
                        ),
                        name: 'ref',
                        type: 'Ref<HTMLLIElement>',
                    },
                ]}
            />
        </Fragment>
    );
};
