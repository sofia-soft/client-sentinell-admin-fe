import {useEffect, useState} from "react";
import {Center, Loader, Title} from "@mantine/core";
import * as customerApi from "../api/customersApi.js"
import {PageContentTemplate} from "../components/PageContentTemplate.jsx";
import {BUTTON_VISIBILITY, CUSTOMER_HEADER} from "../config/customerConfig.js";
import {CustomDrawer} from "../components/CustomDrawer.jsx";
import {CustomersCreateForm} from "../components/Customers/CustomersCreateForm.jsx";
import {CustomersUpdateForm} from "../components/Customers/CustomersUpdateForm.jsx";
import {useDisclosure} from "@mantine/hooks";
export function Customers() {
    const [loader, setLoader] = useState(false);
    const [loading, setLoading] = useState(false);
    const [customers, setCustomer] = useState([]);
    const [opened, {open, close}] = useDisclosure(false);

    const [titleDrawer, setTitleDrawer] = useState('');
    const [drawerType, setDrawerType] = useState(null);
    const [selectedCustomers, setSelectedCustomers] = useState(null);


    useEffect(() => {
        setLoader(true);

        customerApi.listCustomers()
            .then(response => {
                if (response.status === 200) {
                    setCustomer(response.data.data)
                }
            })
            .catch(console.error)
            .finally(() => setLoader(false))
    }, []);



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


    return (
        loader ?
            <Center style={{position: "fixed", zIndex: 10, top: '50%', left: '50%'}}>
                <Loader color="blue" size="xl" type="dots"/>
            </Center> :
            <>
                <Title order={2}>Customers</Title>

                <CustomDrawer
                    close={close}
                    opened={opened}
                    title={titleDrawer}
                >
                    {drawerType === 'create' && (
                        <CustomersCreateForm
                            // onSubmit={handleSubmitForm}
                            apiLoading={loading}
                        />
                    )}

                    {drawerType === 'update' && (
                        <CustomersUpdateForm
                            customerData={selectedCustomers}
                            // onSubmit={handleSubmitForm}
                            apiLoading={loading}
                        />
                    )}
                </CustomDrawer>


                <PageContentTemplate
                    tableData={
                        {
                            header: CUSTOMER_HEADER,
                            rows: customers,

                        }
                    }
                    buttonsVisible={BUTTON_VISIBILITY}
                    resourceName="prodcuts"
                    onEdit={handleEdit}
                    // onDelete={handleDelete}
                    onCreate={handleCreate}

                />
            </>
    )
}
