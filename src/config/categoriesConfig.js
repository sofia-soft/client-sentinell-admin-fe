import {IconUser, IconUserCheck} from "@tabler/icons-react";

export const CATEGORIES_HEADER = [
    {key: "id", value: "ID"},
    {key: "name", value: "Name"},
    {key: "slug", value: "Slug"},
    {key: "parent_name", value: "Parent"},
    {key: "is_active", value: "Status"},
    {key: "dates", value: "Audit Dates"}
];

export const BUTTON_VISIBILITY = {
    search: {visible: true},
    // first_filter: {
    //     visible: true,
    //     title: "Name",
    //     values: ['user', 'admin', 'editor'],
    //     icon: IconUser
    // },
    // second_filter: {
    //     visible: true,
    //     title: "Status",
    //     values: ['active', 'inactive'],
    //     icon: IconUserCheck
    // },
    export: {
        visible: false,
        permission: {resource: 'reports', action: 'export'}

    },
    import: {
        visible: false,
        permission: {resource: 'data', action: 'import'}

    },
    create: {
        visible: true,
        permission: {resource: 'roles', action: 'create'}

    }
}