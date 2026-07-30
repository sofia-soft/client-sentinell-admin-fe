import {
    ActionIcon,
    Button, Center,
    Checkbox,
    Divider,
    Group, Select,
    Table,
    Tabs,
    TextInput,
} from "@mantine/core";
import {IconPlus, IconTrash} from "@tabler/icons-react";
import {useState} from "react";
import {getLocalizedValue} from "../../utils/utils.js";

export function ProductsAttributesUpdateForm({
                                                 productAttribute,
                                                 onSubmit,
                                                 apiLoading,
                                             }) {

    const [rows, setRows] = useState(
        productAttribute.attribute_values?.map(value => ({
            uuid: value.product_attribute_value_uuid,
            name_bg: getLocalizedValue(value.product_attribute_value_value, "bg"),
            name_en: getLocalizedValue(value.product_attribute_value_value, "en"),
        })) || []
    );

    const addRow = () => {
        setRows(prev => [
            ...prev,
            {
                uuid: "",
                name_bg: "",
                name_en: "",
            }
        ]);
    };

    const removeRow = (index) => {
        setRows(prev => prev.filter((_, i) => i !== index));
    };

    const updateRow = (index, field, value) => {
        setRows(prev =>
            prev.map((row, i) =>
                i === index
                    ? {...row, [field]: value}
                    : row
            )
        );
    };

    return (
        <form
            onSubmit={onSubmit}
            target="update"
            name={productAttribute.uuid}
        >

            <Tabs defaultValue="general">

                <Tabs.List>
                    <Tabs.Tab value="general">
                        General
                    </Tabs.Tab>

                    <Tabs.Tab value="attribute-values">
                        Attribute values ({rows.length})
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="general" pt="md">

                    <TextInput
                        mb="md"
                        name={"name_bg"}
                        key={'name_bg'}
                        id={'name_bg'}
                        label="Attribute BG"
                        required
                        defaultValue={getLocalizedValue(productAttribute.name, "bg")}
                    />

                    <TextInput
                        mb="md"
                        label="Attribute EN"
                        key={'name_en'}
                        id={'name_en'}
                        name={"name_en"}
                        required
                        defaultValue={getLocalizedValue(productAttribute.name, "en")}
                    />

                    <Select
                        name="is_active"
                        label="Status"
                        required
                        defaultValue={productAttribute?.is_active ? "active" : "inactive"}
                        data={[
                            {value: "active", label: "Active"},
                            {value: "inactive", label: "Inactive"},
                        ]}
                    />

                </Tabs.Panel>

                <Tabs.Panel value="attribute-values" pt="md">
                    <Group justify="flex-end" mb="md">

                        <Button
                            variant="light"
                            leftSection={<IconPlus size={18}/>}
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
                                <Table.Th w={80}></Table.Th>
                            </Table.Tr>

                        </Table.Thead>

                        <Table.Tbody>

                            {rows.map((row, index) => (
                                <Table.Tr key={index}>
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
                                                        index,
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
                                                        index,
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
                                            onClick={() => removeRow(index)}
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
                type="submit"
                fullWidth
                loading={apiLoading}
            >
                Update Attribute
            </Button>

        </form>
    );
}