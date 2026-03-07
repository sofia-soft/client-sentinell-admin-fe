import {AppShell, Group, Burger} from "@mantine/core";

export function Header() {
    return (
        <AppShell.Header>
            <Group h="100%" px="md">
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
                Header
            </Group>
        </AppShell.Header>
    )
}

