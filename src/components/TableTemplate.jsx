import {Table, Badge, Box, Image, Text, Modal, ActionIcon, Rating, Center, Menu, Popover, Select} from '@mantine/core';
import {useAuth} from "../contexts/AuthProvider.jsx";
import {
    IconPencil,
    IconTrash,
    IconReceipt,
    IconMessage,
    IconCubeSend,
    IconCalendarQuestion,
    IconTruckDelivery,
    IconBuildingStore,
    IconAddressBook,
    IconFileDescription,
    IconStackBack
} from '@tabler/icons-react';
import Nodata from "../assets/no_data.svg"
import {useDisclosure} from "@mantine/hooks";
import {useEffect, useState} from "react";
import * as orderApi from "../api/ordersApi.js";
import {getLocalizedValue} from "../utils/utils.js";

export function TableTemplate(
    {
        header,
        rows,
        resourceName,
        onEdit,
        onDelete,
        updateStatus = null
    }
) {

    const {hasPermission} = useAuth();
    const actionShow = hasPermission(resourceName, 'update') || hasPermission(resourceName, 'delete');
    const minRows = 10;
    const rowHeight = 50;
    const totalColumns = header.length + 1;
    const isEmpty = rows.length === 0;
    const emptyRowsCount = Math.max(0, minRows - rows.length);
    const [opened, {open, close}] = useDisclosure(false);
    const [selectedItems, setSelectedItems] = useState();
    const [tableData, setTableData] = useState([]);
    const [orderStatuses, setOrderStatuses] = useState([]);
    const [openedPopOver, setOpenedPopOver] = useState(null);
    const arrayWithIcons = ["items", 'shipping_address', 'speedy_office', "comment", 'dates', 'status']
    const [displayMode, setDisplayMode] = useState({});


    useEffect(() => {

        if (resourceName === 'order') {
            orderApi.listOrderStatuses()
                .then((response) => {
                    if (response.status === 200) {
                        setOrderStatuses(response.data.data)
                    }
                }).catch(console.error)
        }

    }, []);

    const parseJson = (value) => {
        try {
            const parsed = JSON.parse(value);
            return parsed?.en ?? value;
        } catch (e) {
            return value;
        }
    }

    const updateDisplayMode = (value) => {
        console.log(value)
    }

    const handleOpen = (key, value) => {

        if (key === 'items') {
            setTableData(
                {
                    tableHeader:
                        <>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Quantity</Table.Th>
                            <Table.Th>Price</Table.Th>
                        </>,
                    tableBody:
                        <>
                            {
                                value.map(product =>
                                    <Table.Tr key={product.product_uuid}>
                                        <Table.Td>
                                            {getLocalizedValue(product.product_name, 'en')}
                                            {product?.variant_attributes.map(variant => ` - ${getLocalizedValue(variant, 'en')}`)}
                                        </Table.Td>
                                        <Table.Td>{product.quantity}</Table.Td>
                                        <Table.Td>{product.price ?? product.price_at_purchase}</Table.Td>
                                    </Table.Tr>)
                            }
                        </>
                }
            )
        } else if (key === 'comment') {
            setTableData(
                {
                    tableHeader:
                        <Table.Th>Comment</Table.Th>,
                    tableBody:
                        <Table.Tr key='comment'>
                            <Table.Td>{value}</Table.Td>
                        </Table.Tr>

                }
            )
        }
        setSelectedItems(value)
        open()
    }

    const popoverHandler = (Icon, rowId, value, key) => {

        const popoverKey = `${rowId}-${key}`;

        if (!value) return;

        const popoverContext = () => {
            if (key === 'dates') return <>
                <Text size="sm">
                    Created: {value.created_at}
                </Text>
                <Text size="sm" mt={5}>
                    Updated: {value.updated_at}
                </Text>
            </>


            if (key === 'customer') return <>
                <Text size="sm">
                    Customer name: {value.name}
                </Text>
                <Text size="sm" mt={5}>
                    Phone: {value.phone}
                </Text>
                <Text size="sm" mt={5}>
                    email: {value.email}
                </Text>
            </>

            return <Text size="sm">{value}</Text>

        }


        return (
            <Popover
                width={200}
                position="bottom"
                withArrow
                shadow="md"
                opened={openedPopOver === popoverKey}
                onChange={(opened) =>
                    setOpenedPopOver(opened ? popoverKey : null)
                }
            >
                <Popover.Target width={100}>
                    <ActionIcon onClick={() => setOpenedPopOver(openedPopOver === popoverKey ? null : popoverKey)}
                                variant="transparent">
                        <Icon stroke={2}/>
                    </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown>
                    {popoverContext()}
                </Popover.Dropdown>
            </Popover>
        )
    }


    const renderCell = (item, columnKey, index) => {

        if (columnKey === 'id') return index + 1;

        const value = item[columnKey];

        if (columnKey === "items") return (
            <ActionIcon onClick={() => handleOpen(columnKey, value)} variant="transparent">
                <IconReceipt stroke={2}/>
            </ActionIcon>
        );

        if (columnKey === 'shipping_address' || columnKey === 'speedy_office') {
            const Icon = columnKey === 'shipping_address' ?
                IconTruckDelivery :
                item.speedy_type === 'APT' ? IconCubeSend :
                    IconBuildingStore;
            return popoverHandler(Icon, item.uuid, value, columnKey)

        }

        if (columnKey === 'customer') return popoverHandler(IconAddressBook, item.uuid, value, columnKey)

        if (columnKey === 'role') return value['name'];

        if (columnKey === "comment") return popoverHandler(IconMessage, item.uuid, value, columnKey);

        if (columnKey === "rating") return <Rating value={value} fractions={2} readOnly/>

        if (columnKey === 'dates') return popoverHandler(IconCalendarQuestion, item.uuid, item, columnKey)

        if (columnKey === 'description') return popoverHandler(IconFileDescription, item.uuid, parseJson(value), columnKey)

        if (columnKey === 'status' || columnKey === 'is_active' || columnKey === 'approved') {
            const color = value?.color;
            const name = value?.name ? JSON.parse(value?.name) : value?.name;
            const statuses = columnKey === 'approved' ? ['approved', "not approved"] : ["active", "inactive"];
            const size = columnKey === 'approved' ? 150 : 120;
            const approvedStatuses =
                [
                    {
                        label: 'Approved',
                        value: true,
                        color: "green"
                    },
                    {
                        label: 'Not approved',
                        value: false,
                        color: "red"
                    }
                ]

            if (columnKey === 'approved' ||
                (columnKey === 'status' && resourceName === 'order')
            ) {
                return (
                    <Menu shadow="md" width={180}>
                        <Menu.Target>
                            <Badge
                                variant="dot"
                                w={size}
                                style={{cursor: 'pointer'}}
                                color={
                                    color || (value === 1 || value === true
                                        ? 'green'
                                        : 'red')
                                }
                            >
                                {name
                                    ? name['en']
                                    : value === 1 || value === true
                                        ? statuses[0]
                                        : statuses[1]}
                            </Badge>
                        </Menu.Target>

                        <Menu.Dropdown>
                            {
                                columnKey === 'approved'
                                    ? approvedStatuses.map(status => (
                                        <Menu.Item
                                            key={status.value}
                                            color={status.color}
                                            onClick={() => updateStatus(status.value, item.uuid)}
                                        >
                                            {status.label}
                                        </Menu.Item>
                                    ))
                                    : columnKey === 'status' && resourceName === 'order'
                                        ? orderStatuses.map(status => (
                                            <Menu.Item
                                                key={status.id}
                                                color={status.label_color}
                                                onClick={() => updateStatus(status.id, item.uuid)}
                                            >
                                                {parseJson(status.name)}
                                            </Menu.Item>
                                        ))
                                        : null
                            }
                        </Menu.Dropdown>
                    </Menu>
                );
            }

            return (
                <Badge
                    variant="dot"
                    color={
                        color
                            ? color
                            : value === 1 || value === true
                                ? 'green'
                                : 'red'
                    }
                    w={size}
                >
                    {name
                        ? name['en']
                        : value === 1 || value === true
                            ? statuses[0]
                            : statuses[1]}
                </Badge>
            );
        }

        if (
            columnKey === 'name' || columnKey === "description" || columnKey === 'product') {

            return parseJson(columnKey === 'product' ? value['name'] : value)

        }

        if (columnKey === 'is_system') {
            return (
                <Badge variant="dot" color={value === 1 ? "green" : "red"} w={80}>
                    {value === 1 ? "yes" : "no"}
                </Badge>
            );
        }

        if (columnKey === 'display_mode') {
            return value === "grouped" &&
                (<Badge
                    leftSection={<IconStackBack/>}
                    variant="transparent"
                    style={{cursor: 'pointer'}}
                ></Badge>)
        }

        return value;
    };

    return (
        <Box style={{position: 'relative'}}>
            {selectedItems &&
                <Modal opened={opened} onClose={close} title="Order items">
                    <Table striped highlightOnHover withTableBorder>
                        <Table.Thead>
                            <Table.Tr>
                                {tableData.tableHeader}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {tableData.tableBody}
                        </Table.Tbody>
                    </Table>
                </Modal>
            }

            <Table.ScrollContainer minWidth={700}>
            <Table horizontalSpacing={{base: 'sm', sm: 'xl'}}
                   stickyHeader
                   striped
                   highlightOnHover
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
                                <Table.Td key={col.key} w={arrayWithIcons.includes(col.key) && 150}>
                                    <Center>
                                        {renderCell(item, col.key, idx)}
                                    </Center>
                                </Table.Td>


                            ))}
                            {actionShow &&
                                <Table.Td key={'actions-col'} className='actions'>

                                    {
                                        hasPermission(resourceName, 'update')
                                        &&
                                        resourceName !== 'reviews' &&
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
                        <Table.Tr>
                            <Table.Td colSpan={totalColumns}>
                                <div className='no-data-section'>
                                    <Image src={Nodata} w={250}/>
                                    <Text c="dimmed" mt="sm">Няма намерени данни</Text>
                                </div>
                            </Table.Td>
                        </Table.Tr>
                    )}

                    {Array.from({length: emptyRowsCount}).map((_, index) => (
                        <Table.Tr key={`empty-${index}`} style={{height: `${rowHeight}px`}}>
                            {Array.from({length: totalColumns}).map((_, cellIdx) => (
                                <Table.Td key={`cell-${cellIdx}`}>&nbsp;</Table.Td>
                            ))}
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
            </Table.ScrollContainer>
        </Box>
    )
}