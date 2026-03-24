import {PageContentTemplate} from "../components/PageContentTemplate.jsx";
import {BUTTON_VISIBILITY, USER_HEADER} from "../config/usersConfig.js"
import * as usersApi from '../api/usersApi.js';
import {useEffect, useState} from "react";
import {useDisclosure} from '@mantine/hooks';
import {CustomDrawer} from "../components/CustomDrawer.jsx";
import {Center, Loader, Title} from "@mantine/core";
import {UserCreateForm} from "../components/Users/UserCreateForm.jsx";
import {UserUpdateForm} from "../components/Users/UserUpdateForm.jsx";
import {notifications} from '@mantine/notifications';
import handleSubmitForms from "../utils/handlerSubmitForms.js"

export function Users() {
    const [users, setUsers] = useState(null);
    const [opened, {open, close}] = useDisclosure(false);
    const [titleDrawer, setTitleDrawer] = useState('');
    const [drawerType, setDrawerType] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loader, setLoader] = useState(false);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoader(true);

        usersApi.listUsers().then(response => {
            if (response.status === 401) return;

            if (response.status === 200) setUsers(response.data.data)
        }).catch(console.error)
            .finally(() => setLoader(false));
    }, []);


    const handleSubmitForm = async (event) => {
        event.preventDefault();
        const form = event.target;

        setLoading(true);

        const request = await handleSubmitForms(
            form.target === 'update'
                ? usersApi.updateUsers
                : usersApi.createUser,
            form
        );

        if (request.data) {
            if (form.target === 'update') {
                setUsers(prev =>
                    prev.map(user =>
                        user.uuid === form.name
                            ? request.data.updated_user
                            : user
                    )
                );
            } else {
                setUsers(prev => [request.data.created_user, ...prev]);
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
        setTitleDrawer('Update user');
        setDrawerType('update');
        setSelectedUser(item);
        open();
    };

    const handleCreate = () => {
        setTitleDrawer('Create user');
        setDrawerType('create');
        open();
    };

    const handleDelete = async (uuid) => {
        const response = await usersApi.deleteUser(uuid);
        let color;
        let title;


        if (response.status === 200 || response.status === 204) {

            setUsers(prev => prev.filter(row => row.uuid !== uuid));
            color = 'green'
            title = 'Success'
        } else {
            color = 'red'
            title = 'Fail'
        }

        notifications.show({
            title: title,
            message: response.data.data.message,
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
                <Title order={2}>Users</Title>

                <CustomDrawer
                    close={close}
                    opened={opened}
                    title={titleDrawer}
                >
                    {drawerType === 'create' && (
                        <UserCreateForm
                            onSubmit={handleSubmitForm}
                            apiLoading={loading}
                        />
                    )}

                    {drawerType === 'update' && (
                        <UserUpdateForm
                            userData={selectedUser}
                            onSubmit={handleSubmitForm}
                            apiLoading={loading}
                        />
                    )}
                </CustomDrawer>

                {users && <PageContentTemplate
                    tableData={{header: USER_HEADER, rows: users}}
                    buttonsVisible={BUTTON_VISIBILITY}
                    resourceName="users"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onCreate={handleCreate}
                />
                }
            </>
    );
}