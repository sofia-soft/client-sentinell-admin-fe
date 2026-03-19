import {
    IconUsersGroup,
    IconUserScan,
    IconKey,
    IconAdjustmentsCog,
    IconShoppingCart,
    IconCategory,
    IconChecklist,
    IconPackage,
    IconShoppingCartHeart,
    IconUserSquareRounded, IconDeviceDesktopCog
} from '@tabler/icons-react';

export const SYSTEM_MENU_ITEMS = [
    {
        label: "Users",
        icon: IconUsersGroup,
        url: "/users",
        resource: 'users',
        action: 'view'
    },
    {
        label: "Roles",
        icon: IconUserScan,
        url: "/roles",
        resource: 'roles',
        action: 'view'
    },
    {
        label: "Permissions",
        icon: IconKey,
        url: "/permissions",
        resource: 'permissions',
        action: 'view'
    },
    {
        label: "Settings",
        icon: IconAdjustmentsCog,
        url: "/settings",
        resource: 'settings',
        action: 'view'
    }

];

export const SITE_MENU_ITEMS = [
    {
        label: "Customers",
        icon: IconUserSquareRounded,
        url: "/customers",
        resource: 'customers',
        action: 'view'
    },
    {
        label: "Categories",
        icon: IconCategory,
        url: "/categories",
        resource: 'categories',
        action: 'view'
    },
    {
        label: "Products",
        icon: IconPackage ,
        url: "/products",
        resource: 'products',
        action: 'view'
    },
    {
        label: "Reviews",
        icon: IconShoppingCartHeart ,
        url: "/reviews",
        resource: 'product.reviews',
        action: 'view'
    },
    {
        label: "Carts",
        icon: IconShoppingCart,
        url: "/cart",
        resource: 'cart',
        action: 'view'
    },
    {
        label: "Orders",
        icon: IconChecklist,
        url: "/orders",
        resource: 'orders',
        action: 'view'
    },
    {
        label: "Settings",
        icon: IconDeviceDesktopCog,
        url: "/site/settings",
        resource: 'settings',
        action: 'view'
    }

];