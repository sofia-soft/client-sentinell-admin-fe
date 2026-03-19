import {
    AppShell,
    Burger,
    Group,
    NavLink,
    Image,
    ActionIcon,
    Text,
    Avatar,
    useMantineColorScheme
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {Outlet, useNavigate} from 'react-router-dom';
import Logo from "../assets/logo.webp"
import {SITE_MENU_ITEMS, SYSTEM_MENU_ITEMS} from "../config/appConfig.js"
import {
    IconBrightnessDown,
    IconMoonFilled,
    IconChartHistogram,
    IconDevices2,
    IconLogout,
    IconWorldCog
} from '@tabler/icons-react';
import {useAuth} from '../contexts/AuthProvider'; // 1. Импортирай useAuth

export function AdminLayout() {
    const {logout, hasPermission} = useAuth();
    const [opened, {toggle}] = useDisclosure();
    const navigate = useNavigate();
    const {colorScheme, setColorScheme} = useMantineColorScheme();

    const handleLogout = async () => {
        await logout();
    };


    const systemFilteredMenu = SYSTEM_MENU_ITEMS.filter(item => {
        if (!item.resource) return true;

        return hasPermission(item.resource, item.action);
    });

    const siteFilteredMenu = SITE_MENU_ITEMS.filter(item => {
        if (!item.resource) return true;

        return hasPermission(item.resource, item.action);
    });

    return (
        <AppShell
            header={{height: 60}}
            navbar={{width: 190, breakpoint: 'sm', collapsed: {mobile: !opened}}}
            padding="md"
            m={50}
        >
            <AppShell.Header>
                <Group h="100%" p={"0 8px"} justify="space-between">
                    <Group h="100%" px="md">
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
                        <Image
                            radius="md"
                            w={160}
                            h={40}
                            src={Logo}
                        />
                    </Group>
                    <Group h="100%" px="md">
                        <ActionIcon
                            variant="transparent"
                            color={colorScheme === 'light' ? "black" : "white"}
                            radius="xl"
                            aria-label="theme"
                            onClick={() =>
                                colorScheme === 'light' ? setColorScheme('dark')
                                    : setColorScheme("light")}>
                            {
                                colorScheme === 'light' ? <IconMoonFilled/> : <IconBrightnessDown stroke={2}/>
                            }
                        </ActionIcon>
                        <Avatar variant="outline" radius="xl" src=""/>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <NavLink
                    label="Dashboard"
                    leftSection={<IconChartHistogram stroke={2}/>}
                    onClick={() => navigate('/')}/>
                <NavLink
                    label="System"
                    leftSection={<IconDevices2 stroke={2}/>}
                >
                    {systemFilteredMenu.map(item => (
                        <NavLink
                            key={item.label}
                            label={item.label}
                            leftSection={<item.icon stroke={2}/>}
                            onClick={() => navigate(item.url)}/>
                    ))}

                </NavLink>
                <NavLink
                    label="Site"
                    leftSection={<IconWorldCog  stroke={2}/>}
                >
                    {siteFilteredMenu.map(item => (
                        <NavLink
                            key={item.label}
                            label={item.label}
                            leftSection={<item.icon stroke={2}/>}
                            onClick={() => navigate(item.url)}/>
                    ))}
                </NavLink>
                {/*<Divider my="md" />*/}
                <NavLink
                    label="Logout"
                    color="red"
                    variant="filled"
                    leftSection={<IconLogout stroke={2}/>}
                    onClick={handleLogout}
                    mt="auto"
                />
                <Text c="dimmed" ta="center">v1.0.0</Text>
            </AppShell.Navbar>

            <AppShell.Main
                style={{minHeight: 'unset'}}
                pb={0}
                pt={50}
            >
                <Outlet/>
            </AppShell.Main>
        </AppShell>
    );
}