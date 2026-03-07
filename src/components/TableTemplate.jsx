import {Table, Badge} from '@mantine/core';

export function TableTemplate(
    {
        header,
        rows
    }
) {

    const renderCell = (item, columnKey, index) => {
        const value = item[columnKey];

        if (columnKey === 'id') return index + 1;

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
                    <Table.Th key={'action'}>Action</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {rows.map((item, idx) => (
                    <Table.Tr key={`${Object.keys(item)[0]}-${idx + 1}`}>
                        {header.map(col => (
                            <Table.Td key={col.key}>
                                {renderCell(item, col.key, idx)}
                            </Table.Td>

                        ))}
                    </Table.Tr>
                ))}

            </Table.Tbody>
        < /Table>

    )
}