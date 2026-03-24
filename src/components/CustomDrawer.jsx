import {Drawer} from "@mantine/core";

export function CustomDrawer({
                                 title,
                                 opened,
                                 close,
                                 children
                             }) {
    return (
        <Drawer
            opened={opened}
            onClose={close}
            title={title}
            position="right"
        >
            {children}
        </Drawer>
    );
}