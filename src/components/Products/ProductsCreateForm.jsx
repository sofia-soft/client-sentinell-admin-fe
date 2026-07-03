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
    Modal,
} from "@mantine/core";
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import {useRef, useState} from "react";

export function ProductsCreateForm({
                                       onSubmit,
                                       apiLoading,
                                       fetchCategories,
                                       categories,
                                       loadingCategories,
                                       openCategoriesDropDown,
                                       setCategoriesDropDown,
                                       handleUploadSubmit
                                   }) {
    const openRef = useRef();

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleDrop = (files) => {
        const newFile = files[0];

        setFile(newFile);
        setModalOpen(true);
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

                            <Textarea
                                name="description_bg"
                                label="Description BG"
                                required
                            />

                            <Textarea
                                name="description_en"
                                label="Description EN"
                                required
                            />

                            <Select
                                name="is_active"
                                label="Status"
                                defaultValue="1"
                                required
                                data={[
                                    {value: "1", label: "Active"},
                                    {value: "0", label: "Inactive"},
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
                            />

                            <NumberInput
                                name="stock_quantity"
                                label="Stock"
                                required
                                allowNegative={false}
                            />
                        </Stack>
                    </Tabs.Panel>
                </Tabs>

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
