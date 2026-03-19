import {useEffect, useState} from "react";
import {Center, Loader, Title} from "@mantine/core";
import * as customerApi from "../api/customersApi.js"
import {PageContentTemplate} from "../components/PageContentTemplate.jsx";
import {BUTTON_VISIBILITY, CUSTOMER_HEADER} from "../config/customerConfig.js";

export function Customers() {
    const [loading, setLoading] = useState(false);
    const [customers, setCustomer] = useState([]);

    useEffect(() => {
        setLoading(true);

        customerApi.listCustomers()
            .then(response => {
                if (response.status === 200) {
                    setCustomer(response.data.data)
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, []);


    return (
        loading ?
            <Center style={{position: "fixed", zIndex: 10, top: '50%', left: '50%'}}>
                <Loader color="blue" size="xl" type="dots"/>
            </Center> :
            <>
                <Title order={2}>Customers</Title>
                <PageContentTemplate
                    tableData={
                        {
                            header: CUSTOMER_HEADER,
                            rows: customers,

                        }
                    }
                    buttonsVisible={BUTTON_VISIBILITY}
                    resourceName="prodcuts"
                    // onEdit={handleEdit}
                    // onDelete={handleDelete}
                    // onCreate={handleCreate}

                />
            </>
    )
}
