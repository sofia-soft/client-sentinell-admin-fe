import { IconUser, IconUserCheck } from '@tabler/icons-react';


export const PERMISSIONS_HEADER = [
    {key: "id", value: "ID"},
    {key: "resource", value: "Resource"},
    {key: "action", value: "Action"},
    {key: "description", value: "Description"},
    {key: "created_at", value: "Created At"},
    {key: "created_by", value: "Created By"},
    {key: "updated_by", value: "Updated By"},
    {key: "is_system", value: "System"},
];

export const BUTTON_VISIBILITY = {
    search: {visible: true},
    first_filter: {
        visible: true,
        title: "Resource",
        values: ['user', 'admin', 'editor'],
        icon: IconUser
    },
    second_filter: {
        visible: true,
        title: "System",
        values: ['yes', 'no'],
        icon: IconUserCheck
    },
    export: {
        visible: true,
        permission: { resource: 'reports', action: 'export' }
    },
    import: {
        visible: true,
        permission: { resource: 'data', action: 'import' }},
    create: {
        visible: true,
        permission: { resource: 'permissions', action: 'create' }
    }

}

export const PERMISSIONS_DATA = [
    {
        resource: "users",
        action: "create",
        description: "Allows creating new users",
        created_at: "2026-01-05 10:00:00",
        created_by: "System",
        updated_by: "System",
        is_system: 1,
    },
    {
        resource: "users",
        action: "delete",
        description: "Allows deleting user accounts",
        created_at: "2026-01-05 10:05:00",
        created_by: "System",
        updated_by: "System",
        is_system: 1,
    },
    {
        resource: "reports",
        action: "export",
        description: "Allows exporting data to CSV/Excel",
        created_at: "2026-02-12 14:20:00",
        created_by: "Admin",
        updated_by: "Admin",
        is_system: 0,
    },
    {
        resource: "settings",
        action: "update",
        description: "Modify core system configurations",
        created_at: "2026-01-10 12:00:00",
        created_by: "System",
        updated_by: "Admin",
        is_system: 1,
    },
    {
        resource: "billing",
        action: "view",
        description: "View invoices and payments",
        created_at: "2026-02-20 15:00:00",
        created_by: "Super Admin",
        updated_by: "Super Admin",
        is_system: 0,
    }
];