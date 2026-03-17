import {Table, Badge, Flex, ActionIcon, Box, Image, Text} from '@mantine/core';
import {useAuth} from "../contexts/AuthProvider.jsx";
import {IconPencil, IconTrash} from '@tabler/icons-react';
import Nodata from "../assets/no_data.svg"

export function TableTemplate(
    {
        header,
        rows,
        resourceName,
        onEdit,
        onDelete
    }
) {

    const {hasPermission} = useAuth();
    const actionShow = hasPermission(resourceName, 'update') || hasPermission(resourceName, 'delete');

    const minRows = 10;
    const rowHeight = 50;
    const totalColumns = header.length + 1;
    const isEmpty = rows.length === 0;
    const emptyRowsCount = Math.max(0, minRows - rows.length);

    const renderCell = (item, columnKey, index) => {
        const value = item[columnKey];

        if (columnKey === 'id') return index + 1;

        if (columnKey === 'role') return value['name'];

        if (columnKey === 'status' || columnKey === 'is_active') {
            return (
                <Badge variant="dot" color={value === 1 ? "green" : "red"} w={100}>
                    {value === 1 ? "active" : "inactive"}
                </Badge>
            );
        }

        if (columnKey === 'is_system') {
            return (
                <Badge variant="dot" color={value === 1 ? "green" : "red"} w={80}>
                    {value === 1 ? "yes" : "no"}
                </Badge>
            );
        }

        return value;
    };

    return (
        <Box style={{position: 'relative'}}>
            <Table horizontalSpacing="xl"
                   stickyHeader
                   striped
                   highlightOnHover
                   stickyHeaderOffset={60}
                   withTableBorder
            >
                <Table.Thead>
                    <Table.Tr>
                        {header.map(row => (
                            <Table.Th key={row.key}>{row.value}</Table.Th>
                        ))}
                        {actionShow &&
                            <Table.Th key={'action'}>Action</Table.Th>
                        }
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rows.map((item, idx) => (
                        <Table.Tr key={item.uuid}>
                            {header.map(col => (
                                <Table.Td key={col.key}>
                                    {renderCell(item, col.key, idx)}
                                </Table.Td>


                            ))}
                            {actionShow &&
                                <Table.Td key={'actions-col'} class='actions'>

                                    {
                                        hasPermission(resourceName, 'update') &&
                                        <ActionIcon
                                            variant="transparent"
                                            color="orange"
                                            aria-label="Update"
                                            onClick={() => onEdit?.(item)}
                                        >
                                            <IconPencil stroke={2} color={'orange'}/>
                                        </ActionIcon>
                                    }

                                    {
                                        hasPermission(resourceName, 'delete') &&
                                        <ActionIcon
                                            variant="transparent"
                                            disabled={item.is_system}
                                            color="red"
                                            aria-label="Delete"
                                            onClick={() => onDelete(item.uuid)}
                                        >
                                            <IconTrash stroke={2}/>
                                        </ActionIcon>
                                    }
                                </Table.Td>
                            }
                        </Table.Tr>
                    ))}

                    {isEmpty && (
                        <div class='no-data-section'>
                            <Image src={Nodata}
                                   w={250}/>
                            <Text c="dimmed" mt="sm">Няма намерени данни</Text>
                        </div>
                    )}

                    {Array.from({length: emptyRowsCount}).map((_, index) => (
                        <Table.Tr key={`empty-${index}`} style={{height: `${rowHeight}px`}}>
                            {Array.from({length: totalColumns}).map((_, cellIdx) => (
                                <Table.Td key={`cell-${cellIdx}`}>&nbsp;</Table.Td>
                            ))}
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            < /Table>
        </Box>
    )
}