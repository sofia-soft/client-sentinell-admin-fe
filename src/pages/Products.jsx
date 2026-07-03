import {useEffect, useState} from "react";
import {Center, Loader, Title} from "@mantine/core";
import {PRODUCTS_HEADER, BUTTON_VISIBILITY} from "../config/productsConfig.js";
import {PageContentTemplate} from "../components/PageContentTemplate.jsx";
import * as productsApi from "../api/productsApi.js";
import * as categoriesApi from "../api/categoriesApi.js"
import {CustomDrawer} from "../components/CustomDrawer.jsx";
import {ProductsCreateForm} from "../components/Products/ProductsCreateForm.jsx";
import {ProductsUpdateForm} from "../components/Products/ProductsUpdateForm.jsx";
import {useDisclosure} from "@mantine/hooks";
import {notifications} from "@mantine/notifications";
import handleSubmitForms from "../utils/handlerSubmitForms.js";
import {CustomConfirmModal} from "../components/CustomConfirmModal.jsx";
import * as permissionsApi from "../api/permissionsApi.js";
import {getErrorMessage} from "../utils/getErrorMessage.js";

export function Products() {
    const [loader, setLoader] = useState(false);
    const [products, setProducts] = useState();
    const [opened, {open, close}] = useDisclosure(false);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [openCategoriesDropDown, setCategoriesDropDown] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [titleDrawer, setTitleDrawer] = useState('');
    const [drawerType, setDrawerType] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [imagePath, setImagePath] = useState("");

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

    const handleSubmitForm = async (event) => {
        event.preventDefault();
        const form = event.target;

        setLoading(true);

        const request = await handleSubmitForms(
            form.target === 'update'
                ? productsApi.updateProduct
                : productsApi.createProduct,
            form, imagePath
        );

        if (request.data) {
            if (form.target === 'update') {

                setProducts(prev =>
                    prev?.map(user =>
                        user.uuid === form.name
                            ? request.data.updated_product
                            : user
                    )
                );
            } else {
                setProducts(prev => [request.data.created_product, ...prev]);
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


    const handleDelete = async (uuid) => {
        let color;
        let title;

        CustomConfirmModal({
            title: 'Delete product',
            description: 'Are you sure, that you wanna delete this product?',
            confirmLabel: 'Delete',
            cancelLabel: 'Close',
            confirmColor: 'red',
            onConfirm: async () => {
                const response = await productsApi.deleteProduct(uuid);

                if (response.status === 200 || response.status === 204) {

                    setProducts(prev => prev?.filter(row => row.uuid !== uuid));
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


    const fetchCategories = async () => {
        if (categories.length > 0) {
            setCategoriesDropDown(true);
            return;
        }

        setLoadingCategories(true)

        try {
            const response = await categoriesApi.listCategories();
            if (response.status === 200) {

                const mappedCategories = response.data.data.map((item) => {
                    let name = item.name;

                    try {
                        name = JSON.parse(name);
                    } catch {
                    }

                    return {
                        value: item.uuid,
                        label: name?.en ?? name,
                    };
                });

                setCategories(mappedCategories);
                setCategoriesDropDown(true);
            }
        } catch (error) {
            console.error("Грешка при зареждане на категории:", error);
        } finally {
            setLoadingCategories(false);
        }
    }

    const handleUploadSubmit = async (file) => {

        const formData = new FormData();
        let color;
        let title;

        if (file) {
            formData.append("image", file);
        }

        try {
            const response = await productsApi.uploadProductImage(formData)

            if (response.status === 200) {
                setImagePath(response.data.data.path)
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
        } catch (err) {
            console.error("ERROR:", err);
        }

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
                            onSubmit={handleSubmitForm}
                            apiLoading={loading}
                            fetchCategories={fetchCategories}
                            categories={categories}
                            loadingCategories={loadingCategories}
                            openCategoriesDropDown={openCategoriesDropDown}
                            setCategoriesDropDown={setCategoriesDropDown}
                            handleUploadSubmit={handleUploadSubmit}
                        />
                    )}

                    {drawerType === 'update' && (
                        <ProductsUpdateForm
                            productData={selectedProduct}
                            onSubmit={handleSubmitForm}
                            apiLoading={loading}
                            fetchCategories={fetchCategories}
                            categories={categories}
                            handleUploadSubmit={handleUploadSubmit}

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
                    onDelete={handleDelete}
                    onCreate={handleCreate}

                />
            </>
    )
}