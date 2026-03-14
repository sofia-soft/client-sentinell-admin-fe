import {IconUser, IconUserCheck} from '@tabler/icons-react';


export const BUTTON_VISIBILITY = {
    search: {visible: true},
    first_filter: {
        visible: true,
        title: "Role",
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
        permission: {resource: 'users', action: 'create'}
    }
}


export const USER_HEADER = [
    {key: "id", value: "ID"},
    {key: "username", value: 'Username'},
    {key: "role", value: 'Role'},
    {key: "created_at", value: 'Created at'},
    {key: "updated_at", value: 'Updated ad'},
    {key: "is_active", value: 'Status'}
]
