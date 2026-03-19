import {useEffect, useState} from "react";
import {Center, Loader, Title} from "@mantine/core";
import {PRODUCTS_HEADER, BUTTON_VISIBILITY} from "../config/productsConfig.js";
import {PageContentTemplate} from "../components/PageContentTemplate.jsx";
import * as productsApi from "../api/productsApi.js";

export function Products() {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState();

    useEffect(() => {
        setLoading(true);

        productsApi.listProducts().then(
            response => {
                if (response.status === 200) {
                    setProducts(response.data.data)
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
                <Title order={2}>Products</Title>

                <PageContentTemplate
                    tableData={
                        {
                            header: PRODUCTS_HEADER,
                            rows: products,

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