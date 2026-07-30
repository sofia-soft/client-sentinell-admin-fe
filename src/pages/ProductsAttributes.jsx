import {useEffect, useState} from "react";
import {Center, Loader, Title} from "@mantine/core";
import {PRODUCTS_ATTRIBUTES_HEADER, BUTTON_VISIBILITY} from "../config/productsAttributesConfig.js";
import {PageContentTemplate} from "../components/PageContentTemplate.jsx";
import {CustomDrawer} from "../components/CustomDrawer.jsx";
import {ProductsAttributesCreateForm} from "../components/ProductsAttributes/ProductsAttributesCreateForm.jsx";
import {ProductsAttributesUpdateForm} from "../components/ProductsAttributes/ProductsAttributesUpdateForm.jsx";
import {useDisclosure} from "@mantine/hooks";
import {notifications} from "@mantine/notifications";
import handleSubmitForms from "../utils/handlerSubmitForms.js";
import {CustomConfirmModal} from "../components/CustomConfirmModal.jsx";
import {
    listProductsAttributes,
    createProductAttribute,
    updateProductAttribute,
    deleteProductAttribute
} from "../api/productsAttributesApi.js";

export function ProductsAttributes() {
    const [loader, setLoader] = useState(false);
    const [productsAttributes, setProductsAttributes] = useState();
    const [opened, {open, close}] = useDisclosure(false);
    const [loading, setLoading] = useState(false);
    const [titleDrawer, setTitleDrawer] = useState('');
    const [drawerType, setDrawerType] = useState(null);
    const [selectedProductAttribute, setSelectedProductAttribute] = useState(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoader(true);

        listProductsAttributes().then(
            response => {
                if (response.status === 200) {
                    setProductsAttributes(response.data.data)
                }
            }
        ).catch(console.error)
            .finally(() => setLoader(false))
    }, []);

    const handleSubmitForm = async (event) => {
        event.preventDefault();
        const form = event.target;

        setLoading(true);

        const request = await handleSubmitForms(
            form.target === 'update'
                ? updateProductAttribute
                : createProductAttribute,
            form
        );

        if (request.data) {
            if (form.target === 'update') {

                setProductsAttributes(prev =>
                    prev?.map(user =>
                        user.uuid === form.name
                            ? request.data.updated_attribute
                            : user
                    )
                );
            } else {
                setProductsAttributes(prev => [...prev, request.data.created_attribute]);
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
        setTitleDrawer('Update product attributes');
        setDrawerType('update');
        setSelectedProductAttribute(item);
        open();
    };

    const handleCreate = () => {
        setTitleDrawer('Create product attributes');
        setDrawerType('create');
        open();
    };


    const handleDelete = async (uuid) => {
        let color;
        let title;

        CustomConfirmModal({
            title: 'Delete product attribute',
            description: 'Are you sure, that you wanna delete this product attribute?',
            confirmLabel: 'Delete',
            cancelLabel: 'Close',
            confirmColor: 'red',
            onConfirm: async () => {
                const response = await deleteProductAttribute(uuid);

                if (response.status === 200 || response.status === 204) {
                    setProductsAttributes(prev => prev?.filter(row => row.uuid !== uuid));
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
                <Title order={2}>Products Attributes</Title>

                <CustomDrawer
                    close={close}
                    opened={opened}
                    title={titleDrawer}
                >
                    {drawerType === 'create' && (
                        <ProductsAttributesCreateForm
                            onSubmit={handleSubmitForm}
                            apiLoading={loading}
                        />
                    )}

                    {drawerType === 'update' && (
                        <ProductsAttributesUpdateForm
                            productAttribute={selectedProductAttribute}
                            onSubmit={handleSubmitForm}
                            apiLoading={loading}
                        />
                    )}
                </CustomDrawer>

                <PageContentTemplate
                    tableData={
                        {
                            header: PRODUCTS_ATTRIBUTES_HEADER,
                            rows: productsAttributes,

                        }
                    }
                    buttonsVisible={BUTTON_VISIBILITY}
                    resourceName="products-attributes"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onCreate={handleCreate}

                />
            </>
    )
}