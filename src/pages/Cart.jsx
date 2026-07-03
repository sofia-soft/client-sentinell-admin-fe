import {useEffect, useState} from "react";
import {Center, Loader, Title} from "@mantine/core";
import * as cartApi from "../api/cartApi.js"
import {PageContentTemplate} from "../components/PageContentTemplate.jsx";
import {BUTTON_VISIBILITY, CART_HEADER} from "../config/cartConfig.js";
import {CustomDrawer} from "../components/CustomDrawer.jsx";
import {useDisclosure} from "@mantine/hooks";
import {CartCreateForm} from "../components/Cart/CartCreateForm.jsx";
import {CartUpdateForm} from "../components/Cart/CartUpdateForm.jsx";
import handleSubmitForms from "../utils/handlerSubmitForms.js";
import {notifications} from "@mantine/notifications";
import {CustomConfirmModal} from "../components/CustomConfirmModal.jsx";
import * as categoryApi from "../api/categoriesApi.js";

export function Cart() {
    const [loading, setLoading] = useState(false);
    const [carts, setCarts] = useState([]);

    const [opened, {open, close}] = useDisclosure(false);
    const [titleDrawer, setTitleDrawer] = useState('');
    const [drawerType, setDrawerType] = useState(null);
    const [selectedCart, setSelectedCart] = useState(null);


    useEffect(() => {
        setLoading(true);

        cartApi.listCart()
            .then(response => {
                if (response.status === 200) {
                    setCarts(response.data.data)
                }
            }).catch(console.error)
            .finally(() => setLoading(false))
    }, []);

    const handleSubmitForm = async (event, data) => {
        const form = event.target;

        setLoading(true);

        const request = await handleSubmitForms(
            form.target === 'update'
                ? cartApi.updateItem
                : cartApi.createCart,
            form, '', data
        );

        if (request.data) {
            if (form.target === 'update') {

                setCarts(prev =>
                    prev.map(cart =>
                        cart.uuid === form.name
                            ? request.data.updated_cart
                            : cart
                    )
                );
                setSelectedCart(request.data.updated_cart)
            } else {
                setCarts(prev => [request.data.created_cart, ...prev]);
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
        setTitleDrawer('Update Cart');
        setDrawerType('update');
        setSelectedCart(item);
        open();
    };

    const handleCreate = () => {
        setTitleDrawer('Create Cart');
        setDrawerType('create');
        open();
    };


    const handleDelete = async (uuid) => {
        let color;
        let title;


        CustomConfirmModal({
            title: 'Delete cart',
            description: 'Are you sure, that you wanna delete this cart?',
            confirmLabel: 'Delete',
            cancelLabel: 'Close',
            confirmColor: 'red',
            onConfirm: async () => {
                const response = await cartApi.deleteCart(uuid);
                if (response.status === 200 || response.status === 204) {

                    setCarts(prev => prev.filter(row => row.uuid !== uuid));
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
                <Title order={2}>Carts</Title>

                <CustomDrawer
                    close={close}
                    opened={opened}
                    title={titleDrawer}
                >
                    {drawerType === 'create' && (
                        <CartCreateForm
                            onSubmit={handleSubmitForm}
                            apiLoading={loading}
                        />
                    )}

                    {drawerType === 'update' && (
                        <CartUpdateForm
                            cartData={selectedCart}
                            onSubmit={handleSubmitForm}
                            apiLoading={loading}
                            setCarts={setCarts}
                        />
                    )}
                </CustomDrawer>
                <PageContentTemplate
                    tableData={
                        {
                            header: CART_HEADER,
                            rows: carts,

                        }
                    }
                    buttonsVisible={BUTTON_VISIBILITY}
                    resourceName="cart"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onCreate={handleCreate}

                />
            </>

    )
}