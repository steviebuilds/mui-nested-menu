import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { FC, ReactNode, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
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
        margin: 0 auto;
        max-width: 860px;
        padding: calc(${theme.sizes.padding} * 10) calc(${theme.sizes.padding} * 12)
            calc(${theme.sizes.padding} * 24);
        width: 100%;
    `}
`;

type AppLayoutWithNavBarProps = {
    appbar: ReactNode;
    panelContent: ReactNode;
};

export const AppLayoutWithNavBar: FC<AppLayoutWithNavBarProps> = ({ appbar, panelContent }) => {
    const location = useLocation();
    const contentRef = useRef<HTMLDivElement>(null);

    // Start each page at the top, or at the section named in the URL hash.
    useEffect(() => {
        const target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;

        if (target) {
            target.scrollIntoView();

            return;
        }

        contentRef.current?.scrollTo({ top: 0 });
    }, [location.pathname, location.hash]);

    return (
        <AppLayoutContainer>
            {appbar}
            <Row>
                <PanelContainer>{panelContent}</PanelContainer>
                <ContentContainer ref={contentRef}>
                    <Scrollable>
                        <ContentInner>
                            <Outlet />
                        </ContentInner>
                    </Scrollable>
                </ContentContainer>
            </Row>
        </AppLayoutContainer>
    );
};
