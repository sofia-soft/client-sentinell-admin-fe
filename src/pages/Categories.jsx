import {useEffect, useState} from "react";
import {Center, Loader} from "@mantine/core";
import * as categoryApi from "../api/categoriesApi.js"
import {PageContentTemplate} from "../components/PageContentTemplate.jsx";
import {BUTTON_VISIBILITY, CATEGORIES_HEADER} from "../config/categoriesConfig.js";
import {useDisclosure} from "@mantine/hooks";
import {CustomDrawer} from "../components/CustomDrawer.jsx";
import {CategoriesCreateForm} from "../components/Categories/CategoriesCreateForm.jsx";
import {CategoriesUpdateForm} from "../components/Categories/CategoriesUpdateForm.jsx";
import {notifications} from "@mantine/notifications";
import handleSubmitForms from "../utils/handlerSubmitForms.js";
import {CustomConfirmModal} from "../components/CustomConfirmModal.jsx";

export function Categories() {
    const [loader, setLoader] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [opened, {open, close}] = useDisclosure(false);
    const [titleDrawer, setTitleDrawer] = useState('');
    const [drawerType, setDrawerType] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState(null);


    useEffect(() => {
        setLoading(true);

        categoryApi.listCategories().then(
            response => {
                if (response.status === 200) {
                    setCategories(response.data.data)
                }
            }
        ).catch(console.error)
            .finally(() => setLoading(false))
    }, []);


    const handleSubmitForm = async (event) => {
        event.preventDefault();
        const form = event.target;

        setLoading(true);

        const request = await handleSubmitForms(
            form.target === 'update'
                ? categoryApi.updateCategory
                : categoryApi.createCategory,
            form
        );

        if (request.data) {
            if (form.target === 'update') {

                setCategories(prev =>
                    prev.map(user =>
                        user.uuid === form.name
                            ? request.data.updated_category
                            : user
                    )
                );
            } else {
                setCategories(prev => [request.data.created_category, ...prev]);
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
        setTitleDrawer('Update category');
        setDrawerType('update');
        setSelectedCategories(item);
        open();
    };

    const handleCreate = () => {
        setTitleDrawer('Create category');
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
                const response = await categoryApi.deleteCategory(uuid);
                if (response.status === 200 || response.status === 204) {

                    setCategories(prev => prev.filter(row => row.uuid !== uuid));
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
                        <CategoriesCreateForm
                            onSubmit={handleSubmitForm}
                            apiLoading={loading}
                        />
                    )}

                    {drawerType === 'update' && (
                        <CategoriesUpdateForm
                            customerData={selectedCategories}
                            onSubmit={handleSubmitForm}
                            apiLoading={loading}
                        />
                    )}
                </CustomDrawer>

                <PageContentTemplate
                    title="Categories"
                    tableData={
                        {
                            header: CATEGORIES_HEADER,
                            rows: categories,

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
