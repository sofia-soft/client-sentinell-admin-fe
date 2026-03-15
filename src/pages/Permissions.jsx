import {PageContentTemplate} from "../components/PageContentTemplate.jsx";
import {PERMISSIONS_HEADER, PERMISSIONS_DATA, BUTTON_VISIBILITY} from "../config/permissionConfig.js";
import {useEffect, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import * as permissionsApi from "../api/permissionsApi.js";
import {Center, Loader, Title} from "@mantine/core";
import {CustomDrawer} from "../components/CustomDrawer.jsx";
import {PermissionUpdateFrom} from "../components/Permissions/PermissionUpdateFrom.jsx";
import {PermissionCreateForm} from "../components/Permissions/PermissionCreateForm.jsx";

export function Permissions() {
    const [permissions, setPermissions] = useState(null);
    const [opened, {open, close}] = useDisclosure(false);
    const [titleDrawer, setTitleDrawer] = useState('');
    const [contentDrawer, setContentDrawer] = useState(<></>);
    const [loader, setLoader] = useState(false);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoader(true);
        setTimeout(() => {

            permissionsApi.listPermissions().then(response => {
                if (response.status === 401) return;

                if (response.status === 200) setPermissions(response.data.data)
            }).catch(console.error)
                .finally(() => setLoader(false));
        }, 2000)
    }, []);


    const handleEdit = (item) => {
        setTitleDrawer('Update permissions');

        setContentDrawer(
            <PermissionUpdateFrom
                permissionData={item}
                // onSubmit={handleSubmitForm}
                apiLoading={loading}

            />
        );
        open();
    };

    const handleCreate = () => {
        setTitleDrawer('Create permission');
        setContentDrawer(
            <PermissionCreateForm
                // onSubmit={handleSubmitForm}
                apiLoading={loading}
            />
        );
        open();
    };

    const handleDelete = async (uuid) => {
        // const response = await rolesAip.deleteRole(uuid);

        let color;
        let title;

        console.log(uuid);
        //
        // if (response.status === 200 || response.status === 204) {
        //
        //     setRoles(prev => prev.filter(row => row.uuid !== uuid));
        //     color = 'green'
        //     title = 'Success'
        // } else {
        //     color = 'red'
        //     title = 'Fail'
        // }
        //
        // notifications.show({
        //     title: title,
        //     message: response.data.data.message,
        //     color: color,
        //     position: "top-right"
        // });
    };


    return (
        loader ?
            <Center style={{position: "fixed", zIndex: 10, top: '50%', left: '50%'}}>
                <Loader color="blue" size="xl" type="dots"/>
            </Center> :
        <>
            <Title order={2}>Permissions</Title>

            <CustomDrawer
                close={close}
                opened={opened}
                title={titleDrawer}
                content={contentDrawer}
            />

            <PageContentTemplate
                tableData={
                    {
                        header: PERMISSIONS_HEADER,
                        rows: permissions,

                    }
                }
                buttonsVisible={BUTTON_VISIBILITY}
                resourceName="permissions"
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCreate={handleCreate}

            />
        </>

    )
}