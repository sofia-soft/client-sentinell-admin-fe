import {
    IconUsersGroup,
    IconUserScan,
    IconKey,
    IconAdjustmentsCog
} from '@tabler/icons-react';

export const MENU_ITEMS = [
    {
        label: "Users", icon: IconUsersGroup, url: "/users"
    },
    {
        label: "Roles", icon: IconUserScan, url: "/roles"
    },
    {
        label: "Permissions", icon: IconKey, url: "/permissions"
    },
    {
        label: "Settings", icon: IconAdjustmentsCog, url: "/settings"
    }

]