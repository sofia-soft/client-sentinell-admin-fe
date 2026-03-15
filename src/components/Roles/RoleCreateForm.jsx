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
    Checkbox
} from "@mantine/core";

export function RoleCreateForm({permissions}) {

    console.log(permissions)

    return (
        <>
            <Tabs defaultValue="general">

                <Tabs.List>
                    <Tabs.Tab value="general">General</Tabs.Tab>
                    <Tabs.Tab value="permissions">Permissions</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="general" pt="md">
                    <Stack>

                        <TextInput
                            label="Role Name"
                            placeholder="Administrator"
                            required
                        />

                        <Textarea
                            label="Description"
                            placeholder="Describe what this role can do..."
                        />

                        <Select
                            label="Status"
                            defaultValue="active"
                            data={[
                                { value: "active", label: "Active" },
                                { value: "inactive", label: "Inactive" },
                            ]}
                        />

                        <Switch
                            label="System Role"
                            description="System roles cannot be deleted"
                        />

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

            </Tabs>

            <Divider my="md" />

            <Group justify="flex-end">
                <Button fullWidth>
                    Create Role
                </Button>
            </Group>
        </>
    )
}