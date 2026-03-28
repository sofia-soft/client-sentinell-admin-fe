import {useEffect, useState} from "react";
import {Center, Loader, Title} from "@mantine/core";
import * as categoryApi from "../api/categoriesApi.js"
import {PageContentTemplate} from "../components/PageContentTemplate.jsx";
import {BUTTON_VISIBILITY, CATEGORIES_HEADER} from "../config/categoriesConfig.js";
import {useDisclosure} from "@mantine/hooks";
import {CustomDrawer} from "../components/CustomDrawer.jsx";
import {CategoriesCreateForm} from "../components/Categories/CategoriesCreateForm.jsx";
import {CategoriesUpdateForm} from "../components/Categories/CategoriesUpdateForm.jsx";

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


    return (
        loader ?
            <Center style={{position: "fixed", zIndex: 10, top: '50%', left: '50%'}}>
                <Loader color="blue" size="xl" type="dots"/>
            </Center> :
            <>
                <Title order={2}>Categories</Title>

                <CustomDrawer
                    close={close}
                    opened={opened}
                    title={titleDrawer}
                >
                    {drawerType === 'create' && (
                        <CategoriesCreateForm
                            // onSubmit={handleSubmitForm}
                            apiLoading={loading}
                        />
                    )}

                    {drawerType === 'update' && (
                        <CategoriesUpdateForm
                            customerData={selectedCategories}
                            // onSubmit={handleSubmitForm}
                            apiLoading={loading}
                        />
                    )}
                </CustomDrawer>

                <PageContentTemplate
                    tableData={
                        {
                            header: CATEGORIES_HEADER,
                            rows: categories,

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
