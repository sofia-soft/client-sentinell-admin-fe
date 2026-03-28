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
    Center
} from "@mantine/core";

export function ProductsUpdateForm({productData, onSubmit, apiLoading}) {
    return (
        <form onSubmit={onSubmit} target={'update'} name={productData.uuid}>
            <Tabs defaultValue="general">

                <Tabs.List>
                    <Tabs.Tab value="general">General</Tabs.Tab>
                    <Tabs.Tab value="inventory">Inventory</Tabs.Tab>
                    <Tabs.Tab value="system">System Info</Tabs.Tab>

                </Tabs.List>
                <Tabs.Panel value="general" pt="md">

                    <Stack>
                        <Center>
                            <Avatar variant="outline" radius="xl" size="xl" src=""/>
                        </Center>
                        <TextInput
                            key={'name'}
                            id='name'
                            name={'name'}
                            label="Name"
                            placeholder="Tokyo Marui Glock 17"
                            required
                            defaultValue={productData?.name}

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

                        <Textarea
                            key={'description'}
                            id='description'
                            name={'description'}
                            label="Description"
                            placeholder="Японски газов пистолет, блоубек, метален слайд"
                            required
                            defaultValue={productData?.description}

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
                            placeholder="10.00 €"
                            decimalScale={2}
                            suffix=" €"
                            allowNegative={false}
                            defaultValue={productData?.price}
                        />
                        <NumberInput
                            label="Stock"
                            placeholder="10"
                            allowNegative={false}
                            defaultValue={productData?.stock_quantity}

                        />

                        <Select
                            key={'in_stock'}
                            id='in_stock'
                            name={'in_stock'}
                            label="In Stock"
                            defaultValue={productData?.in_stock ? "yes" : "no"}
                            data={[
                                {value: "yes", label: "Yes"},
                                {value: "no", label: "No"},
                            ]}
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
                    Create product
                </Button>
            </Group>

        </form>
    );
}