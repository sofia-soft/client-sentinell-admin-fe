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

export function Users() {
    const [users, setUsers] = useState(null);
    const [opened, {open, close}] = useDisclosure(false);
    const [titleDrawer, setTitleDrawer] = useState('');
    const [contentDrawer, setContentDrawer] = useState(<></>);
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
        const formData = new FormData(form);


        const data = Object.fromEntries(formData.entries());

        console.log(data)
        setLoading(true);

        let notify;

        if (form.target === 'update') {
            await usersApi.updateUsers(form.name, data).then(
                response => {
                    if (response.status === 200) {
                        notify = {
                            "title": "Success",
                            "color": "green",
                            "message": response.data.data.message
                        }

                        setUsers(prev => prev.map(user =>
                            user.uuid === form.name ? response.data.data.update_user : user
                        ));
                    } else {
                        notify = {
                            "title": "Fail",
                            "color": "red",
                            "message": response.data.data.message
                        }
                    }
                }
            ).catch(console.error)
                .finally(setLoading(false))

            notifications.show({
                title: notify.title,
                message: notify.message,
                color: notify.color,
                position: "top-right"
            });
            return
        }

        await usersApi.createUser(data).then(
            response => {
                if (response.status === 201) {
                    notify = {
                        "title": "Success",
                        "color": "green",
                        "message": response.data.data.message
                    }
                    // setUsers(prev => [newUser, ...prev]);
                } else {
                    notify = {
                        "title": "Fail",
                        "color": "red",
                        "message": response.data.data.message
                    }
                }
            }
        ).catch(console.error)
            .finally(setLoading(false))


    }
    const handleEdit = (item) => {
        setTitleDrawer('Update user');

        setContentDrawer(
            <UserUpdateForm
                userData={item}
                onSubmit={handleSubmitForm}
                apiLoading={loading}

            />
        );
        open();
    };

    const handleCreate = () => {
        setTitleDrawer('Create user');
        setContentDrawer(
            <UserCreateForm
                onSubmit={handleSubmitForm}
                apiLoading={loading}
            />
        );
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

                <CustomDrawer close={close} opened={opened} title={titleDrawer} content={contentDrawer}/>

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