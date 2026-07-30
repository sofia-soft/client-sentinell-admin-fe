import {
    ActionIcon,
    Avatar,
    FileButton,
    Group,
    MultiSelect,
    NumberInput,
    Stack,
    Switch,
    Table,
    Text,
} from "@mantine/core";
import {IconUpload, IconX} from "@tabler/icons-react";
import {useEffect, useRef, useState} from "react";
import {notifications} from "@mantine/notifications";
import {getImageUrl} from "../../utils/utils.js";
import {uploadProductImage} from "../../api/productsApi.js";

const comboKey = (uuids) => [...uuids].sort((a, b) => a.localeCompare(b)).join("|");

const cartesian = (arrays) =>
    arrays.reduce((acc, curr) => acc.flatMap((a) => curr.map((c) => [...a, c])), [[]]);

const buildValueToAttributeMap = (productAttributes) => {
    const map = {};
    productAttributes.forEach((attr) => {
        attr.values.forEach((v) => {
            map[v.value] = attr.value;
        });
    });
    return map;
};

const deriveInitialSelection = (productAttributes, initialVariants) => {
    const valueToAttr = buildValueToAttributeMap(productAttributes);
    const selection = {};
    productAttributes.forEach((attr) => {
        selection[attr.value] = new Set();
    });

    initialVariants.forEach((variant) => {
        (variant.attribute_value_uuids || []).forEach((uuid) => {
            const attrUuid = valueToAttr[uuid];
            if (attrUuid) selection[attrUuid]?.add(uuid);
        });
    });

    const result = {};
    Object.entries(selection).forEach(([attrUuid, set]) => {
        result[attrUuid] = Array.from(set);
    });
    return result;
};

const buildInitialRows = (initialVariants) =>
    initialVariants.map((variant) => ({
        id: comboKey(variant.attribute_value_uuids || []),
        attribute_value_uuids: variant.attribute_value_uuids || [],
        price: variant.price ?? '',
        stock_quantity: variant.stock_quantity ?? 0,
        image: variant.image ?? null,
        is_active: variant.is_active ?? true,
    }));

