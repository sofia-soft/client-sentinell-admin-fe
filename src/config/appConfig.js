import {
    IconUsersGroup,
    IconUserScan,
    IconKey,
    IconAdjustmentsCog
} from '@tabler/icons-react';

export const MENU_ITEMS = [
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

]