import { PathNames } from '@/core/configs/paths';

type PageInfo = { name: string };

const componentsRouteMap: Record<string, PageInfo> = {
    [PathNames.CONTEXT_MENU]: { name: 'ContextMenu' },
    [PathNames.EXAMPLES]: { name: 'Examples' },
    [PathNames.ICON_MENU_ITEM]: { name: 'IconMenuItem' },
    [PathNames.INSTALLATION]: { name: 'Installation' },
    [PathNames.KEYBOARD_AND_TOUCH]: { name: 'Keyboard and touch' },
    [PathNames.MENU_ITEMS_FROM_OBJECT]: { name: 'nestedMenuItemsFromObject' },
    [PathNames.NESTED_DROPDOWN]: { name: 'NestedDropdown' },
    [PathNames.NESTED_MENU_ITEM]: { name: 'NestedMenuItem' },
};

export const getPageFromRoute = (route: string): PageInfo | null => {
    const slug = route.replace(/^\/+|\/+$/g, '');

    return componentsRouteMap[slug] ?? null;
};
