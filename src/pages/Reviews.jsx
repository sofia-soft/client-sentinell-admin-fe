import {Center, Loader} from "@mantine/core";
import {useEffect, useState} from "react";
import * as reviewsApi from "../api/reviewsApi.js"
import {PageContentTemplate} from "../components/PageContentTemplate.jsx";
import {BUTTON_VISIBILITY, REVIEWS_HEADER} from "../config/reviewsConfig.js";
import {CustomDrawer} from "../components/CustomDrawer.jsx";
import {ReviewsCreateForm} from "../components/Reviews/ReviewsCreateForm.jsx";
import {useDisclosure} from "@mantine/hooks";
import * as customersApi from "../api/customersApi.js"
import * as productsApi from "../api/productsApi.js"
import handleSubmitForms from "../utils/handlerSubmitForms.js";
import {notifications} from "@mantine/notifications";
import {CustomConfirmModal} from "../components/CustomConfirmModal.jsx";

export function Reviews() {
    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [opened, {open, close}] = useDisclosure(false);
    const [titleDrawer, setTitleDrawer] = useState('');

    const [drawerType, setDrawerType] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [customersDropDown, setCustomersDropDown] = useState(false)
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [productsDropDown, setProductsDropDown] = useState(false)

    useEffect(() => {
        setLoading(true);

        reviewsApi.listReviews()
            .then(response => {
                if (response.status === 200) {
                    setReviews(response.data.data)
                }
            }).catch(console.error)
            .finally(() => setLoading(false))
    }, []);


    const handleSubmitForm = async (event) => {
        event.preventDefault();
        const form = event.target;

        setLoading(true);

        const request = await handleSubmitForms(
            reviewsApi.createReview,
            form
        );

        if (request.data) {
            setReviews(prev => [request.data.created_review, ...prev]);
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

    const updateApproved = (status, uuid) => {

        reviewsApi.updateReview(uuid, {is_approved: status ? 1 : 0})
            .then((response) => {
                if (response.status === 200) {
                    setReviews(prev =>
                        prev.map(review =>
                            review.uuid === uuid
                                ? response.data.data.updated_review
                                : review
                        )
                    );
                }
            }).catch(console.error)
    }

    const handleCreate = () => {
        setDrawerType('create');
        setTitleDrawer('Create review');
        open();
    };


    const fetchCustomers = async () => {
        if (customers.length > 0) {
            setCustomersDropDown(true);
            return;
        }

        setLoadingCustomers(true)

        try {
            const response = await customersApi.listCustomers();
            if (response.status === 200) {

                const mappedCustomers = response.data.data.map((item) => ({
                    value: item.uuid,
                    label: `${item.first_name} ${item.last_name}`,
                }));

                setCustomers(mappedCustomers);
                setCustomersDropDown(true);
            }
        } catch (error) {
            console.error("Грешка при зареждане на категории:", error);
        } finally {
            setLoadingCustomers(false);
        }
    }


    const fetchProducts = async () => {
        if (products.length > 0) {
            setProductsDropDown(true);
            return;
        }

        try {
            const response = await productsApi.listProducts();
            if (response.status === 200) {

                const mappedProducts = response.data.data.map((item) => {
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

                setProducts(mappedProducts);
                setProductsDropDown(true);
            }
        } catch (error) {
            console.error("Грешка при зареждане на категории:", error);
        } finally {
            setLoadingProducts(false);
        }
    }


    const handleDelete = async (uuid) => {
        let color;
        let title;

        CustomConfirmModal({
            title: 'Delete review',
            description: 'Are you sure, that you wanna delete this review?',
            confirmLabel: 'Delete',
            cancelLabel: 'Close',
            confirmColor: 'red',
            onConfirm: async () => {
                const response = await reviewsApi.deleteReview(uuid);

                if (response.status === 200 || response.status === 204) {

                    setReviews(prev => prev.filter(row => row.uuid !== uuid));
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
                <CustomDrawer
                    close={close}
                    opened={opened}
                    title={titleDrawer}
                >
                    {drawerType === 'create' && (
                        <ReviewsCreateForm
                            onSubmit={handleSubmitForm}
                            apiLoading={loading}
                            openCustomersDropDown={customersDropDown}
                            fetchCustomers={fetchCustomers}
                            customers={customers}
                            setCustomersDropDown={setCustomersDropDown}
                            loadingCustomers={loadingCustomers}
                            openProductsDropDown={productsDropDown}
                            fetchProducts={fetchProducts}
                            products={products}
                            setProductsDropDown={setProductsDropDown}
                            loadingProducts={loadingProducts}
                        />
                    )}
                </CustomDrawer>

                <PageContentTemplate
                    title="Reviews"
                    tableData={
                        {
                            header: REVIEWS_HEADER,
                            rows: reviews,

                        }
                    }
                    buttonsVisible={BUTTON_VISIBILITY}
                    resourceName="reviews"
                    onDelete={handleDelete}
                    onCreate={handleCreate}
                    updateStatus={updateApproved}

                />
            </>
    )
}