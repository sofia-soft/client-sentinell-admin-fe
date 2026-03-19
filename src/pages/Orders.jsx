import {useEffect, useState} from "react";
import {Center, Loader, Title} from "@mantine/core";
import * as ordersApi from "../api/ordersApi.js"
import {ORDER_HEADER, BUTTON_VISIBILITY} from "../config/orderConfig.js";
import {PageContentTemplate} from "../components/PageContentTemplate.jsx";

export function Orders() {
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        setLoading(true);

        ordersApi.listOrders().then(
            response => {
                if (response.status === 200) {
                    setOrders(response.data.data)
                }
            }
        ).catch(console.error)
            .finally(() => setLoading(false))
    }, []);


    return (
        loading ?
            <Center style={{position: "fixed", zIndex: 10, top: '50%', left: '50%'}}>
                <Loader color="blue" size="xl" type="dots"/>
            </Center> :
            <>
                <Title order={2}>Orders</Title>
                <PageContentTemplate
                    tableData={
                        {
                            header: ORDER_HEADER,
                            rows: orders,

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
