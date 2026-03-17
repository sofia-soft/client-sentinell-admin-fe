import {
    Tabs,
    Textarea,
    Switch,
    Stack,
    Group,
    Button,
    Badge,
    Text,
    Divider,
    Paper,
    Select
} from "@mantine/core";

export function PermissionCreateForm() {
    return (
        <>
            <Tabs defaultValue="general">

                <Tabs.List>
                    <Tabs.Tab value="general">General</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="general" pt="md">
                    <Stack>

                        <Select
                            label="Resource"
                            placeholder="Select resource"
                            data={[
                                { value: "users", label: "Users" },
                                { value: "roles", label: "Roles" },
                                { value: "permissions", label: "Permissions" },
                                { value: "settings", label: "Settings" },
                            ]}
                            required
                        />

                        <Select
                            label="Action"
                            placeholder="Select action"
                            data={[
                                { value: "create", label: "Create" },
                                { value: "read", label: "Read" },
                                { value: "update", label: "Update" },
                                { value: "delete", label: "Delete" },
                            ]}
                            required
                        />

                        <Textarea
                            label="Description"
                            placeholder="Describe what this permission allows..."
                        />

                        <Switch
                            label="System Permission"
                            description="System permissions cannot be deleted"
                        />

                        <Paper withBorder p="sm">
                            <Text size="sm" c="dimmed">
                                Permission Preview
                            </Text>

                            <Badge mt="xs" color="violet">
                                resource:action
                            </Badge>
                        </Paper>

                    </Stack>
                </Tabs.Panel>

            </Tabs>

            <Divider my="md" />

            <Group justify="flex-end">
                <Button fullWidth>
                    Create Permission
                </Button>

            </Group>
        </>
    )
}