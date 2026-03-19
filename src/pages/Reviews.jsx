import {Center, Loader, Title} from "@mantine/core";
import {useEffect, useState} from "react";


export function Reviews() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);

        }, 2000)
    }, []);


    return (
        loading ?
            <Center style={{position: "fixed", zIndex: 10, top: '50%', left: '50%'}}>
                <Loader color="blue" size="xl" type="dots"/>
            </Center> :
            <Title order={2}>Roles</Title>
    )
}