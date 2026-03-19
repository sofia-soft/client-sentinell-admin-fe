import {useEffect, useState} from "react";
import {Center, Loader, Title} from "@mantine/core";
import * as categoryApi from "../api/categoriesApi.js"
import {PageContentTemplate} from "../components/PageContentTemplate.jsx";
import {BUTTON_VISIBILITY, CATEGORIES_HEADER} from "../config/categoriesConfig.js";

export function Categories() {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

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


    return (
        loading ?
            <Center style={{position: "fixed", zIndex: 10, top: '50%', left: '50%'}}>
                <Loader color="blue" size="xl" type="dots"/>
            </Center> :
            <>
                <Title order={2}>Categories</Title>
                <PageContentTemplate
                    tableData={
                        {
                            header: CATEGORIES_HEADER,
                            rows: categories,

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
