import {
    Tabs,
    TextInput,
    Textarea,
    Switch,
    Stack,
    Group,
    Button,
    Badge,
    Text,
    Divider,
    Paper
} from "@mantine/core";

export function PermissionUpdateFrom({permissionData,onSubmit,apiLoading})
{
    return (
        <>
            <Tabs defaultValue="general">

                <Tabs.List>
                    <Tabs.Tab value="general">General</Tabs.Tab>
                    <Tabs.Tab value="system">System Info</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="general" pt="md">
                    <Stack>

                        <TextInput
                            label="Resource"
                            placeholder="users"
                            defaultValue={permissionData?.resource}
                            disabled={permissionData?.is_system}
                        />

                        <TextInput
                            label="Action"
                            placeholder="create / read / update / delete"
                            defaultValue={permissionData?.action}
                            disabled={permissionData?.is_system}
                        />

                        <Textarea
                            label="Description"
                            placeholder="Describe what this permission allows..."
                            defaultValue={permissionData?.description}
                        />

                        <Switch
                            label="System Permission"
                            description="System permissions cannot be deleted"
                            checked={permissionData?.is_system}
                            disabled
                        />

                        <Group>
                            <Text size="sm">Permission Type:</Text>

                            {permissionData?.is_system ? (
                                <Badge color="blue">System</Badge>
                            ) : (
                                <Badge color="gray">Custom</Badge>
                            )}

                            {permissionData?.resource && (
                                <Badge color="violet">
                                    {permissionData.resource}:{permissionData.action}
                                </Badge>
                            )}
                        </Group>

                    </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="system" pt="md">

                    <Paper withBorder p="md">
                        <Stack gap="xs">

                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">Created At</Text>
                                <Text size="sm">{permissionData?.created_at}</Text>
                            </Group>

                            <Divider/>

                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">Created By</Text>
                                <Text size="sm">{permissionData?.created_by}</Text>
                            </Group>

                            <Divider/>

                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">Updated By</Text>
                                <Text size="sm">{permissionData?.updated_by}</Text>
                            </Group>

                        </Stack>
                    </Paper>

                </Tabs.Panel>

            </Tabs>

            <Divider my="md"/>

            <Group justify="flex-end">
                <Button fullWidth>
                    Save Changes
                </Button>
            </Group>
        </>
    )
}