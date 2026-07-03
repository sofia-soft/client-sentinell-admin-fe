import {
    Button,
    Divider,
    Group,
    Loader,
    Rating,
    Select,
    Stack,
    Tabs,
    Textarea,
    Switch
} from "@mantine/core";
import {useState} from "react";


export function ReviewsCreateForm({
                                      onSubmit,
                                      apiLoading,
                                      openCustomersDropDown,
                                      fetchCustomers,
                                      customers,
                                      setCustomersDropDown,
                                      loadingCustomers,
                                      openProductsDropDown,
                                      fetchProducts,
                                      products,
                                      setProductsDropDown,
                                      loadingProducts
                                  }) {

    const [value, setValue] = useState(0);
    const [productUuid, setProdcutUuid] = useState('');

    return (
        <form onSubmit={onSubmit} target={'create'} name={productUuid}>
            <Tabs defaultValue="general">

                <Tabs.List>
                    <Tabs.Tab value="general">General</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="general" pt="md">
                    <Stack>
                        <Select
                            label="Customer"
                            name="user_uuid"
                            data={customers}
                            placeholder="Избери категория"
                            dropdownOpened={openCustomersDropDown}
                            onDropdownOpen={fetchCustomers}
                            onDropdownClose={() => setCustomersDropDown(false)}
                            rightSection={
                                loadingCustomers ? <Loader size="xs"/> : null
                            }
                            required

                        />

                        <Select
                            label="Products"
                            name="product_uui"
                            data={products}
                            placeholder="Избери категория"
                            dropdownOpened={openProductsDropDown}
                            onDropdownOpen={fetchProducts}
                            onDropdownClose={() => setProductsDropDown(false)}
                            rightSection={
                                loadingProducts ? <Loader size="xs"/> : null
                            }
                            required
                            onChange={(value) => setProdcutUuid(value)}

                        />

                        <Group>
                            <div>Rating</div>
                            <Rating
                                name="rating"
                                id="rating"
                                key="rating"
                                value={value}
                                onChange={setValue}
                            />
                        </Group>

                        <Textarea
                            label="Comment"
                            placeholder="Enter your comment here"
                            id={'comment'}
                            name={"comment"}
                            key={'comment'}
                        />
                        <Group>
                            <Switch
                                name="approved"
                                id="approved"
                                key="approved"
                                defaultChecked
                                labelPosition="left"
                                label="Approved"
                            />
                        </Group>

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
                    Create review
                </Button>
            </Group>
        </form>
    );
}