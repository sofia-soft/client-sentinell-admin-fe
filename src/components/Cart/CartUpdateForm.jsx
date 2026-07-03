import {
    Select,
    Loader,
    Paper,
    Text,
    Group,
    Stack,
    Button,
    Divider,
    ActionIcon,
    NumberInput,
} from "@mantine/core";

import * as productApi from "../../api/productsApi.js";
import * as cartApi from "../../api/cartApi.js"
import {useEffect, useState} from "react";
import {notifications} from "@mantine/notifications";

export function CartUpdateForm({
                                   cartData,
                                   onSubmit,
                                   apiLoading,
                                   setCarts
                               }) {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({items: []});
    const [loader, setLoader] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [selected, setSelected] = useState(null);
    const [action, setAction] = useState("");

    useEffect(() => {
        if (!cartData) return;

        const items = cartData.items.map((i) => ({
            uuid: i.product_uuid,
            name: safeParseName(i.product_name),
            price: i.price,
            quantity: i.quantity,
        }));

        setCart({items});
    }, []);

    const safeParseName = (name) => {
        try {
            const parsed = JSON.parse(name);
            return parsed?.en || name;
        } catch {
            return name;
        }
    };

    const fetchProducts = async () => {
        if (products.length > 0) return;

        setLoadingProducts(true);

        try {
            const response = await productApi.listProducts();

            if (response.status === 200) {
                setProducts(response.data.data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingProducts(false);
        }
    };

    const productOptions = products.map((p) => ({
        value: p.uuid,
        label: safeParseName(p.name),
    }));

    const addToCart = (product) => {
        setCart((prev) => {
            const exists = prev.items.find(
                (i) => i.uuid === product.uuid
            );

            if (exists) {
                return {
                    ...prev,
                    items: prev.items.map((i) =>
                        i.uuid === product.uuid
                            ? {...i, quantity: i.quantity + 1}
                            : i
                    ),
                };
            }

            return {
                ...prev,
                items: [
                    ...prev.items,
                    {
                        uuid: product.uuid,
                        name: safeParseName(product.name),
                        price: product.price,
                        quantity: 1,
                    },
                ],
            };
        });
    };

    const updateQty = (uuid, quantity) => {
        if (quantity < 1) return;

        const updatedItem = cart.items.find(item => item.uuid === uuid);

        if (updatedItem.quantity > quantity) {
            setAction("decrease")
        } else {
            setAction("increase")
        }

        setCart((prev) => ({
            ...prev,
            items: prev.items.map((i) =>
                i.uuid === uuid ? {...i, quantity} : i
            ),
        }));


    };

    const removeItem = async (uuid) => {

        const response = await cartApi.removeItem(cartData.uuid, {product_uuid: uuid})
        let title;
        let color

        if (response.status === 200) {
            setCarts(prev =>
                prev.map(cart =>
                    cart.uuid === cartData.uuid
                        ? response.data.data.removed_item
                        : cart
                )
            );
            title = "Success"
            color = "green"

        } else {
            title = "Failed"
            color = "red"
        }

        setCart((prev) => ({
            ...prev,
            items: prev.items.filter((i) => i.uuid !== uuid),
        }));

        notifications.show({
            title: title,
            message: response.data?.data ? response.data?.data.message :  response.data.error.message,
            color: color,
            position: "top-right"
        });
    };

    const total = cart.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
    );

    const handleSelect = (value) => {
        const product = products.find(
            (p) => p.uuid === value
        );

        if (product) {
            addToCart(product);
        }

        setSelected(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit(e, {
            product_uuids: cart.items.map((p) => p.uuid),
            quantities: Object.fromEntries(
                cart.items.map((p) => [p.uuid, p.quantity])
            ),
            action: action
        });
    };

    return (
        <form onSubmit={handleSubmit} target={'update'} name={cartData.uuid}>
            <Select
                label="Product"
                placeholder="Добави продукт"
                data={productOptions}
                value={selected}
                onChange={handleSelect}
                onDropdownOpen={fetchProducts}
                searchable
                nothingFoundMessage="Няма продукти"
                rightSection={
                    loadingProducts ? (
                        <Loader size="xs" type="dots"/>
                    ) : null
                }
            />

            <Paper mt="md" withBorder p="md" radius="md">

                <Text fw={600}>Cart</Text>

                <Divider my="sm"/>

                <Stack gap="sm">

                    {cart.items.length === 0 && (
                        <Text c="dimmed" ta="center">
                            Empty cart
                        </Text>
                    )}

                    {cart.items.map((item) => (
                        <Group key={item.uuid} justify="space-between">
                            <Stack gap={0}>
                                <Text size="sm">{item.name}</Text>
                                <Text size="xs" c="dimmed">
                                    {item.price.toFixed(2)}
                                </Text>
                            </Stack>

                            <Group gap={5}>
                                <NumberInput
                                    value={item.quantity}
                                    onChange={(v) =>
                                        updateQty(
                                            item.uuid,
                                            Number(v)
                                        )

                                    }
                                    w={60}
                                    min={1}
                                />
                                <ActionIcon
                                    color="red"
                                    onClick={() =>
                                        removeItem(item.uuid)
                                    }
                                >
                                    ✕
                                </ActionIcon>
                            </Group>
                        </Group>
                    ))}

                </Stack>

                <Divider my="md"/>

                <Group justify="space-between">
                    <Text fw={700}>Total</Text>
                    <Text fw={700}>
                        {total.toFixed(2)}
                    </Text>
                </Group>

                <Button
                    type="submit"
                    fullWidth
                    mt="md"
                    loading={apiLoading}
                    disabled={!cart.items.length}
                >
                    Update Cart
                </Button>

            </Paper>

        </form>
    );
}