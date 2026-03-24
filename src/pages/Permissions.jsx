import {PageContentTemplate} from "../components/PageContentTemplate.jsx";
import {PERMISSIONS_HEADER, BUTTON_VISIBILITY} from "../config/permissionConfig.js";
import {useEffect, useState} from "react";
import {notifications} from "@mantine/notifications";
import {useDisclosure} from "@mantine/hooks";
import * as permissionsApi from "../api/permissionsApi.js";
import {Center, Loader, Title} from "@mantine/core";
import {CustomDrawer} from "../components/CustomDrawer.jsx";
import {PermissionUpdateFrom} from "../components/Permissions/PermissionUpdateFrom.jsx";
import {PermissionCreateForm} from "../components/Permissions/PermissionCreateForm.jsx";
import {getErrorMessage} from "../utils/getErrorMessage.js";
import handleSubmitForms from "../utils/handlerSubmitForms.js";
import {updatePermissions} from "../api/permissionsApi.js";

export function Permissions() {
    const [permissions, setPermissions] = useState(null);
    const [opened, {open, close}] = useDisclosure(false);
    const [titleDrawer, setTitleDrawer] = useState('');
    const [drawerType, setDrawerType] = useState(null);
    const [selectedPermission, setSelectedPermission] = useState(null);
    const [loader, setLoader] = useState(false);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoader(true);

        permissionsApi.listPermissions().then(response => {
            if (response.status === 401) return;

            if (response.status === 200) setPermissions(response.data.data)
        }).catch(console.error)
            .finally(() => setLoader(false));
    }, []);



    const handleSubmitForm = async (event) => {
        event.preventDefault();
        const form = event.target;

        setLoading(true);

        const request = await handleSubmitForms(
            form.target === 'update'
                ? permissionsApi.updatePermissions
                : permissionsApi.createPermissions,
            form
        );

        if (request.data) {
            if (form.target === 'update') {
                setPermissions(prev =>
                    prev.map(permission =>
                        permission.uuid === form.name
                            ? request.data.updated_permission
                            : permission
                    )
                );
            } else {
                setPermissions(prev => [request.data.created_permission, ...prev]);
            }
        }

        if (request.notify) {
            notifications.show({
                title: request.notify.title,
                message: request.notify.message,
                color: request.notify.color,
                position: "top-right"
            });
        }

        setLoading(false);

    }

    const handleEdit = (item) => {
        setTitleDrawer('Update permissions');
        setDrawerType('update');
        setSelectedPermission(item);
        open();
    };

    const handleCreate = () => {
        setTitleDrawer('Create permission');
        setDrawerType('create');
        open();
    };

    const handleDelete = async (uuid) => {
        const response = await permissionsApi.deletePermissions(uuid);

        let color;
        let title;
        const dataResponse = response.data;

        if (response.status === 200 || response.status === 204) {

            setPermissions(prev => prev.filter(row => row.uuid !== uuid));
            color = 'green'
            title = 'Success'
        } else {
            color = 'red'
            title = 'Fail'
        }

        notifications.show({
            title: title,
            message: dataResponse.success || response.status === 200 ?
                getErrorMessage(dataResponse.data.code) :
                dataResponse.error.message,
            color: color,
            position: "top-right"
        });
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
                >
                    {drawerType === 'create' && (
                        <PermissionCreateForm
                            onSubmit={handleSubmitForm}
                            // permissionsHandler={permissionsHandler}
                            apiLoading={loading}
                        />
                    )}

                    {drawerType === 'update' && (
                        <PermissionUpdateFrom
                            permissionData={selectedPermission}
                            onSubmit={handleSubmitForm}
                            // permissionsHandler={permissionsHandler}
                            apiLoading={loading}
                        />
                    )}
                </CustomDrawer>

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