import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ThemeMode } from 'common';
import { FC, useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Menu, MenuItem, Tooltip, Typography } from 'ui';

import { APP_BAR_HEIGHT } from '@/core/constants';
import { settingsContext } from '@/core/SettingsContext';

const titleCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const ActionsGroup = styled.div`
    display: flex;
`;

const AppBarContainer = styled.div`
    ${({ theme }) => css`
        align-items: center;
        background-color: ${theme.palette.mode === 'light'
            ? 'rgba(255, 255, 255, 0.8)'
            : 'rgba(9, 9, 11, 0.8)'};
        backdrop-filter: saturate(180%) blur(12px);
        border-bottom: 1px solid ${theme.palette.border1};
        display: flex;
        height: ${APP_BAR_HEIGHT}px;
        justify-content: space-between;
        max-height: ${APP_BAR_HEIGHT}px;
        min-height: ${APP_BAR_HEIGHT}px;
        padding: 0 1.5rem;
        position: fixed;
        transition: background-color 200ms ease, border-color 200ms ease;
        width: 100vw;
        z-index: ${theme.zIndex.navbar};
    `}
`;

const ThemeToggle = styled(Button)`
    ${({ theme }) => css`
        color: ${theme.palette.font3};
        font-size: 0.8125rem;
        padding: 6px 12px;

        &:hover {
            color: ${theme.palette.font1};
        }
    `}
`;

export const AppBar: FC = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const anchorElRef = useRef(null);
    const [settings, setSettings] = useContext(settingsContext);

    const toggleMenu = () => setOpen((prev) => !prev);

    const handleHomeClicked = () => navigate(`/`);

    const handleThemeChanged = (theme: ThemeMode) => () => setSettings({ ...settings, mode: theme });

    return (
        <AppBarContainer>
            <Tooltip direction="bottom" tip="Home">
                <Button onClick={handleHomeClicked} variant="text">
                    <Typography noMargin noPointer variant="h6">
                        MUI(v7) Nested Menu
                    </Typography>
                </Button>
            </Tooltip>
            <ActionsGroup>
                <Tooltip direction="bottom" tip="Theme">
                    <ThemeToggle onClick={toggleMenu} ref={anchorElRef} variant="text">
                        {titleCase(settings?.mode)}
                    </ThemeToggle>
                </Tooltip>
                <Menu
                    anchorElement={anchorElRef}
                    anchorOrigin={{
                        horizontal: 'right',
                        vertical: 'bottom',
                    }}
                    onClose={toggleMenu}
                    open={open}
                    transformOrigin={{
                        horizontal: 'right',
                        vertical: 'top',
                    }}
                >
                    <MenuItem label="Light" onClick={handleThemeChanged(ThemeMode.LIGHT)} />
                    <MenuItem label="Dark" onClick={handleThemeChanged(ThemeMode.DARK)} />
                    <MenuItem label="System" onClick={handleThemeChanged(ThemeMode.SYSTEM)} />
                </Menu>
            </ActionsGroup>
        </AppBarContainer>
    );
};
