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
    Stack
} from '@mantine/core';
import {useState} from "react";
import Welcome from "../assets/welcome.svg"
import {useAuth} from "../contexts/AuthProvider.jsx";

const data = [
    {title: 'Users', value: '13,456', diff: 34},
    {title: 'Active users', value: '745', diff: 18},

];

export function Dashboard() {
    const [loading, setLoading] = useState(false);
    const {user} = useAuth();

    const stats = data.map((stat) => {
        return (
            <Paper withBorder p="md" radius="md" key={stat.title} h={220}>
                <Group justify="space-between">
                    <Skeleton visible={loading}>

                        <Text size="xs" c="dimmed">
                            {stat.title}
                        </Text>
                        {/*<Icon className={classes.icon} size={22} stroke={1.5}/>*/}
                    </Skeleton>

                </Group>

                <Group align="flex-end" gap="xs" mt={25}>
                    <Skeleton visible={loading}>
                        <Text>{stat.value}</Text>
                        <Text c={stat.diff > 0 ? 'teal' : 'red'} fz="sm" fw={500}>
                            <span>{stat.diff}%</span>
                        </Text>
                    </Skeleton>

                </Group>

                <Text fz="xs" c="dimmed" mt={7}>
                    <Skeleton visible={loading}>
                        Compared to previous month
                    </Skeleton>

                </Text>
            </Paper>
        )
            ;
    });

    return (

        <>
            <h1>Dashboard</h1>

            <Grid grow gutter="xs" justify="center" align="center">
                <Grid.Col span={2}>
                    <Paper shadow="xl" radius="lg" withBorder p="xl" w={600} h={220}>
                        <Flex
                            mih={50}
                            gap="xs"
                            justify="flex-start"
                            align="center"
                            direction="row"
                            wrap="nowrap"
                        >
                            <Stack>
                                <Title order={2}>
                                    Welcome again,
                                </Title>
                                <Text c="dimmed" size="lg">
                                    {user && user.username}
                                </Text>
                            </Stack>

                            <Image src={Welcome} w={200} ml={60}/>
                        </Flex>
                    </Paper>
                </Grid.Col>
                <Grid.Col span={4}>
                    <SimpleGrid
                        cols={4}
                        justify="center"
                        align="center"
                    >
                        {stats}
                    </SimpleGrid>
                </Grid.Col>
            </Grid>
        </>
    )
}
