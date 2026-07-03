import {Button, Divider, Group, Select, Stack, Tabs, TextInput} from "@mantine/core";
import {getLocalizedValue} from "../../utils/utils.js";

export function CategoriesUpdateForm({customerData, onSubmit, apiLoading}) {

    const name = JSON.parse(customerData.name);

    return (
        <form onSubmit={onSubmit} target={'update'} name={customerData.uuid}>
            <Tabs defaultValue="general">

                <Tabs.List>
                    <Tabs.Tab value="general">General</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="general" pt="md">
                    <Stack>

                        <TextInput
                            key={'name_bg'}
                            id='name_bg'
                            name={'name_bg'}
                            label="Categorie BG Name"
                            placeholder="Оръжия"
                            defaultValue ={getLocalizedValue(name, "bg")}
                            required
                        />

                        <TextInput
                            key={'name_en'}
                            id='name_en'
                            name={'name_en'}
                            label="Categorie EN Name"
                            placeholder="Weapon"
                            defaultValue ={getLocalizedValue(name, "en")}
                            required
                        />

                        <TextInput
                            key={'slug'}
                            id='slug'
                            name={'slug'}
                            label="Slug"
                            defaultValue ={customerData.slug}
                            placeholder="orajiq"
                        />

                        <Select
                            key={'is_active'}
                            id='is_active'
                            name={'is_active'}
                            label="Status"
                            defaultValue={customerData.is_active ? "active" : "inactive"}
                            data={[
                                {value: "active", label: "Active"},
                                {value: "inactive", label: "Inactive"},
                            ]}
                        />
                    </Stack>
                </Tabs.Panel>

            </Tabs>
            <Divider my="md"/>

            <Group justify="flex-end">
                <Button
                    type="submit"
                    fullWidth mt="md"
                    loading={apiLoading}
                    loaderProps={{type: 'dots'}}
                >
                    Save
                </Button>
            </Group>
        </form>
    );
}