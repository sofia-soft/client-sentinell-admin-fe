export const REVIEWS_HEADER = [
    {key: "id", value: "ID"},
    {key: "product", value: "Product"},
    {key: "customer", value: "Customer"},
    {key: "rating", value: "Rating"},
    {key: "approved", value: "Approved"},
    {key: "comment", value: "Comment"},
    {key: "created_at", value: "Created At"},
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