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

export function PermissionCreateForm({onSubmit, apiLoading}) {
    return (
        <form onSubmit={onSubmit} target={'create'}>
            <Tabs defaultValue="general">

                <Tabs.List>
                    <Tabs.Tab value="general">General</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="general" pt="md">
                    <Stack>

                        <Select
                            key={'resource'}
                            id='resource'
                            name={'resource'}
                            label="Resource"
                            placeholder="Select resource"
                            data={[
                                {value: "2255347c-d73a-4e65-9ed3-b50215c12614", label: "Users"},
                                {value: "83ff544c-7f4b-4cd9-a7cc-e2f8deb722d6", label: "Roles"},
                                {value: "07d2d1b3-8d93-4226-911d-9b5ccd42ef2c", label: "Permissions"},
                                {value: "settings", label: "Settings"},
                            ]}
                            required
                        />

                        <Select
                            key={'action'}
                            id='action'
                            name={'action'}
                            label="Action"
                            placeholder="Select action"
                            data={[
                                {value: "create", label: "Create"},
                                {value: "read", label: "Read"},
                                {value: "update", label: "Update"},
                                {value: "delete", label: "Delete"},
                            ]}
                            required
                        />

                        <Textarea
                            key={'description'}
                            id='description'
                            name={'description'}
                            label="Description"
                            placeholder="Describe what this permission allows..."
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

            <Divider my="md"/>

            <Group justify="flex-end">
                <Button
                    type="submit"
                    fullWidth mt="md"
                    loading={apiLoading}
                    loaderProps={{type: 'dots'}}
                >
                    Create Permission
                </Button>

            </Group>
        </form>
    )
}