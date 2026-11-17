import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { FC, Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { SponsorCard } from '@/components/SponsorCard';
import { PathNames } from '@/core/configs/paths';

const PanelContainer = styled.nav`
    ${({ theme }) => css`
        background-color: ${theme.palette.bg2};
        border-right: 1px solid ${theme.palette.border1};
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex: 1 0 auto;
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
        padding: 20px 12px 6px;
        text-transform: uppercase;

        &:first-of-type {
            padding-top: 4px;
        }
    `}
`;

const NavItem = styled(Link, { shouldForwardProp: (prop) => prop !== 'isActive' })<{ isActive: boolean }>`
    ${({ theme, isActive }) => css`
        background-color: ${isActive ? theme.palette.bg3 : 'transparent'};
        border-radius: ${theme.sizes.borderRadiusMedium};
        color: ${isActive ? theme.palette.font1 : theme.palette.font3};
        display: block;
        font-family: ${theme.typeography.family};
        font-size: 0.875rem;
        font-weight: ${isActive ? 500 : 400};
        line-height: 1.5;
        padding: 6px 12px;
        text-decoration: none;
        transition:
            background-color 150ms ease,
            color 150ms ease;
        width: 100%;

        &:hover {
            background-color: ${theme.palette.bg3};
            color: ${theme.palette.font1};
        }

        &:focus-visible {
            outline: 2px solid ${theme.palette.brand1};
            outline-offset: -2px;
        }
    `}
`;

const SponsorSlot = styled.div`
    margin-top: auto;
    padding-top: 24px;
`;

type NavLinkInfo = {
    label: string;
    path: (typeof PathNames)[keyof typeof PathNames];
};

const sections: { title: string; links: NavLinkInfo[] }[] = [
    {
        links: [
            { label: 'Installation', path: PathNames.INSTALLATION },
            { label: 'Examples', path: PathNames.EXAMPLES },
            { label: 'Keyboard and touch', path: PathNames.KEYBOARD_AND_TOUCH },
        ],
        title: 'Getting started',
    },
    {
        links: [
            { label: 'NestedDropdown', path: PathNames.NESTED_DROPDOWN },
            { label: 'ContextMenu', path: PathNames.CONTEXT_MENU },
            { label: 'NestedMenuItem', path: PathNames.NESTED_MENU_ITEM },
            { label: 'IconMenuItem', path: PathNames.ICON_MENU_ITEM },
        ],
        title: 'Components',
    },
    {
        links: [{ label: 'nestedMenuItemsFromObject', path: PathNames.MENU_ITEMS_FROM_OBJECT }],
        title: 'Data',
    },
];

export const NavigationPanel: FC = () => {
    const location = useLocation();
    const currentSlug = location.pathname.replace(/^\/+|\/+$/g, '');

    return (
        <PanelContainer aria-label="Documentation">
            {sections.map((section) => (
                <Fragment key={section.title}>
                    <NavSectionLabel>{section.title}</NavSectionLabel>
                    {section.links.map((link) => (
                        <NavItem
                            aria-current={currentSlug === link.path ? 'page' : undefined}
                            isActive={currentSlug === link.path}
                            key={link.path}
                            to={`/${link.path}`}
                        >
                            {link.label}
                        </NavItem>
                    ))}
                </Fragment>
            ))}
            <SponsorSlot>
                <SponsorCard />
            </SponsorSlot>
        </PanelContainer>
    );
};
