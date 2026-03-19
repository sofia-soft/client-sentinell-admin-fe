import {Box, Button, Container, Flex, Input, Select, Pagination, Text, Group} from "@mantine/core";
import {IconDownload, IconUpload, IconPlus, IconSearch} from '@tabler/icons-react';
import {TableTemplate} from "./TableTemplate.jsx";
import {useState, useMemo} from "react";
import {filterBySearch, filterBySelect} from "../utils/search.js";
import {useAuth} from "../contexts/AuthProvider";

const DEFAULT_LIMIT = 10;

export function PageContentTemplate(
    {
        tableData,
        buttonsVisible,
        resourceName,
        onEdit,
        onDelete,
        onCreate,
        onView,
        renderCell,
        meta,
        onPageChange,
    }) {
    const {hasPermission} = useAuth();
    const [search, setSearch] = useState('');
    const [first, setFirst] = useState(null);
    const [second, setSecond] = useState(null);

    const [fePage, setFePage] = useState(1);

    const canShow = (btnKey) => {
        const config = buttonsVisible[btnKey];
        if (!config?.visible) return false;
        if (!config.permission) return true;
        return hasPermission(config.permission.resource, config.permission.action);
    };

    const filteredData = useMemo(() => {
        let result = tableData?.rows || [];

        const firstFilterKey = buttonsVisible?.first_filter?.title?.toLowerCase();
        const secondFilterKey = buttonsVisible?.second_filter?.title?.toLowerCase();

        if (search) result = filterBySearch(result, search);
        if (first && firstFilterKey) result = filterBySelect(result, first.value, firstFilterKey);
        if (second && secondFilterKey) result = filterBySelect(result, second.value, secondFilterKey);

        return result;
    }, [tableData.rows, search, first, second, buttonsVisible]);


    const isBeMode = !!meta;

    const total = isBeMode ? meta.total : filteredData.length;
    const limit = isBeMode ? meta.limit : DEFAULT_LIMIT;
    const currentPage = isBeMode ? meta.page : fePage;
    const lastPage = isBeMode ? meta.last_page : Math.ceil(total / limit) || 1;

    const pagedRows = isBeMode
        ? filteredData  // BE вече е нарязал данните
        : filteredData.slice((currentPage - 1) * limit, currentPage * limit);

    const handleSearch = (val) => {
        setSearch(val);
        setFePage(1);
    };
    const handleFirst = (val, opt) => {
        setFirst(opt);
        setFePage(1);
    };
    const handleSecond = (val, opt) => {
        setSecond(opt);
        setFePage(1);
    };

    const handlePageChange = (page) => {
        if (isBeMode) {
            onPageChange?.(page);
        } else {
            setFePage(page);
        }
    };

    const from = total === 0 ? 0 : (currentPage - 1) * limit + 1;
    const to = Math.min(currentPage * limit, total);

    return (
        <Container mt={20} mx={"3%"} mb={"2%"}fluid>
            <Flex justify={"space-between"}>
                <Flex gap="xs">
                    {canShow('search') && (
                        <Input
                            radius="xl"
                            placeholder="Search"
                            w={150}
                            leftSection={<IconSearch stroke={2} size={15}/>}
                            value={search}
                            onChange={(event) => setSearch(event.currentTarget.value)}
                        />
                    )}
                    {canShow('first_filter') && (
                        <Select
                            radius="xl"
                            w={first ? (first.value.length * 13) + 66 : 123}
                            leftSection={<buttonsVisible.first_filter.icon stroke={1} size={20}/>}
                            placeholder={buttonsVisible.first_filter.title}
                            clearable
                            value={first ? first.value : null}
                            onChange={handleFirst}
                            data={buttonsVisible.first_filter.values}
                        />
                    )}
                    {canShow('second_filter') && (
                        <Select
                            radius="xl"
                            w={second ? (second.value.length * 10) + 66 : 120}
                            leftSection={<buttonsVisible.second_filter.icon stroke={1} size={20}/>}
                            placeholder={buttonsVisible.second_filter.title}
                            clearable
                            value={second ? second.value : null}
                            onChange={handleSecond}
                            data={buttonsVisible.second_filter.values}
                        />
                    )}
                </Flex>
                <Flex gap="xs">
                    {canShow('export') && (
                        <Button variant="outline" radius="lg" leftSection={<IconDownload stroke={2}/>}>
                            Export
                        </Button>
                    )}
                    {canShow('import') && (
                        <Button variant="outline" radius="lg" leftSection={<IconUpload stroke={2}/>}>
                            Import
                        </Button>
                    )}
                    {canShow('create') && (
                        <Button variant="filled" radius="lg" leftSection={<IconPlus stroke={2}/>} onClick={onCreate}>
                            Create
                        </Button>
                    )}
                </Flex>
            </Flex>

            <Box mt={12}>
                <TableTemplate
                    header={tableData.header}
                    rows={pagedRows}
                    resourceName={resourceName}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                    renderCell={renderCell}
                />
            </Box>

            <Group justify="space-between" align="center" mt={12}>
                <Text size="sm" c="dimmed">
                    {from}–{to} от {total}
                </Text>
                <Pagination
                    total={lastPage}
                    value={currentPage}
                    onChange={handlePageChange}
                    radius="xl"
                    size="sm"
                />
            </Group>
        </Container>
    );
}