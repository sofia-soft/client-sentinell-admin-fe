import {
    Tabs,
    TextInput,
    Textarea,
    Switch,
    Stack,
    Group,
    Button,
    Text,
    Divider,
    Paper,
    Select,
    Grid,
    Checkbox, Center, Loader
} from "@mantine/core";
import {useState} from "react";

export function RoleCreateForm({onSubmit, permissionsHandler, apiLoading}) {
    const [roleName, setRoleName] = useState('');
    const [loading, setLoading] = useState(false);
    const [permissions, setPermissions] = useState([]);

    const loadPermissions = async () => {
        if (permissions.length > 0) return;
        setLoading(true);
        const data = await permissionsHandler();
        setPermissions(data);
        setLoading(false);
    };

    return (
        <form onSubmit={onSubmit} target={'create'}>
            <Tabs defaultValue="general">

                <Tabs.List>
                    <Tabs.Tab value="general">General</Tabs.Tab>
                    <Tabs.Tab value="permissions" onClick={loadPermissions}>Permissions</Tabs.Tab>
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

                <Tabs.Panel value="permissions" pt="md" loader>
                    {loading ? (
                        <Center py="xl">
                            <Loader color="blue" type="dots"/>
                        </Center>
                    ) : (
                        <Stack>
                            {permissions.map((module) => (
                                <Paper key={module.name} withBorder p="md" shadow="xs">
                                    <Text fw={600} mb="sm" style={{textTransform: 'capitalize'}}>
                                        {module.name}
                                    </Text>

                                    <Grid>
                                        {module.actions.map((action) => (
                                            <Grid.Col span={3} key={action.uuid}>
                                                <Checkbox
                                                    name="permissions"
                                                    label={action.action}
                                                    value={action.uuid}
                                                    // description={action.description}
                                                />
                                            </Grid.Col>
                                        ))}
                                    </Grid>
                                </Paper>
                            ))}

                            {permissions.length === 0 && !loading && (
                                <Text c="dimmed" ta="center" py="xl">Няма налични права за зареждане.</Text>
                            )}
                        </Stack>
                    )}
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
    )
}