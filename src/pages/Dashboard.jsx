import {
    Grid,
    SimpleGrid,
    Group,
    Paper,
    Text,
    Skeleton,
    Image,
    Title,
    Flex,
    Stack,
    Center,
    Loader
} from '@mantine/core';
import {useEffect, useState} from "react";
import Welcome from "../assets/welcome.svg"
import {useAuth} from "../contexts/AuthProvider.jsx";
import {dashboard} from "../api/dashboardApi.js";
import {
    IconUsers,
    IconShoppingCart,
    IconUsersGroup,
    IconArrowUpRight,
    IconArrowDownLeft,
    IconMinus
} from '@tabler/icons-react';

const icons = {
    'users': IconUsers,
    'orders': IconShoppingCart,
    'customers': IconUsersGroup
}

export function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [dashboardData, setDashboardData] = useState({})
    const {user} = useAuth();

    useEffect(() => {
        setLoading(true)
        dashboard()
            .then((response) => {
                if (response.status === 200) {
                    setDashboardData(response.data.data)
                }
            }).catch(error => {
            console.log(error)
        }).finally(() => {
            setLoading(false)
        })
    }, []);

    const stats = Object.entries(dashboardData).map(([key, stat]) => {
        const Icon = icons[key];
        const DiffIcon = stat.diff === 0 ? IconMinus : stat.diff > 0 ? IconArrowUpRight
            : IconArrowDownLeft
        return (
            <Paper withBorder p="md" radius="md" key={key} h={240}>
                <Group justify="space-between" mb="sm">
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                        {stat.title}
                    </Text>

                    {Icon && (
                        <div
                            style={{
                                padding: 8,
                                borderRadius: 10,
                                background: "rgba(0,0,0,0.05)",
                            }}
                        >
                            <Icon size={20} stroke={1.5} />
                        </div>
                    )}
                </Group>

                <Text size="34px" fw={700} lh={1}>
                    {stat.total}
                </Text>

                <Text size="xs" c="dimmed" mt={4}>
                    Total overall
                </Text>

                <Group mt="md" gap={6} justify="center" >
                    <Text size="sm" fw={600}>
                        {stat.count}
                    </Text>

                    <Text size="xs" c="dimmed">
                        this month
                    </Text>
                </Group>

                <Group mt="sm" gap={6} align="center" justify="center">
                    {DiffIcon && (
                        <DiffIcon
                            size={18}
                            stroke={1.8}
                            color={stat.diff >= 0 ? "teal" : "red"}
                        />
                    )}

                    <Text
                        fw={600}
                        size="sm"
                        c={stat.diff >= 0 ? "teal" : "red"}
                    >
                        {stat.diff > 0 ? "+" : ""}
                        {stat.diff}%
                    </Text>

                    <Text size="xs" c="dimmed">
                        vs previous month
                    </Text>
                </Group>
            </Paper>
        );
    });

    return (
        loading ?
            <Center style={{position: "fixed", zIndex: 10, top: '50%', left: '50%'}}>
                <Loader color="blue" size="xl" type="dots"/>
            </Center> :
            <>
                <Title order={2} mb="md">Dashboard</Title>

                <Grid grow gutter="xs" justify="center" align="center">
                    <Grid.Col span={{base: 12, lg: 4}}>
                        <Paper shadow="xl" radius="lg" withBorder p="xl" w="100%" mih={220}>
                            <Flex
                                mih={50}
                                gap="xs"
                                justify="space-between"
                                align="center"
                                direction="row"
                                wrap="wrap"
                            >
                                <Stack>
                                    <Title order={2}>
                                        Welcome again,
                                    </Title>
                                    <Text c="dimmed" fw={700} size="xl">
                                        {user?.username}
                                    </Text>
                                </Stack>

                                <Image src={Welcome} w={{base: 120, sm: 200}} visibleFrom="xs"/>
                            </Flex>
                        </Paper>
                    </Grid.Col>
                    <Grid.Col span={{base: 12, lg: 8}}>
                        <SimpleGrid
                            cols={{base: 1, xs: 2, lg: 3}}
                            spacing="xs"
                        >
                            {stats}
                        </SimpleGrid>
                    </Grid.Col>
                </Grid>
            </>
    )
}