export function VariantsEditor({productAttributes, initialVariants = [], basePrice, onChange}) {
    const [selectedValues, setSelectedValues] = useState({});
    const [rows, setRows] = useState([]);
    const initializedRef = useRef(false);

    const initialRowsByIdRef = useRef(null);
    if (initialRowsByIdRef.current === null) {
        initialRowsByIdRef.current = new Map(buildInitialRows(initialVariants).map((row) => [row.id, row]));
    }

    const labelByUuid = {};
    productAttributes.forEach((attr) =>
        attr.values.forEach((v) => {
            labelByUuid[v.value] = v.label;
        })
    );

    useEffect(() => {
        if (initializedRef.current || productAttributes.length === 0) return;

        initializedRef.current = true;
        setSelectedValues(deriveInitialSelection(productAttributes, initialVariants));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productAttributes]);

    useEffect(() => {
        const attrsWithSelection = productAttributes
            .map((attr) => ({attr, selected: selectedValues[attr.value] || []}))
            .filter((x) => x.selected.length > 0);

        if (attrsWithSelection.length === 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setRows([]);
            return;
        }

        const combos = cartesian(attrsWithSelection.map((x) => x.selected));

        setRows((prev) => {
            const prevById = new Map(prev.map((r) => [r.id, r]));
            return combos.map((comboUuids) => {
                const id = comboKey(comboUuids);
                return (
                    prevById.get(id) ||
                    initialRowsByIdRef.current.get(id) || {
                        id,
                        attribute_value_uuids: comboUuids,
                        price: "",
                        stock_quantity: 0,
                        image: null,
                        is_active: true,
                    }
                );
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(selectedValues), productAttributes]);

    useEffect(() => {
        onChange(rows.map(({id, price, ...variant}) => ({
            ...variant,
            price: price === '' || price === null || price === undefined ? basePrice : price,
        })));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows, basePrice]);

    const handleSelectionChange = (attrUuid, values) => {
        setSelectedValues((prev) => ({...prev, [attrUuid]: values}));
    };

    const updateRow = (id, field, value) => {
        setRows((prev) => prev.map((row) => (row.id === id ? {...row, [field]: value} : row)));
    };

    const handleImageSelect = async (id, file) => {
        if (!file) return;

        const preview = URL.createObjectURL(file);
        updateRow(id, "preview", preview);
        updateRow(id, "uploading", true);

        try {
            const formData = new FormData();
            formData.append("image", file);
            const response = await uploadProductImage(formData);

            if (response.status === 200) {
                updateRow(id, "image", response.data.data.path);
            } else {
                notifications.show({
                    title: "Fail",
                    message: "Неуспешно качване на снимка",
                    color: "red",
                    position: "top-right",
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            updateRow(id, "uploading", false);
        }
    };

    if (productAttributes.length === 0) {
        return <Text c="dimmed" ta="center" py="xl">Няма налични атрибути за създаване на варианти.</Text>;
    }

    return (
        <Stack>
            {productAttributes.map((attr) => (
                <MultiSelect
                    key={attr.value}
                    label={attr.label}
                    placeholder={`Избери ${attr.label}`}
                    data={attr.values}
                    searchable
                    value={selectedValues[attr.value] || []}
                    onChange={(values) => handleSelectionChange(attr.value, values)}
                />
            ))}

            {rows.length === 0 ? (
                <Text c="dimmed" ta="center" py="xl">
                    Избери поне по една стойност от атрибутите по-горе, за да се генерират варианти.
                </Text>
            ) : (
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Вариант</Table.Th>
                            <Table.Th w={140}>Цена</Table.Th>
                            <Table.Th w={110}>Наличност</Table.Th>
                            <Table.Th w={90}>Снимка</Table.Th>
                            <Table.Th w={80}>Активен</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {rows.map((row) => (
                            <Table.Tr key={row.id}>
                                <Table.Td>
                                    {row.attribute_value_uuids.map((u) => labelByUuid[u]).join(" / ")}
                                </Table.Td>
                                <Table.Td >
                                    <NumberInput
                                        width={50}
                                        size="xs"
                                        placeholder={basePrice ? `${basePrice} €` : "по подразбиране"}
                                        decimalScale={2}
                                        suffix=" €"
                                        allowNegative={false}
                                        value={row.price === '' ? basePrice : row.price}
                                        onChange={(value) => updateRow(row.id, "price", value)}
                                    />
                                </Table.Td>
                                <Table.Td>
                                    <NumberInput
                                        width={50}
                                        size="xs"
                                        allowNegative={false}
                                        value={row.stock_quantity}
                                        onChange={(value) => updateRow(row.id, "stock_quantity", value)}
                                    />
                                </Table.Td>
                                <Table.Td>
                                    <Group gap={4} justify="center" wrap="nowrap">
                                        <Avatar
                                            src={row.preview || getImageUrl(row.image)}
                                            radius="sm"
                                            size="sm"
                                        />
                                        <FileButton
                                            onChange={(file) => handleImageSelect(row.id, file)}
                                            accept="image/png,image/jpeg,image/webp,image/gif"
                                        >
                                            {(props) => (
                                                <ActionIcon variant="light" loading={row.uploading} {...props}>
                                                    <IconUpload size={16}/>
                                                </ActionIcon>
                                            )}
                                        </FileButton>
                                        {row.image && (
                                            <ActionIcon
                                                variant="subtle"
                                                color="red"
                                                onClick={() => updateRow(row.id, "image", null)}
                                            >
                                                <IconX size={14}/>
                                            </ActionIcon>
                                        )}
                                    </Group>
                                </Table.Td>
                                <Table.Td>
                                    <Switch
                                        checked={row.is_active}
                                        onChange={(event) =>
                                            updateRow(row.id, "is_active", event.currentTarget.checked)
                                        }
                                    />
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            )}
        </Stack>
    );
}