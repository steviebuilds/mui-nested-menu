import { FC, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { AppBar } from '@/components/AppBar';
import { NavigationPanel } from '@/components/NavigationPanel';
import { PathNames } from '@/core/configs/paths';
import { AppBaseContainer } from '@/core/layouts/AppBaseContainer';
import { AppLayoutWithNavBar } from '@/core/layouts/AppLayoutWithNavBar';
import { getPageFromRoute } from '@/core/routes/routeMap';
import { ContextMenuPage } from '@/pages/ContextMenuPage';
import { ExamplesPage } from '@/pages/ExamplesPage';
import { IconMenuItemPage } from '@/pages/IconMenuItemPage';
import { InstallationPage } from '@/pages/InstallationPage';
import { KeyboardAndTouchPage } from '@/pages/KeyboardAndTouchPage';
import { MenuItemsFromObjectPage } from '@/pages/MenuItemsFromObjectPage';
import { NestedDropdownPage } from '@/pages/NestedDropdownPage';
import { NestedMenuItemPage } from '@/pages/NestedMenuItemPage';

const siteRoutes = (
    <Route element={<AppBaseContainer />}>
        <Route
            element={<AppLayoutWithNavBar appbar={<AppBar />} panelContent={<NavigationPanel />} />}
            path="/"
        >
            <Route element={<ContextMenuPage />} path={PathNames.CONTEXT_MENU} />
            <Route element={<ExamplesPage />} path={PathNames.EXAMPLES} />
            <Route element={<IconMenuItemPage />} path={PathNames.ICON_MENU_ITEM} />
            <Route element={<InstallationPage />} path={PathNames.INSTALLATION} />
            <Route element={<KeyboardAndTouchPage />} path={PathNames.KEYBOARD_AND_TOUCH} />
            <Route element={<MenuItemsFromObjectPage />} path={PathNames.MENU_ITEMS_FROM_OBJECT} />
            <Route element={<NestedDropdownPage />} path={PathNames.NESTED_DROPDOWN} />
            <Route element={<NestedMenuItemPage />} path={PathNames.NESTED_MENU_ITEM} />
        </Route>
        <Route element={<Navigate to={PathNames.INSTALLATION} />} index />
        <Route element={<Navigate to={PathNames.INSTALLATION} />} path="*" />
    </Route>
);

const usePageTitle = () => {
    const location = useLocation();

    useEffect(() => {
        const page = getPageFromRoute(location.pathname);
        document.title = page ? `${page.name} · MUI Nested Menu` : 'MUI Nested Menu';
    }, [location.pathname]);
};

export const SiteRouter: FC = () => {
    usePageTitle();

    return <Routes>{siteRoutes}</Routes>;
};
