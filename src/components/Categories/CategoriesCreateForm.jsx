import {Button, Divider, Group, Select, Stack, Switch, Tabs, Textarea, TextInput} from "@mantine/core";

export function CategoriesCreateForm({onSubmit, apiLoading}) {
    return(
        <form onSubmit={onSubmit} target={'create'}>
            <Tabs defaultValue="general">

                <Tabs.List>
                    <Tabs.Tab value="general">General</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="general" pt="md">
                    <Stack>

                        <TextInput
                            key={'name'}
                            id='name'
                            name={'name'}
                            label="Categorie Name"
                            placeholder="Оръжия"
                            required
                        />

                        <TextInput
                            key={'slug'}
                            id='slug'
                            name={'slug'}
                            label="Slug"
                            placeholder="orajiq"
                        />

                        <Select
                            key={'is_active'}
                            id='is_active'
                            name={'is_active'}
                            label="Status"
                            defaultValue="active"
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
                    Create category
                </Button>
            </Group>
        </form>
    );
}