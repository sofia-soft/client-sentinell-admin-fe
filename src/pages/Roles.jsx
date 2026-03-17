import {PageContentTemplate} from "../components/PageContentTemplate.jsx";
import {ROLES_HEADER, BUTTON_VISIBILITY} from "../config/rolesConfig.js";
import {useEffect, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import * as rolesAip from "../api/rolesApi.js";
import * as permissionsApi from "../api/permissionsApi.js";
import {Center, Loader, Title} from "@mantine/core";
import {CustomDrawer} from "../components/CustomDrawer.jsx";
import {notifications} from "@mantine/notifications";
import {RoleUpdateForm} from "../components/Roles/RoleUpdateForm.jsx";
import {RoleCreateForm} from "../components/Roles/RoleCreateForm.jsx";

export function Roles() {
    const [roles, setRoles] = useState(null);
    const [opened, {open, close}] = useDisclosure(false);
    const [titleDrawer, setTitleDrawer] = useState('');

    const [drawerType, setDrawerType] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);

    const [loader, setLoader] = useState(false);
    const [loading, setLoading] = useState(false);
    const [permissions, setPermissions] = useState([]);


    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoader(true);
        rolesAip.listRoles().then(response => {
            if (response.status === 401) return;

            if (response.status === 200) setRoles(response.data.data)
        }).catch(console.error)
            .finally(() => setLoader(false));
    }, []);

    const transformPermissions = (data) => {
        const grouped = {};

        data.forEach((perm) => {
            if (!grouped[perm.resource]) {
                grouped[perm.resource] = {
                    name: perm.resource,
                    actions: []
                };
            }

            grouped[perm.resource].actions.push({
                uuid: perm.uuid,
                action: perm.action,
                description: perm.description,
                is_system: perm.is_system
            });
        });

        return Object.values(grouped);
    };

    const permissionsHandler = async () => {
        try {
            const response = await permissionsApi.listPermissions();
            if (response.status === 200) {
                return transformPermissions(response.data.data);

            }
        } catch (error) {
            console.error(error);
        }
        return [];
    };

    const handleEdit = (item) => {
        setDrawerType('update');
        setSelectedRole(item);
        setTitleDrawer('Update role');
        open();
    };

    const handleCreate = () => {
        setDrawerType('create');
        setTitleDrawer('Create role');
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

                <Title order={2}>Roles</Title>

                <CustomDrawer
                    close={close}
                    opened={opened}
                    title={titleDrawer}
                    content={
                        drawerType === 'update' ? (
                            <RoleUpdateForm
                                roleData={selectedRole}
                                permissionsHandler={permissionsHandler}
                            />
                        ) : (
                            <RoleCreateForm
                                permissionsHandler={permissionsHandler}
                            />
                        )
                    }
                />

                <PageContentTemplate
                    tableData={
                        {
                            header: ROLES_HEADER,
                            rows: roles,
                        }
                    }
                    buttonsVisible={BUTTON_VISIBILITY}
                    resourceName="roles"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onCreate={handleCreate}
                />
            </>
    )

}