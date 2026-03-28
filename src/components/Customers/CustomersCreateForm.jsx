import {Button, Center, Divider, Group, Loader, Select, Stack, Tabs, Textarea, TextInput} from "@mantine/core";
import * as userApi from "../../api/usersApi.js"
import {useEffect, useState} from "react";

export function CustomersCreateForm({onSubmit, apiLoading}) {
    const [loader, setLoader] = useState(false)
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setLoader(true);
        userApi.listUsers()
            .then(
                response => {
                    if (response.status === 200) {
                        const mapped = response.data.data.map((item) => ({
                            value: item.uuid,
                            label: item.username,
                        }));
                        setUsers(mapped);
                    }
                }
            ).catch(console.error)
            .finally(() => setLoader(false))


    }, []);

    return (
        <form onSubmit={onSubmit} target={'create'}>
            <Tabs defaultValue="general">
                {loader ? (
                        <Center py="xl">
                            <Loader color="blue" type="dots"/>
                        </Center>
                    ) :
                    <>
                        <Tabs.List>
                            <Tabs.Tab value="general">General</Tabs.Tab>
                            <Tabs.Tab value="contacts">Contacts</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="general" pt="md">
                            <Stack>
                                <Select
                                    label="Username"
                                    data={users}
                                />
                                <TextInput
                                    key={'first_name'}
                                    id='first_name'
                                    name={'first_name'}
                                    label="First name"
                                    placeholder="Георги"
                                    required
                                />

                                <TextInput
                                    key={'last_name'}
                                    id='last_name'
                                    name={'last_name'}
                                    label="Last name"
                                    placeholder="Георгиев"
                                />
                            </Stack>

                        </Tabs.Panel>

                        <Tabs.Panel value="contacts" pt="md" loader>
                            <Stack>

                                <TextInput
                                    key={'phone'}
                                    id='phone'
                                    name={'phone'}
                                    label="Phone"
                                    placeholder="Георгиев"
                                />


                                <Textarea
                                    key={'shipping_address'}
                                    id='shipping_address'
                                    name={'shipping_address'}
                                    label="Shipping address"
                                    placeholder="Георгиев"
                                />


                            </Stack>

                        </Tabs.Panel>
                    </>}
            </Tabs>
            <Divider my="md"/>

            <Group justify="flex-end">
                <Button
                    type="submit"
                    fullWidth mt="md"
                    loading={apiLoading}
                    loaderProps={{type: 'dots'}}
                >
                    Create Customer
                </Button>
            </Group>
        </form>
    )
        ;
}