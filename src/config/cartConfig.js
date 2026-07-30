import {IconUser, IconUserCheck} from "@tabler/icons-react";

export const CART_HEADER = [
    {key: "id", value: "ID"},
    {key: "items", value: "Items"},
    {key: "total", value: "Total price"},
    {key: "item_count", value: "Item Count"},
    {key: "dates", value: "Audit Dates"}
];

export const BUTTON_VISIBILITY = {
    search: {visible: false},
    // first_filter: {
    //     visible: true,
    //     title: "Name",
    //     icon: IconUser
    // },
    // second_filter: {
    //     visible: true,
    //     title: "Status",
    //     icon: IconUserCheck
    // },
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