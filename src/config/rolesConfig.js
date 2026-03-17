import {IconUser, IconUserCheck} from '@tabler/icons-react';

export const ROLES_HEADER = [
    {key: "id", value: "ID"},
    {key: "name", value: "Role Name"},
    {key: "description", value: "Description"},
    {key: "created_at", value: "Created At"},
    {key: "updated_at", value: "Updated At"},
    {key: "created_by", value: "Created By"},
    {key: "updated_by", value: "Updated By"},
    {key: "is_active", value: "Status"},
    {key: "is_system", value: "System"}
];

export const BUTTON_VISIBILITY = {
    search: {visible: true},
    first_filter: {
        visible: true,
        title: "Name",
        values: ['user', 'admin', 'editor'],
        icon: IconUser
    },
    second_filter: {
        visible: true,
        title: "Status",
        values: ['active', 'inactive'],
        icon: IconUserCheck
    },
    export: {
        visible: true,
        permission: {resource: 'reports', action: 'export'}

    },
    import: {
        visible: true,
        permission: {resource: 'data', action: 'import'}

    },
    create: {
        visible: true,
        permission: {resource: 'roles', action: 'create'}

    }

}


export const ROLES_DATA = [
    {
        name: "admin",
        description: "Full access to all system resources",
        created_at: "2026-01-01 09:00:00",
        updated_at: "2026-02-20 14:30:15",
        created_by: "System",
        updated_by: "Admin",
        is_active: 1,
        is_system: 1
    },
    {
        name: "editor",
        description: "Can manage content but cannot change settings",
        created_at: "2026-01-15 11:20:00",
        updated_at: "2026-02-23 10:15:00",
        created_by: "Super Admin",
        updated_by: "Super Admin",
        is_active: 1,
        is_system: 0
    },
    {
        name: "editor",
        description: "Read-only access to reports",
        created_at: "2026-02-01 16:45:00",
        updated_at: "2026-02-24 09:00:00",
        created_by: "Admin",
        updated_by: "Admin",
        is_active: 0,
        is_system: 0
    },
    {
        name: "admin",
        description: "Can manage tickets and user queries",
        created_at: "2026-02-10 08:30:00",
        updated_at: "2026-02-25 11:00:00",
        created_by: "Super Admin",
        updated_by: "Editor",
        is_active: 1,
        is_system: 0
    }
];
