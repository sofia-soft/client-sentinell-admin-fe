import {
    Tabs,
    Stack,
    TextInput,
    Textarea,
    NumberInput,
    Button,
    Group,
    Select,
    Center,
    Avatar,
    Loader,
    Modal, Table, ActionIcon,
} from "@mantine/core";
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import {useRef, useState} from "react";
import {IconPlus, IconTrash} from "@tabler/icons-react";
import {VariantsEditor} from "./VariantsEditor.jsx";

export function ProductsCreateForm({
                                       onSubmit,
                                       apiLoading,
                                       fetchCategories,
                                       fetchProductAttributes,
                                       categories,
                                       productAttributes,
                                       loadingCategories,
                                       openCategoriesDropDown,
                                       setCategoriesDropDown,
                                       handleUploadSubmit,
                                       products
                                   }) {
    const openRef = useRef();

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [filters, setFilters] = useState([]);
    const [variants, setVariants] = useState([]);
    const [price, setPrice] = useState('');
    const [loadingProductsAttributes, setLoadingProductsAttributes] = useState(false);

    const loadProductsAttributes = async () => {
        if (productAttributes.length > 0) return;
        setLoadingProductsAttributes(true);
        await fetchProductAttributes();
        setLoadingProductsAttributes(false);
    };

    const handleDrop = (files) => {
        const newFile = files[0];

        setFile(newFile);
        setModalOpen(true);
    };

    const addRow = () => {
        setFilters(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                key: "",
                value: "",
            }
        ]);
    };

    const removeRow = (id) => {
        setFilters(prev => prev.filter(i => i.id !== id));
    };

    const updateRow = (index, field, value) => {
        setFilters(prev =>
            prev.map(row =>
                row.id === index
                    ? {...row, [field]: value}
                    : row
            )
        );
    };

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

            <form onSubmit={onSubmit}>
                <Tabs defaultValue="general">
                    <Tabs.List>
                        <Tabs.Tab value="general">General</Tabs.Tab>
                        <Tabs.Tab value="inventory">Inventory</Tabs.Tab>
                        <Tabs.Tab value="filters">Filters</Tabs.Tab>
                        <Tabs.Tab value="variants" onClick={loadProductsAttributes}>Variants</Tabs.Tab>
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
                                        src={preview}
                                        onClick={() => openRef.current?.()}
                                        style={{
                                            pointerEvents: "all",
                                            cursor: "pointer",
                                        }}
                                    />
                                </Center>
                            </Dropzone>

                            <TextInput
                                name="name_bg"
                                label="Name BG"
                                required
                            />

                            <TextInput
                                name="name_en"
                                label="Name EN"
                                required
                            />

                            <TextInput
                                name="slug"
                                label="Slug"
                                required
                            />

                            <Select
                                label="Category"
                                name="category_uuid"
                                data={categories}
                                placeholder="Избери категория"
                                dropdownOpened={openCategoriesDropDown}
                                onDropdownOpen={fetchCategories}
                                onDropdownClose={() => setCategoriesDropDown(false)}
                                rightSection={
                                    loadingCategories ? <Loader size="xs"/> : null
                                }
                                required

                            />

                            <Select
                                key={'parent_uuid'}
                                id='parent_uuid'
                                name={'parent_uuid'}
                                label="Parent"
                                placeholder="Избери parent"
                                data={products}
                                mb="sm"
                                clearable
                            />
                            <Select
                                key={'display_mode'}
                                id='display_mode'
                                name={'display_mode'}
                                label="Display Mode"
                                data={['grouped', 'separate']}
                                mb="sm"
                                clearable
                            />
                            <Textarea
                                key={'description_bg'}
                                id='description_bg'
                                name={'description_bg'}
                                label="Description BG"
                                required
                            />

                            <Textarea
                                key={'description_en'}
                                id='description_en'
                                name={'description_en'}
                                label="Description EN"
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
                        </Stack>
                    </Tabs.Panel>

                    <Tabs.Panel value="inventory" pt="md">
                        <Stack>
                            <NumberInput
                                name="price"
                                label="Price"
                                decimalScale={2}
                                suffix=" €"
                                required
                                allowNegative={false}
                                value={price}
                                onChange={setPrice}
                            />

                            <NumberInput
                                name="stock_quantity"
                                label="Stock"
                                required
                                allowNegative={false}
                            />
                        </Stack>
                    </Tabs.Panel>
                    <Tabs.Panel value="filters" pt="md">
                        <Stack>
                            <Group justify="flex-end" mb="md">

                                <Button
                                    variant="light"
                                    leftSection={<IconPlus size={18}/>}
                                    onClick={addRow}
                                >
                                    Add filter
                                </Button>

                            </Group>
                            <Table striped highlightOnHover>

                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th width={220}>Key</Table.Th>
                                        <Table.Th width={220}>Value</Table.Th>
                                        <Table.Th width={80}></Table.Th>
                                    </Table.Tr>
                                </Table.Thead>

                                <Table.Tbody>
                                    {filters.map((row) => (
                                        <Table.Tr key={row.id}>
                                            <Table.Td>
                                                <Group justify="center">
                                                    <TextInput
                                                        w={130}
                                                        size="xs"
                                                        radius="md"
                                                        value={row.key}
                                                        onChange={(e) =>
                                                            updateRow(
                                                                row.id,
                                                                "key",
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
                                                        value={row.value}
                                                        onChange={(e) =>
                                                            updateRow(
                                                                row.id,
                                                                "value",
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
                                                    disabled={row.length === 1}
                                                >
                                                    <IconTrash size={18}/>
                                                </ActionIcon>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>

                        </Stack>
                    </Tabs.Panel>
                    <Tabs.Panel value="variants" pt="md">
                        {loadingProductsAttributes ? (
                            <Loader size="xs"/>
                        ) : (
                            <VariantsEditor
                                productAttributes={productAttributes}
                                basePrice={price}
                                onChange={setVariants}
                            />
                        )}
                    </Tabs.Panel>
                </Tabs>
                <input
                    type="hidden"
                    name='filters'
                    value={JSON.stringify(
                        filters.map(({ id, ...filter }) => filter)
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
                        fullWidth
                        mt="md"
                        loading={apiLoading}
                    >
                        Create product
                    </Button>
                </Group>
            </form>
        </>

    );
}
