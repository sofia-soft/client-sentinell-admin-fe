import {useState} from 'react';
import {TextInput, Select, Button, Loader} from '@mantine/core';
import * as rolesApi from "../../api/rolesApi.js";
import {StatusBadgeToggle} from "./StatusBadgeToggle.jsx";

export function UserUpdateForm({userData, onSubmit, apiLoading}) {
    const [rolesOptions, setRolesOptions] = useState(
        userData.role ? [{value: userData.role.uuid || userData.role, label: userData.role.name || 'Current Role'}] : []
    );
    const [isActive, setIsActive] = useState(userData.is_active);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [dropdownOpened, setDropdownOpened] = useState(false);

    const EXCLUDED_FIELDS = ['uuid', 'permissions'];

    const formatLabel = (key) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const fetchRoles = async () => {
        if (rolesOptions.length > 1) {
            setDropdownOpened(true);
            return;
        }

        setLoadingRoles(true);
        try {
            const response = await rolesApi.listRoles();
            if (response.status === 200) {
                const mapped = response.data.data.map((item) => ({
                    value: item.uuid,
                    label: item.name,
                }));
                setRolesOptions(mapped);
                setDropdownOpened(true);
            }
        } catch (error) {
            console.error("Грешка при зареждане на ролите:", error);
        } finally {
            setLoadingRoles(false);
        }
    };

    return (
        <form onSubmit={onSubmit} target={'update'} name={userData.uuid}>
            {Object.entries(userData).map(([key, value]) => {
                if (EXCLUDED_FIELDS.includes(key)) return null;

                if (key === 'role') {
                    return (
                        <Select
                            key={key}
                            id='role_name'
                            name={key}
                            label="Role"
                            data={rolesOptions}
                            defaultValue={value?.uuid || value}
                            dropdownOpened={dropdownOpened}
                            onDropdownOpen={fetchRoles}
                            onDropdownClose={() => setDropdownOpened(false)}
                            rightSection={loadingRoles ? <Loader size="xs" type="dots"/> : null}
                            mb="sm"
                            clearable
                        />
                    );
                } else if (key === 'is_active') {
                    return (
                        <Select
                            key={'is_active'}
                            id='is_active'
                            name={'is_active'}
                            label="Status"
                            defaultValue={value ? "active" : "inactive"}
                            data={[
                                {value: "active", label: "Active"},
                                {value: "inactive", label: "Inactive"},
                            ]}
                        />
                    );
                }

                return (
                    <TextInput
                        key={key}
                        name={key}
                        label={formatLabel(key)}
                        defaultValue={value ?? ''}
                        mb="sm"
                        disabled={key === 'created_at' || key === 'updated_at' || key === 'username'}
                    />
                );
            })}

            <Button
                type="submit"
                fullWidth mt="md"
                loading={apiLoading}
                loaderProps={{ type: 'dots' }}
            >
                Save
            </Button>
        </form>
    );
};