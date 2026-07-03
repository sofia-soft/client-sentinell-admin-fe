export const ORDER_HEADER = [
    {key: "id", value: "ID"},
    {key: "tracking_number", value: "Tracking Number"},
    {key: "customer", value: "Customer"},
    {key: "items", value: "Items"},
    {key: "status", value: "Status"},
    {key: "shipping_address", value: "Shipping Address"},
    {key: "speedy_office", value: "Speedy Office"},
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