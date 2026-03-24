import {
    Tabs,
    TextInput,
    Textarea,
    Select,
    Switch,
    Stack,
    Group,
    Button,
    Badge,
    Text,
    Divider,
    Paper,
    Loader,
    Grid,
    Checkbox,
    Center
} from "@mantine/core";
import {useState} from "react";

export function RoleUpdateForm({roleData, onSubmit, apiLoading, permissionsHandler}) {
    const [loading, setLoading] = useState(false);
    const [permissions, setPermissions] = useState([]);
    const loadPermissions = async () => {
        if (permissions.length > 0) return;
        setLoading(true);
        const data = await permissionsHandler();
        setPermissions(data);
        setLoading(false);
    };

    console.log(roleData)

    return (
        <form onSubmit={onSubmit} target={'update'} name={roleData.uuid}>
            <Tabs defaultValue="general">
                <Tabs.List>
                    <Tabs.Tab value="general">General</Tabs.Tab>
                    <Tabs.Tab value="permissions" onClick={loadPermissions}>Permissions</Tabs.Tab>
                    <Tabs.Tab value="system">System Info</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="general" pt="md">
                    <Stack>

                        <TextInput
                            key={'role_name'}
                            id='role_name'
                            name={'role_name'}
                            label="Role Name"
                            placeholder="Administrator"
                            defaultValue={roleData?.name}
                            disabled={roleData?.system}
                        />

                        <Textarea
                            key={'description'}
                            id='description'
                            name={'description'}
                            label="Description"
                            placeholder="Describe this role..."
                            defaultValue={roleData?.description}
                        />

                        <Select
                            key={'is_active'}
                            id='is_active'
                            name={'is_active'}
                            label="Status"
                            defaultValue={roleData?.is_active ? 'active' : 'inactive'}
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
                            defaultChecked={roleData?.is_system}
                        />

                        <Group>
                            <Text size="sm">Current Status:</Text>

                            {roleData?.is_active ? (
                                <Badge color="green">Active</Badge>
                            ) : (
                                <Badge color="gray">Inactive</Badge>
                            )}

                            {roleData?.is_system && <Badge color="blue">System</Badge>}
                        </Group>

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
                                                    defaultChecked={roleData?.permissions?.some(p => p.uuid === action.uuid)}
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

                <Tabs.Panel value="system" pt="md">

                    <Paper withBorder p="md">
                        <Stack gap="xs">

                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">Created At</Text>
                                <Text size="sm">{roleData?.created_at}</Text>
                            </Group>

                            <Divider/>

                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">Created By</Text>
                                <Text size="sm">{roleData?.created_by}</Text>
                            </Group>

                            <Divider/>

                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">Updated At</Text>
                                <Text size="sm">{roleData?.updated_at}</Text>
                            </Group>

                            <Divider/>

                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">Updated By</Text>
                                <Text size="sm">{roleData?.updated_by}</Text>
                            </Group>

                        </Stack>
                    </Paper>

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
                    Save Changes
                </Button>
            </Group>
        </form>
    );
}

/**
 *
 *
 *
 *
 *
 *
 * Ако искаш още по-професионално
 *
 * Мога да ти покажа и enterprise Roles UI, който има:
 *
 * 🔐 permission inheritance
 *
 * 📊 permission table (view/create/edit/delete columns)
 *
 * 👥 assigned users preview
 *
 * 🕑 audit timeline
 *
 * ⚡ dirty form detection
 *
 * Това е UI като в Stripe / GitHub / Supabase admin панели и става много мощно.
 *
 *
 *
 *
 */