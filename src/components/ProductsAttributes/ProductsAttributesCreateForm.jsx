import {
    ActionIcon,
    Button, Center,
    Checkbox,
    Divider,
    Group, Select,
    Table,
    Tabs,
    TextInput
} from "@mantine/core";
import {IconPlus, IconTrash} from "@tabler/icons-react";
import {useState} from "react";

export function ProductsAttributesCreateForm({
                                                 onSubmit,
                                                 apiLoading,
                                             }) {

    const [rows, setRows] = useState([]);

    const addRow = () => {
        setRows(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                name_bg: "",
                name_en: "",
            }
        ]);
    };

    const removeRow = (id) => {
        setRows(prev => prev.filter(x => x.id !== id));
    };

    const updateRow = (id, field, value) => {
        setRows(prev =>
            prev.map(x =>
                x.id === id
                    ? {...x, [field]: value}
                    : x
            )
        );
    };

    return (
        <form onSubmit={onSubmit}>

            <Tabs defaultValue="general">

                <Tabs.List>
                    <Tabs.Tab value="general">
                        General
                    </Tabs.Tab>

                    <Tabs.Tab value="attribute-values">
                        Attribute values
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="general" pt="md">

                    <TextInput
                        mb="md"
                        name={"name_bg"}
                        key={'name_bg'}
                        id={'name_bg'}
                        label="Attribute BG"
                        placeholder="Цвят"
                        required
                    />

                    <TextInput
                        label="Attribute EN"
                        key={'name_en'}
                        id={'name_en'}
                        name={"name_en"}
                        placeholder="Color"
                        required
                    />
                    <Select
                        name="is_active"
                        label="Status"
                        defaultValue="inactive"
                        required
                        data={[
                            {value: "active", label: "Active"},
                            {value: "inactive", label: "Inactive"},
                        ]}
                    />

                </Tabs.Panel>

                <Tabs.Panel value="attribute-values" pt="md">

                    <Group justify="space-between" mb="md">

                        <div/>

                        <Button
                            leftSection={<IconPlus size={18}/>}
                            variant="light"
                            onClick={addRow}
                        >
                            Add value
                        </Button>

                    </Group>

                    <Table striped highlightOnHover>

                        <Table.Thead>

                            <Table.Tr>
                                <Table.Th width={220}>BG</Table.Th>
                                <Table.Th width={220}>EN</Table.Th>
                                <Table.Th width={80}></Table.Th>
                            </Table.Tr>

                        </Table.Thead>

                        <Table.Tbody>

                            {rows.map((row, index) => (
                                <Table.Tr key={row.id}>
                                    <Table.Td>
                                        <Group justify="center">
                                            <TextInput
                                                w={130}
                                                size="xs"
                                                radius="md"
                                                required
                                                value={row.name_bg}
                                                onChange={(e) =>
                                                    updateRow(
                                                        row.id,
                                                        "name_bg",
                                                        e.currentTarget.value
                                                    )
                                                }
                                            />
                                        </Group>
                                    </Table.Td>
                                    <Table.Td>
                                        <Group justify="center">
                                            <TextInput
                                                w={130}
                                                size="xs"
                                                radius="md"
                                                required
                                                value={row.name_en}
                                                onChange={(e) =>
                                                    updateRow(
                                                        row.id,
                                                        "name_en",
                                                        e.currentTarget.value
                                                    )
                                                }
                                            />
                                        </Group>
                                    </Table.Td>
                                    <Table.Td>
                                        <ActionIcon
                                            color="red"
                                            variant="light"
                                            onClick={() => removeRow(row.id)}
                                        >
                                            <IconTrash size={18}/>
                                        </ActionIcon>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Tabs.Panel>
            </Tabs>
            <input
                type="hidden"
                name='attribute_values'
                value={JSON.stringify(
                    rows.map(({id, ...row}) => row)
                )}
            />
            <Divider my="lg"/>

            <Button
                fullWidth
                type="submit"
                loading={apiLoading}
            >
                Create attribute
            </Button>

        </form>
    );
}