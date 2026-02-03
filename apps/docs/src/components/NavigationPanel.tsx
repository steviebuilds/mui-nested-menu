import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Column, Space } from 'ui';

import { PathNames } from '@/core/configs/paths';

const PanelContainer = styled(Column)`
    ${({ theme }) => css`
        background-color: ${theme.palette.bg2};
        border-right: 1px solid ${theme.palette.border1};
        height: 100%;
        padding: 20px 12px;
        width: 100%;
    `}
`;

const NavSectionLabel = styled.span`
    ${({ theme }) => css`
        color: ${theme.palette.font3};
        font-family: ${theme.typeography.family};
        font-size: 0.6875rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        padding: 4px 12px;
        text-transform: uppercase;
    `}
`;

const NavItem = styled.button<{ isActive: boolean }>`
    ${({ theme, isActive }) => css`
        align-items: center;
        appearance: none;
        background-color: ${isActive ? theme.palette.bg3 : 'transparent'};
        border: none;
        border-radius: ${theme.sizes.borderRadiusMedium};
        color: ${isActive ? theme.palette.font1 : theme.palette.font3};
        cursor: pointer;
        display: flex;
        font-family: ${theme.typeography.family};
        font-size: 0.875rem;
        font-weight: ${isActive ? 500 : 400};
        justify-content: flex-start;
        line-height: 1.5;
        padding: 8px 12px;
        text-align: left;
        transition: background-color 150ms ease, color 150ms ease;
        width: 100%;

        &:hover {
            background-color: ${theme.palette.bg3};
            color: ${theme.palette.font1};
        }
    `}
`;

type NavigateButtonProps = {
    label: string;
    path: (typeof PathNames)[keyof typeof PathNames];
};

const MenuNavigateButton: FC<NavigateButtonProps> = ({ label, path }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = () => navigate(path);

    const isCurrentPath = location.pathname.includes(path);

    return (
        <NavItem isActive={isCurrentPath} onClick={handleNavigation}>
            {label}
        </NavItem>
    );
};

export const NavigationPanel: FC = () => {
    return (
        <PanelContainer gap="2px">
            <Space size="8px" vertical />
            <MenuNavigateButton label="Installation" path={PathNames.INSTALLATION} />
            <Space size="16px" vertical />
            <NavSectionLabel>Components</NavSectionLabel>
            <Space size="4px" vertical />
            <MenuNavigateButton label="ContextMenu" path={PathNames.CONTEXT_MENU} />
            <MenuNavigateButton label="NestedDropdown" path={PathNames.NESTED_DROPDOWN} />
            <MenuNavigateButton label="NestedMenuItem" path={PathNames.NESTED_MENU_ITEM} />
            <MenuNavigateButton label="IconMenuItem" path={PathNames.ICON_MENU_ITEM} />
        </PanelContainer>
    );
};
