import {
    Button,
    Divider,
    Group,
    NumberInput,
    Paper,
    Select,
    Stack,
    Tabs,
    Text,
    Textarea,
    TextInput,
    Avatar,
    Center, Loader, Modal, Table, ActionIcon
} from "@mantine/core";
import {useEffect, useRef, useState} from "react";
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import {getImageUrl, getLocalizedValue} from "../../utils/utils.js";
import {IconPlus, IconTrash} from "@tabler/icons-react";
import {VariantsEditor} from "./VariantsEditor.jsx";

export function ProductsUpdateForm({
                                       productData,
                                       onSubmit,
                                       apiLoading,
                                       fetchCategories,
                                       fetchProductAttributes,
                                       categories,
                                       productAttributes,
                                       handleUploadSubmit,
                                       products
                                   }) {

    const openRef = useRef();

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [variants, setVariants] = useState([]);
    const [filters, setFilters] = useState(
        Object.entries(productData.filters)?.map(([key, value]) => ({
            id: crypto.randomUUID(),
            key: key,
            value: value[0],
        })) || []
    );
    const [loadingProductsAttributes, setLoadingProductsAttributes] = useState(false);

    const filtersTableConfig = {
        state: filters,
        stateUpdate: setFilters,
        buttonLabel: "filter",
        columnNames: ['Key', 'Value'],
        newObjectTemplate: {
            id: crypto.randomUUID(),
            key: "",
            value: "",
        },
        fields: ['key', 'value']
    }


    useEffect(() => {
        fetchCategories()
    }, []);
    const handleDrop = (files) => {
        const newFile = files[0];

        setFile(newFile);
        setModalOpen(true);
    };

    const addRow = (type) => {
        type.stateUpdate(prev => [
            ...prev,
            type.newObjectTemplate
        ]);
    };

    const removeRow = (type, id) => {
        type.stateUpdate(prev => prev.filter(i => i.id !== id));
    };

    const updateRow = (type, index, field, value) => {
        type.stateUpdate(prev =>
            prev.map(row =>
                row.id === index
                    ? {...row, [field]: value}
                    : row
            )
        );
    };

    const loadProductsAttributes = async () => {
        if (productAttributes.length > 0) return;
        setLoadingProductsAttributes(true);
        await fetchProductAttributes();
        setLoadingProductsAttributes(false);

    };


    const tableTabs = (type) => {

        return (
            <Stack>
                <Group justify="flex-end" mb="md">
                    <Button
                        variant="light"
                        leftSection={<IconPlus size={18}/>}
                        onClick={() => addRow(type)}
                    >
                        Add {type.buttonLabel}
                    </Button>
                </Group>
                <Table striped highlightOnHover>

                    <Table.Thead>
                        <Table.Tr>
                            {type.columnNames.map(name => (
                                <Table.Th key={name} width={220}>{name}</Table.Th>))}
                            <Table.Th width={80}></Table.Th>
                        </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                        {type.state.map((row) => (
                            <Table.Tr key={row.id}>
                                {type.fields.map(field => (
                                    <Table.Td key={field}>
                                        <Group justify="center">
                                            <TextInput
                                                w={130}
                                                size="xs"
                                                radius="md"
                                                value={row[field]}
                                                onChange={(e) =>
                                                    updateRow(
                                                        type,
                                                        row.id,
                                                        field,
                                                        e.currentTarget.value
                                                    )
                                                }
                                            />
                                        </Group>
                                    </Table.Td>
                                ))}
                                <Table.Td>
                                    <ActionIcon
                                        color="red"
                                        variant="light"
                                        onClick={() => removeRow(type, row.id)}
                                        disabled={row.length === 1}
                                    >
                                        <IconTrash size={18}/>
                                    </ActionIcon>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>

            </Stack>)
    }

    return (
        <>
            <Modal
                opened={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Confirm upload image"
            >
                {file && (
                    <img
                        src={URL.createObjectURL(file)}
                        style={{width: "100%", borderRadius: 8}}
                    />
                )}

                <Group mt="md">
                    <Button
                        variant="default"
                        fullWidth
                        onClick={() => setModalOpen(false)}
                    >
                        Откажи
                    </Button>

                    <Button
                        fullWidth
                        onClick={() => {
                            setPreview(URL.createObjectURL(file));
                            setModalOpen(false);

                            handleUploadSubmit(file);
                        }}
                    >
                        Запази
                    </Button>
                </Group>
            </Modal>
            <form onSubmit={onSubmit} target={'update'} name={productData.uuid}>
                <Tabs defaultValue="general">

                    <Tabs.List>
                        <Tabs.Tab value="general">General</Tabs.Tab>
                        <Tabs.Tab value="inventory">Inventory</Tabs.Tab>
                        <Tabs.Tab value="filters">Filters</Tabs.Tab>
                        <Tabs.Tab value="variants" onClick={loadProductsAttributes}>Variants</Tabs.Tab>
                        <Tabs.Tab value="system">System Info</Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="general" pt="md">

                        <Stack>
                            <Dropzone
                                maxSize={5 * 1024 ** 2}
                                accept={IMAGE_MIME_TYPE}
                                openRef={openRef}
                                activateOnClick={false}
                                onDrop={handleDrop}
                            >
                                <Center>
                                    <Avatar
                                        variant="outline"
                                        radius="xl"
                                        size="xl"
                                        src={getImageUrl(preview) || getImageUrl(productData.main_image)}
                                        onClick={() => openRef.current?.()}
                                        style={{
                                            pointerEvents: "all",
                                            cursor: "pointer",
                                        }}
                                    />
                                </Center>
                            </Dropzone>

                            <TextInput
                                key={'name_bg'}
                                id='name_bg'
                                name={'name_bg'}
                                label="Name BG"
                                defaultValue={getLocalizedValue(productData.name, 'bg')}
                                placeholder="Токйо Каруи Глок 17"
                                required
                            />
                            <TextInput
                                key={'name_en'}
                                id='name_en'
                                name={'name_en'}
                                label="Name EN"
                                defaultValue={getLocalizedValue(productData.name, 'en')}
                                placeholder="Tokyo Marui Glock 17"
                                required
                            />
                            <TextInput
                                key={'slug'}
                                id='slug'
                                name={'slug'}
                                label="Slug"
                                placeholder="tokyo-marui-glock-17"
                                required
                                defaultValue={productData?.slug}

                            />

                            <Select
                                key={'category_uuid'}
                                id='category_uuid'
                                name={'category_uuid'}
                                label="Category"
                                data={categories}
                                defaultValue={productData.category.uuid}
                                mb="sm"
                                clearable
                            />

                            <Select
                                key={'parent_uuid'}
                                id='parent_uuid'
                                name={'parent_uuid'}
                                label="Parent"
                                data={products}
                                defaultValue={productData.parent_uuid}
                                mb="sm"
                                clearable
                            />
                            <Select
                                key={'display_mode'}
                                id='display_mode'
                                name={'display_mode'}
                                label="Display Mode"
                                data={['grouped', 'separate']}
                                defaultValue={productData.display_mode}
                                mb="sm"
                                clearable
                            />

                            <Textarea
                                key={'description_bg'}
                                id='description_bg'
                                name={'description_bg'}
                                label="Description BG"
                                placeholder="Японски газов пистолет, блоубек, метален слайд"
                                required
                                defaultValue={getLocalizedValue(productData?.description, 'bg')}

                            />

                            <Textarea
                                key={'description_en'}
                                id='description_en'
                                name={'description_en'}
                                label="Description EN"
                                placeholder="Японски газов пистолет, блоубек, метален слайд"
                                required
                                defaultValue={getLocalizedValue(productData?.description, 'en')}

                            />

                            <Select
                                key={'is_active'}
                                id='is_active'
                                name={'is_active'}
                                label="Status"
                                defaultValue={productData?.is_active ? "active" : "inactive"}
                                data={[
                                    {value: "active", label: "Active"},
                                    {value: "inactive", label: "Inactive"},
                                ]}
                            />

                        </Stack>

                    </Tabs.Panel>
                    <Tabs.Panel value="inventory" pt="md">

                        <Stack>
                            <NumberInput
                                label="Price"
                                id='price'
                                name={'price'}
                                placeholder="10.00 €"
                                decimalScale={2}
                                suffix=" €"
                                allowNegative={false}
                                defaultValue={productData?.price}
                            />
                            <NumberInput
                                label="Stock"
                                id='stock_quantity'
                                name={'stock_quantity'}
                                placeholder="10"
                                allowNegative={false}
                                defaultValue={productData?.stock_quantity}

                            />
                        </Stack>

                    </Tabs.Panel>
                    <Tabs.Panel value="filters" pt="md">
                        {tableTabs(filtersTableConfig)}
                    </Tabs.Panel>
                    <Tabs.Panel value="variants" pt="md">
                        {loadingProductsAttributes ? (
                            <Loader size="xs"/>
                        ) : (
                            <VariantsEditor
                                productAttributes={productAttributes}
                                initialVariants={productData.variants || []}
                                basePrice={productData.price}
                                onChange={setVariants}
                            />
                        )}
                    </Tabs.Panel>
                    <Tabs.Panel value="system" pt="md">

                        <Paper withBorder p="md">
                            <Stack gap="xs">

                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">Created At</Text>
                                    <Text size="sm">{productData?.created_at}</Text>
                                </Group>

                                <Divider/>

                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">Updated At</Text>
                                    <Text size="sm">{productData?.updated_at}</Text>
                                </Group>

                            </Stack>
                        </Paper>

                    </Tabs.Panel>

                </Tabs>
                <input
                    type="hidden"
                    name='filters'
                    value={JSON.stringify(
                        filters.map(({id, ...filter}) => filter)
                    )}
                />
                <input
                    type="hidden"
                    name='variants'
                    value={JSON.stringify(variants)}
                />
                <Group justify="flex-end">
                    <Button
                        type="submit"
                        fullWidth mt="md"
                        loading={apiLoading}
                        loaderProps={{type: 'dots'}}
                    >
                        Save
                    </Button>
                </Group>

            </form>
        </>

    );
}