import {Drawer} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";

export function CustomDrawer({
                                 title,
                                 opened,
                                 close,
                                 children
                             }) {
    const isMobile = useMediaQuery('(max-width: 48em)');

    return (
        <Drawer
            opened={opened}
            onClose={close}
            title={title}
            position="right"
            size={isMobile ? '100%' : 'md'}
        >
            {children}
        </Drawer>
    );
}