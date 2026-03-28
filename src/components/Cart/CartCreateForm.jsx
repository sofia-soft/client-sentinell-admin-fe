import {
    Button,
    Center, Checkbox,
    Divider, Grid,
    Group,
    Loader,
    Paper,
    Select,
    Stack,
    Switch,
    Tabs, Text,
    Textarea,
    TextInput
} from "@mantine/core";

export function CartCreateForm({onSubmit, apiLoading}) {
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
                            label="Role Name"
                            placeholder="Administrator"
                            required
                            value={roleName}
                            onChange={(event) => setRoleName(event.currentTarget.value)}
                        />

                        <Textarea
                            key={'description'}
                            id='description'
                            name={'description'}
                            label="Description"
                            placeholder="Describe what this role can do..."
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

                        <Switch
                            key={'is_system'}
                            id='is_system'
                            name={'is_system'}
                            label="System Role"
                            description="System roles cannot be deleted"
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
                    Create Role
                </Button>
            </Group>
        </form>
    );
}