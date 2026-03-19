import {IconUser, IconUserCheck} from "@tabler/icons-react";

export const PRODUCTS_HEADER = [
    {key: "id", value: "ID"},
    {key: "name", value: "Product Name"},
    {key: "slug", value: "Slug"},
    {key: "description", value: "Description"},
    {key: "price", value: "Price"},
    {key: "stock_quantity", value: "Stock Quantity"},
    {key: "is_active", value: "Status"},
    {key: "created_at", value: "Created At"},
    {key: "updated_at", value: "Updated At"},
    {key: "created_by", value: "Created By"},
    {key: "updated_by", value: "Updated By"}
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