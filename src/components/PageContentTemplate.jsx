import {Box, Button, Container, Flex, Input, Select} from "@mantine/core";
import {IconDownload, IconUpload, IconPlus, IconSearch} from '@tabler/icons-react';
import {TableTemplate} from "./TableTemplate.jsx";
import {useState, useMemo} from "react";
import {filterBySearch, filterBySelect} from "../utils/search.js";


export function PageContentTemplate(
    {
        tableData,
        buttonsVisible
    }) {

    const [search, setSearch] = useState('');
    const [first, setFirst] = useState(null);
    const [second, setSecond] = useState(null);

    const filteredData = useMemo(() => {
        let result = tableData.rows;

        const firstFilterName = buttonsVisible.first_filter.title ?? buttonsVisible.first_filter.title;

        const secondFilterName = buttonsVisible.second_filter.title ?? buttonsVisible.second_filter.title;

        result = filterBySearch(result, search);

        result = filterBySelect(result, first, firstFilterName.toLowerCase());

        result = filterBySelect(result, second, secondFilterName.toLowerCase());

        return result;
    }, [search, first, second]);

    return (
        <Container
            m={"2% 5%"}
            fluid
        >
            <Flex
                justify={"space-between"}
            >
                <Flex gap="xs">
                    {
                        buttonsVisible.search.visible &&
                        <Input
                            radius="xl"
                            placeholder="Search"
                            w={150}
                            leftSection={<IconSearch stroke={2} size={15}/>}
                            value={search}
                            onChange={(event) => setSearch(event.currentTarget.value)}
                        />
                    }

                    {buttonsVisible.first_filter.visible && <Select
                        radius="xl"
                        w={first ? (first.value.length * 13) + 66 : 123}
                        leftSection={<buttonsVisible.first_filter.icon stroke={1} size={20}/>}
                        placeholder={buttonsVisible.first_filter.title}
                        clearable
                        value={first ? first.value : null}
                        onChange={(_value, option) => setFirst(option)}
                        data={buttonsVisible.first_filter.values}
                    />}
                    {buttonsVisible.second_filter.visible && <Select
                        radius="xl"
                        w={second ? (second.value.length * 10) + 66 : 120}
                        leftSection={<buttonsVisible.second_filter.icon stroke={1} size={20}/>}
                        placeholder={buttonsVisible.second_filter.title}
                        clearable
                        value={second ? second.value : null}
                        onChange={(_value, option) => setSecond(option)}
                        data={buttonsVisible.second_filter.values}
                    />}
                </Flex>
                <Flex gap="xs">
                    {buttonsVisible.export.visible && <Button
                        variant="outline"
                        radius="lg"
                        leftSection={<IconDownload stroke={2}/>}
                    >
                        Export
                    </Button>}
                    {buttonsVisible.import.visible && <Button
                        variant="outline"
                        radius="lg"
                        leftSection={<IconUpload stroke={2}/>}
                    >
                        Import
                    </Button>}
                    {buttonsVisible.create.visible && <Button
                        variant="filled"
                        radius="lg"
                        leftSection={<IconPlus stroke={2}/>}

                    >
                        Create
                    </Button>}
                </Flex>

            </Flex>
            <Box mt={20}>
                <TableTemplate header={tableData.header} rows={filteredData}/>
            </Box>
        </Container>)
}