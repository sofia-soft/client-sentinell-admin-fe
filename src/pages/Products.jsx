import {useEffect, useState} from "react";
import {Center, Loader, Title} from "@mantine/core";
import {PRODUCTS_HEADER, BUTTON_VISIBILITY} from "../config/productsConfig.js";
import {PageContentTemplate} from "../components/PageContentTemplate.jsx";
import * as productsApi from "../api/productsApi.js";
import {CustomDrawer} from "../components/CustomDrawer.jsx";
import {ProductsCreateForm} from "../components/Products/ProductsCreateForm.jsx";
import {ProductsUpdateForm} from "../components/Products/ProductsUpdateForm.jsx";
import {useDisclosure} from "@mantine/hooks";

export function Products() {
    const [loader, setLoader] = useState(false);
    const [products, setProducts] = useState();
    const [opened, {open, close}] = useDisclosure(false);
    const [loading, setLoading] = useState(false);

    const [titleDrawer, setTitleDrawer] = useState('');
    const [drawerType, setDrawerType] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        setLoader(true);

        productsApi.listProducts().then(
            response => {
                if (response.status === 200) {
                    setProducts(response.data.data)
                }
            }
        ).catch(console.error)
            .finally(() => setLoader(false))
    }, []);


    const handleEdit = (item) => {
        setTitleDrawer('Update product');
        setDrawerType('update');
        setSelectedProduct(item);
        open();
    };

    const handleCreate = () => {
        setTitleDrawer('Create product');
        setDrawerType('create');
        open();
    };


    return (
        loader ?
            <Center style={{position: "fixed", zIndex: 10, top: '50%', left: '50%'}}>
                <Loader color="blue" size="xl" type="dots"/>
            </Center> :
            <>
                <Title order={2}>Products</Title>

                <CustomDrawer
                    close={close}
                    opened={opened}
                    title={titleDrawer}
                >
                    {drawerType === 'create' && (
                        <ProductsCreateForm
                            // onSubmit={handleSubmitForm}
                            // permissionsHandler={permissionsHandler}
                            apiLoading={loading}
                        />
                    )}

                    {drawerType === 'update' && (
                        <ProductsUpdateForm
                            productData={selectedProduct}
                            // onSubmit={handleSubmitForm}
                            // permissionsHandler={permissionsHandler}
                            apiLoading={loading}
                        />
                    )}
                </CustomDrawer>

                <PageContentTemplate
                    tableData={
                        {
                            header: PRODUCTS_HEADER,
                            rows: products,

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