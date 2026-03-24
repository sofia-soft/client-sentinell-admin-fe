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

export function UserCreateForm({onSubmit, apiLoading}) {
    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [opened, setOpened] = useState(false);
    const [isActive, setIsActive] = useState(true);


    const fetchRoles = async () => {
        if (roles.length > 0) {
            setOpened(true);
            return;
        }

        setLoadingRoles(true);
        try {
            const response = await rolesApi.listRoles();
            if (response.status === 200) {
                const mappedRoles = response.data.data.map((item) => ({
                    value: item.uuid,
                    label: item.name,
                }));
                setRoles(mappedRoles);
                setOpened(true);
            }
        } catch (error) {
            console.error("Грешка при зареждане на роли:", error);
        } finally {
            setLoadingRoles(false);
        }
    };


    return (
        <form onSubmit={onSubmit} target={'create'}>
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
                rightSection={loadingRoles ? <Loader size="xs" type="dots"/> : null}
                nothingFoundMessage="Няма намерени роли"
            />

            <Select
                key={'is_active'}
                id='is_active'
                name={'is_active'}
                label="Status"
                defaultValue="active"
                data={[
                    {value: "active", label: "Active"},
                    {value: "inactive", label: "Inactive"},
                ]}
            />

            <Button
                mt={20}
                type="submit"
                fullWidth
                loading={apiLoading}
                loaderProps={{ type: 'dots' }}
            >
                Create
            </Button>
        </form>
    );
};