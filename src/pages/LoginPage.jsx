import {
    Divider,
    Image,
    TextInput,
    PasswordInput,
    Flex,
    Button,
    Center,
    Card,
    Stack,
    Title
} from '@mantine/core';
import Login from "../assets/login.svg"
import {useForm} from '@mantine/form';
import {useState} from 'react';
import {useAuth} from '../contexts/AuthProvider';
import {notifications} from '@mantine/notifications';


export function LoginPage() {
    const {login} = useAuth();
    const [loading, setLoading] = useState(false);

    const form = useForm({
        mode: 'controlled',
        initialValues: {username: '', password: ''},
        validate: {
            username: (val) => (val.length < 3 ? 'Минимум 3 символа' : null),
            // password: (val) => (val.length < 6 ? 'Минимум 6 символа' : null),
        },
    });

    const handleSubmit = async (values) => {
        setLoading(true);

        try {
            const result = await login({
                username: values.username,
                password: values.password
            });

            if (!result.success) {

                notifications.show({
                    title: `Login message`,
                    message: result.error || "Невалидно потребителско име или парола",
                    position: 'top-right',
                    color: "red"
                })
            }

        } catch (err) {
            console.log(`Exception while doing something: ${err}`);
            notifications.show({
                title: `Login message`,
                message: "Възникна грешка при връзката със сървъра.",
                position: 'top-right',
                color: "red"

            })
        } finally {
            setLoading(false);
        }
    };

    return (
        <Center mih="100vh">
            <Card shadow="md" p={0} radius="lg" withBorder w={{base: '95%', sm: '80%', lg: '60%'}}>
                <Flex direction={{base: 'column', sm: 'row'}}>

                    <Center w={{base: '100%', sm: '40%'}} p="xl" bg="gray.0">
                        <Image src={Login} w="100%"/>
                    </Center>

                    <Divider orientation="vertical" visibleFrom="sm"/>

                    <Stack justify="center" p={40} style={{flex: 1}}>
                        <Title order={2}>Login</Title>
                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            <TextInput
                                label="Username"
                                placeholder="Въведете име"
                                {...form.getInputProps('username')}
                                mb="md"
                            />
                            <PasswordInput
                                label="Password"
                                placeholder="Въведете парола"
                                {...form.getInputProps('password')}
                                mb="xl"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                loading={loading}
                                loaderProps={{type: 'dots'}}
                            >
                                Влез
                            </Button>
                        </form>
                    </Stack>
                </Flex>
            </Card>
        </Center>
    );
}