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
    Avatar
} from "@mantine/core";
// import {useRef} from 'react';
// import {Dropzone} from '@mantine/dropzone';

export function ProductsCreateForm({onSubmit, apiLoading}) {
    return (
        <form onSubmit={onSubmit} target={'create'}>
            <Tabs defaultValue="general">

                <Tabs.List>
                    <Tabs.Tab value="general">General</Tabs.Tab>
                    <Tabs.Tab value="inventory">Inventory</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="general" pt="md">

                    <Stack>
                        {/*<Dropzone openRef={openRef} onDrop={() => {*/}
                        {/*}} activateOnClick={false}>*/}
                            <Center>
                                <Avatar variant="outline" radius="xl" size="xl" src=""/>
                            </Center>
                        {/*</Dropzone>*/}
                        <TextInput
                            key={'name'}
                            id='name'
                            name={'name'}
                            label="Name"
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
                        />

                        <Textarea
                            key={'description'}
                            id='description'
                            name={'description'}
                            label="Description"
                            placeholder="Японски газов пистолет, блоубек, метален слайд"
                            required
                        />

                        <Select
                            key={'is_active'}
                            id='is_active'
                            name={'is_active'}
                            label="Status"
                            defaultValue="active"
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
                        />
                        <NumberInput
                            label="Stock"
                            placeholder="10"
                            allowNegative={false}
                        />
                    </Stack>
                    <Select
                        key={'in_stock'}
                        id='in_stock'
                        name={'in_stock'}
                        label="In Stock"
                        defaultValue={'yes'}
                        data={[
                            {value: "yes", label: "Yes"},
                            {value: "no", label: "No"},
                        ]}
                    />
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