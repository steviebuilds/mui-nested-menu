import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { FC, ReactNode } from 'react';
import { Outlet } from 'react-router';
import { Row, Scrollable } from 'ui';

import { APP_BAR_HEIGHT, MENU_PANEL_WIDTH } from '@/core/constants';

const AppLayoutContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
`;

const PanelContainer = styled.div`
    ${() => css`
        align-items: center;
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow-y: auto;
        overflow-x: hidden;
        padding-top: ${APP_BAR_HEIGHT}px;
        width: ${MENU_PANEL_WIDTH}px;
        min-width: ${MENU_PANEL_WIDTH}px;
    `}
`;

const ContentContainer = styled.div`
    ${({ theme }) => css`
        background-color: ${theme.palette.bg1};
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 100vh;
        overflow-y: auto;
        overflow-x: hidden;
        padding-top: ${APP_BAR_HEIGHT}px;
        transition: background-color 200ms ease;
    `}
`;

const ContentInner = styled.div`
    ${({ theme }) => css`
        max-width: 768px;
        padding: calc(${theme.sizes.padding} * 10);
        width: 100%;
    `}
`;

type AppLayoutWithNavBarProps = {
    appbar: ReactNode;
    panelContent: ReactNode;
};

export const AppLayoutWithNavBar: FC<AppLayoutWithNavBarProps> = ({ appbar, panelContent }) => (
    <AppLayoutContainer>
        {appbar}
        <Row>
            <PanelContainer>{panelContent}</PanelContainer>
            <ContentContainer>
                <Scrollable>
                    <ContentInner>
                        <Outlet />
                    </ContentInner>
                </Scrollable>
            </ContentContainer>
        </Row>
    </AppLayoutContainer>
);
