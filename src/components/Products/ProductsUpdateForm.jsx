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
    Center, Loader, Modal
} from "@mantine/core";
import {useEffect, useRef, useState} from "react";
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import {getLocalizedValue} from "../../utils/utils.js";

const getSiteBase = () => {
    const env = localStorage.getItem("api-env") || "prod";

    const map = {
        PROD: import.meta.env.VITE_SITE_URL_PROD,
        TEST: import.meta.env.VITE_SITE_URL_TEST,
    };

    return map[env] || import.meta.env.VITE_SITE_URL_PROD;
};

export function ProductsUpdateForm({
                                       productData,
                                       onSubmit,
                                       apiLoading,
                                       fetchCategories,
                                       categories,
                                       handleUploadSubmit
                                   }) {

    const openRef = useRef();

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetchCategories()
    }, []);
    const handleDrop = (files) => {
        const newFile = files[0];

        setFile(newFile);
        setModalOpen(true);
    };

    const getImageUrl = (path) => {
        if (!path) return null;

        if (path.startsWith("blob:")) return path;
        if (path.startsWith("http")) return path;

        return `${getSiteBase()}${path}`;
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
            <form onSubmit={onSubmit} target={'update'} name={productData.uuid}>
                <Tabs defaultValue="general">

                    <Tabs.List>
                        <Tabs.Tab value="general">General</Tabs.Tab>
                        <Tabs.Tab value="inventory">Inventory</Tabs.Tab>
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