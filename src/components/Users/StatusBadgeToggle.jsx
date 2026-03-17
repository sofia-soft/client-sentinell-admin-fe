import {
    Badge, UnstyledButton, Group, Text
} from '@mantine/core';
import {IconCheck, IconX} from '@tabler/icons-react';

export function StatusBadgeToggle({active, onChange}) {
    return (<Group justify="space-between" mb="sm" mt="xs">
            <Text size="sm" fw={500}>Account Status</Text>
            <UnstyledButton onClick={() => onChange(!active)}>
                <Badge
                    size="lg"
                    variant="light"
                    color={active ? 'lime' : 'red'}
                    leftSection={active ? <IconCheck size={12} stroke={3}/> : <IconX size={12} stroke={3}/>}
                    style={{
                        cursor: 'pointer', transition: 'transform 0.1s ease',
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {active ? 'Active' : 'Disabled'}
                </Badge>
            </UnstyledButton>
            <input type="hidden" name="is_active" value={active}/>
        </Group>);
};