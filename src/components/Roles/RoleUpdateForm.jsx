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
    Grid,
    Checkbox,
} from "@mantine/core";

export function RoleUpdateForm({ roleData, onSubmit, apiLoading }) {
    const permissions = [
        { name: "Users", actions: ["view", "create", "edit", "delete"] },
        { name: "Roles", actions: ["view", "create", "edit", "delete"] },
        { name: "Settings", actions: ["view", "edit"] },
    ];

    return (
        <>
            <Tabs defaultValue="general">
                <Tabs.List>
                    <Tabs.Tab value="general">General</Tabs.Tab>
                    <Tabs.Tab value="permissions">Permissions</Tabs.Tab>
                    <Tabs.Tab value="system">System Info</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="general" pt="md">
                    <Stack>

                        <TextInput
                            label="Role Name"
                            placeholder="Administrator"
                            defaultValue={roleData?.name}
                            disabled={roleData?.system}
                        />

                        <Textarea
                            label="Description"
                            placeholder="Describe this role..."
                            defaultValue={roleData?.description}
                        />

                        <Select
                            label="Status"
                            defaultValue={roleData?.is_active ? 'active' : 'inactive'}
                            data={[
                                { value: "active", label: "Active" },
                                { value: "inactive", label: "Inactive" },
                            ]}
                        />

                        <Switch
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

                <Tabs.Panel value="permissions" pt="md">
                    <Stack>

                        {permissions.map((module) => (
                            <Paper key={module.name} withBorder p="md">

                                <Text fw={600} mb="sm">
                                    {module.name}
                                </Text>

                                <Grid>
                                    {module.actions.map((action) => (
                                        <Grid.Col span={3} key={action}>
                                            <Checkbox label={action} />
                                        </Grid.Col>
                                    ))}
                                </Grid>

                            </Paper>
                        ))}

                    </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="system" pt="md">

                    <Paper withBorder p="md">
                        <Stack gap="xs">

                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">Created At</Text>
                                <Text size="sm">{roleData?.created_at}</Text>
                            </Group>

                            <Divider />

                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">Created By</Text>
                                <Text size="sm">{roleData?.created_by}</Text>
                            </Group>

                            <Divider />

                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">Updated At</Text>
                                <Text size="sm">{roleData?.updated_at}</Text>
                            </Group>

                            <Divider />

                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">Updated By</Text>
                                <Text size="sm">{roleData?.updated_by}</Text>
                            </Group>

                        </Stack>
                    </Paper>

                </Tabs.Panel>

            </Tabs>

            <Divider my="md" />

            <Group justify="flex-end">
                <Button fullWidth>
                    Save Changes
                </Button>
            </Group>
    </>
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