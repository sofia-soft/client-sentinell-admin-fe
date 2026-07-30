import {useEffect, useState} from "react";
import {Center, Loader} from "@mantine/core";
import * as ordersApi from "../api/ordersApi.js"
import {ORDER_HEADER, BUTTON_VISIBILITY} from "../config/orderConfig.js";
import {PageContentTemplate} from "../components/PageContentTemplate.jsx";
import {CustomConfirmModal} from "../components/CustomConfirmModal.jsx";
import {notifications} from "@mantine/notifications";

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


    const updateStatus = (status, uuid) => {

        ordersApi.updateOrder(uuid, {status_id: status})
            .then(response => {
                if (response.status === 200) {
                    setOrders(prev =>
                        prev.map(order =>
                            order.uuid === uuid
                                ? response.data.data.updated_order
                                : order
                        )
                    );
                }
            }).catch(console.error)
    }

    const handleDelete = async (uuid) => {
        let color;
        let title;

        CustomConfirmModal({
            title: 'Delete order',
            description: 'Are you sure, that you wanna delete this order?',
            confirmLabel: 'Delete',
            cancelLabel: 'Close',
            confirmColor: 'red',
            onConfirm: async () => {
                const response = await ordersApi.deleteOrder(uuid);
                if (response.status === 200 || response.status === 204) {

                    setOrders(prev => prev.filter(row => row.uuid !== uuid));
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
        loading ?
            <Center style={{position: "fixed", zIndex: 10, top: '50%', left: '50%'}}>
                <Loader color="blue" size="xl" type="dots"/>
            </Center> :
            <>
                <PageContentTemplate
                    title="Orders"
                    tableData={
                        {
                            header: ORDER_HEADER,
                            rows: orders,

                        }
                    }
                    buttonsVisible={BUTTON_VISIBILITY}
                    resourceName="order"
                    onEdit={() => console.log()}
                    onDelete={handleDelete}
                    onCreate={() => console.log()}
                    updateStatus={updateStatus}

                />
            </>
    )
}
