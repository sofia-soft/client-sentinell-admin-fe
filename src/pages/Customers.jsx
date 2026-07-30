import {useEffect, useState} from "react";
import {Center, Loader} from "@mantine/core";
import * as customerApi from "../api/customersApi.js"
import {PageContentTemplate} from "../components/PageContentTemplate.jsx";
import {BUTTON_VISIBILITY, CUSTOMER_HEADER} from "../config/customerConfig.js";
import {CustomDrawer} from "../components/CustomDrawer.jsx";
import {CustomersCreateForm} from "../components/Customers/CustomersCreateForm.jsx";
import {CustomersUpdateForm} from "../components/Customers/CustomersUpdateForm.jsx";
import {useDisclosure} from "@mantine/hooks";
import handleSubmitForms from "../utils/handlerSubmitForms.js";
import {notifications} from "@mantine/notifications";
import {CustomConfirmModal} from "../components/CustomConfirmModal.jsx";

export function Customers() {
    const [loader, setLoader] = useState(false);
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [opened, {open, close}] = useDisclosure(false);

    const [titleDrawer, setTitleDrawer] = useState('');
    const [drawerType, setDrawerType] = useState(null);
    const [selectedCustomers, setSelectedCustomers] = useState(null);


    useEffect(() => {
        setLoader(true);

        customerApi.listCustomers()
            .then(response => {
                if (response.status === 200) {
                    setCustomers(response.data.data)
                }
            })
            .catch(console.error)
            .finally(() => setLoader(false))
    }, []);


    const handleSubmitForm = async (event) => {
        event.preventDefault();
        const form = event.target;

        setLoading(true);

        const request = await handleSubmitForms(
            form.target === 'update'
                ? customerApi.updateCustomer
                : customerApi.createCustomer,
            form
        );

        if (request.data) {
            if (form.target === 'update') {

                setCustomers(prev =>
                    prev.map(user =>
                        user.uuid === form.name
                            ? request.data.updated_customer
                            : user
                    )
                );
            } else {
                setCustomers(prev => [request.data.created_customer, ...prev]);
            }
        }


        if (request.notify) {
            notifications.show({
                title: request.notify.title,
                message: request.notify.message,
                color: request.notify.color,
                position: "top-right"
            });
        }

        setLoading(false);

    }
    const handleEdit = (item) => {
        setTitleDrawer('Update customer');
        setDrawerType('update');
        setSelectedCustomers(item);
        open();
    };

    const handleCreate = () => {
        setTitleDrawer('Create customer');
        setDrawerType('create');
        open();
    };


    const handleDelete = async (uuid) => {
        let color;
        let title;

        CustomConfirmModal({
            title: 'Delete category',
            description: 'Are you sure, that you wanna delete this category?',
            confirmLabel: 'Delete',
            cancelLabel: 'Close',
            confirmColor: 'red',
            onConfirm: async () => {
                const response = await customerApi.deleteCustomer(uuid);
                if (response.status === 200 || response.status === 204) {

                    setCustomers(prev => prev.filter(row => row.uuid !== uuid));
                    color = 'green'
                    title = 'Success'
                } else {
                    color = 'red'
                    title = 'Fail'
                }

                notifications.show({
                    title: title,
                    message: response.data.data.message,
                    color: color,
                    position: "top-right"
                });

            },
        });
    };


    return (
        loader ?
            <Center style={{position: "fixed", zIndex: 10, top: '50%', left: '50%'}}>
                <Loader color="blue" size="xl" type="dots"/>
            </Center> :
            <>
                <CustomDrawer
                    close={close}
                    opened={opened}
                    title={titleDrawer}
                >
                    {drawerType === 'create' && (
                        <CustomersCreateForm
                            onSubmit={handleSubmitForm}
                            apiLoading={loading}
                        />
                    )}

                    {drawerType === 'update' && (
                        <CustomersUpdateForm
                            customerData={selectedCustomers}
                            onSubmit={handleSubmitForm}
                            apiLoading={loading}
                        />
                    )}
                </CustomDrawer>


                <PageContentTemplate
                    title="Customers"
                    tableData={
                        {
                            header: CUSTOMER_HEADER,
                            rows: customers,

                        }
                    }
                    buttonsVisible={BUTTON_VISIBILITY}
                    resourceName="prodcuts"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onCreate={handleCreate}

                />
            </>
    )
}
