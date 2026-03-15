import {Drawer} from "@mantine/core";

export function CustomDrawer(
    {
        title,
        content,
        opened,
        close
    }
) {

    return (
        <Drawer opened={opened} onClose={close} title={title} position={"right"}>
            {content}
        </Drawer>
    )
}