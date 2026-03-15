import {useState} from 'react';
import {
    TextInput,
    PasswordInput,
    Select,
    Button,
    Loader,

} from '@mantine/core';
import * as rolesApi from "../../api/rolesApi.js";
import {StatusBadgeToggle} from "./StatusBadgeToggle.jsx";

export function UserCreateForm({onSubmit, apiLoading, updateUserTable}) {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [opened, setOpened] = useState(false);
    const [isActive, setIsActive] = useState(true);

    const fetchRoles = async () => {
        if (roles.length > 0) {
            setOpened(true);
            return;
        }

        setLoading(true);
        try {
            const response = await rolesApi.listRoles();
            if (response.status === 200) {
                const mappedRoles = response.data.data.map((item) => ({
                    value: item.uuid,
                    label: item.name,
                }));
                updateUserTable(prev => [newUser, ...prev]);
                setRoles(mappedRoles);
                setOpened(true);
            }
        } catch (error) {
            console.error("Грешка при зареждане на роли:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <form onSubmit={onSubmit} target={'update'}>
            <TextInput label="Username" name="username" mb="sm"/>
            <PasswordInput label="Password" name="password" mb="sm"/>

            <Select
                label="Role"
                id='role_name'
                name='role'
                data={roles}
                placeholder="Избери роля"
                dropdownOpened={opened}
                onDropdownOpen={fetchRoles}
                onDropdownClose={() => setOpened(false)}
                rightSection={loading ? <Loader size="xs" type="dots"/> : null}
                nothingFoundMessage="Няма намерени роли"
            />

            <StatusBadgeToggle
                key='is_active'
                active={isActive}
                onChange={setIsActive}
            />

            <Button
                type="submit"
                fullWidth
                loading={apiLoading}
            >
                Create
            </Button>
        </form>
    );
};