import {
    Button,
    Center,
    Divider,
    Group,
    Loader,
    Paper,
    Select,
    Stack,
    Tabs,
    Text,
    Textarea,
    TextInput
} from "@mantine/core";
import {useEffect, useState} from "react";
import * as userApi from "../../api/usersApi.js";

export function CustomersUpdateForm({customerData, onSubmit, apiLoading}) {
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
        <form onSubmit={onSubmit} target={'update'} name={customerData.uuid}>

            <Tabs defaultValue="general">
                {loader ? <Center py="xl">
                        <Loader color="blue" type="dots"/>
                    </Center>
                    :
                    <>
                        <Tabs.List>
                            <Tabs.Tab value="general">General</Tabs.Tab>
                            <Tabs.Tab value="contacts">Contacts</Tabs.Tab>
                            <Tabs.Tab value="system">System Info</Tabs.Tab>

                        </Tabs.List>

                        <Tabs.Panel value="general" pt="md">
                            <Stack>

                                <Select
                                    label="Username"
                                    data={users}
                                    defaultValue={users?.find(item => item.label === customerData.username)?.value}
                                />

                                <TextInput
                                    key={'first_name'}
                                    id='first_name'
                                    name={'first_name'}
                                    label="First name"
                                    placeholder="Георги"
                                    defaultValue={customerData?.first_name}
                                    required
                                />

                                <TextInput
                                    key={'last_name'}
                                    id='last_name'
                                    name={'last_name'}
                                    label="Last name"
                                    placeholder="Георгиев"
                                    defaultValue={customerData?.last_name}

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
                                    defaultValue={customerData?.phone}


                                />


                                <Textarea
                                    key={'shipping_address'}
                                    id='shipping_address'
                                    name={'shipping_address'}
                                    label="Shipping address"
                                    placeholder="Георгиев"
                                    defaultValue={customerData?.shipping_address}
                                />

                            </Stack>

                        </Tabs.Panel>


                        <Tabs.Panel value="system" pt="md">

                            <Paper withBorder p="md">
                                <Stack gap="xs">

                                    <Group justify="space-between">
                                        <Text size="sm" c="dimmed">Created At</Text>
                                        <Text size="sm">{customerData?.created_at}</Text>
                                    </Group>

                                    <Divider/>

                                    <Group justify="space-between">
                                        <Text size="sm" c="dimmed">Updated At</Text>
                                        <Text size="sm">{customerData?.updated_at}</Text>
                                    </Group>

                                </Stack>
                            </Paper>

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
                    Update Customer
                </Button>
            </Group>
        </form>
    );
}