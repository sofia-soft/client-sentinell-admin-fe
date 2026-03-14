import {Drawer} from "@mantine/core";

export function CustomDrawer(
    {
        title,
        contant,
        opened,
        close
    }
) {

    return (
        <Drawer opened={opened} onClose={close} title={title} position={"right"}>
            {contant}
        </Drawer>
    )
}