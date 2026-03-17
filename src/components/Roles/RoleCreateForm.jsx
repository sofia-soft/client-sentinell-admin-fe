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

export function RoleCreateForm() {
    const [roleName, setRoleName] = useState('');

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
                            value={roleName}
                            onChange={(event) => setRoleName(event.currentTarget.value)}
                        />

                        <Textarea
                            label="Description"
                            placeholder="Describe what this role can do..."
                        />

                        <Select
                            label="Status"
                            defaultValue="active"
                            data={[
                                {value: "active", label: "Active"},
                                {value: "inactive", label: "Inactive"},
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
                        <Paper key={roleName || "empty-name"} withBorder p="md" shadow="xs">
                            <Text fw={600} mb="sm" style={{textTransform: 'capitalize'}}>
                                {roleName ||  <Text c="dimmed">Enter role name</Text>}
                            </Text>

                            <Grid justify="center" align="center">
                                <Grid.Col span={3} key={'permissions-create'}>
                                    <Checkbox
                                        label={"create"}
                                        // description={action.description}
                                    />
                                </Grid.Col>
                                <Grid.Col span={3} key={'permissions-update'}>
                                    <Checkbox
                                        label={"update"}
                                        // description={action.description}
                                    />
                                </Grid.Col>
                                <Grid.Col span={3} key={'permissions-view'}>
                                    <Checkbox
                                        label={"view"}
                                        // description={action.description}
                                    />
                                </Grid.Col>
                                <Grid.Col span={3} key={'permissions-delete'}>
                                    <Checkbox
                                        label={"delete"}
                                        // description={action.description}
                                    />
                                </Grid.Col>
                            </Grid>
                        </Paper>
                    </Stack>

                </Tabs.Panel>

            </Tabs>

            <Divider my="md"/>

            <Group justify="flex-end">
                <Button fullWidth>
                    Create Role
                </Button>
            </Group>
        </>
    )
}