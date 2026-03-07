import {IconUser, IconUserCheck} from '@tabler/icons-react';

export const USER_DATA = [
    {username: "test", role: "admin", create_at: '2026-01-31 13:05:58', update_at: '2026-02-23 21:51:31', is_active: 1},
    {
        username: "test1",
        role: "admin",
        create_at: '2026-01-31 20:23:03',
        update_at: '2026-02-23 21:51:40',
        is_active: 0
    },
    {username: "test2", role: "user", create_at: '2026-01-31 20:56:15', update_at: '2026-02-23 21:51:40', is_active: 0},
    {
        username: "test3",
        role: "editor",
        create_at: '2026-02-16 08:47:11',
        update_at: '2026-02-23 21:51:40',
        is_active: 1
    },
    {username: "test4", role: "user", create_at: '2026-02-17 09:53:47', update_at: '2026-02-23 21:51:40', is_active: 1},
];

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
    export: {visible: true},
    import: {visible: true},
    create: {visible: true}

}


export const USER_HEADER = [
    {key: "id", value: "ID"},
    {key: "username", value: 'Username'},
    {key: "role", value: 'Role'},
    {key: "create_at", value: 'Created at'},
    {key: "update_at", value: 'Updated ad'},
    {key: "is_active", value: 'Status'}
]
