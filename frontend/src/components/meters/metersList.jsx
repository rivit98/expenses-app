import { Badge, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import formatDate from '../../utils/dateformatter';
import { EditMeter } from './editMeter';

const badges = ['blue', 'yellow', 'red', 'green', 'gray', 'purple'];

export const MetersList = ({ meters, categoryMapping, updateFunc }) => {
    return (
        <TableContainer maxW="xl" w="full" mt={10}>
            <Table size="sm" variant="striped" colorScheme="whiteAlpha">
                <Thead>
                    <Tr>
                        <Th pr={1} pl={0} w="1">
                            Date
                        </Th>
                        <Th pr={1} w="1">
                            Category
                        </Th>
                        <Th w="1" textAlign="center">
                            Read
                        </Th>
                        <Th w="1" />
                    </Tr>
                </Thead>
                <Tbody>
                    {meters.map((meter) => {
                        const { id, read, date, category } = meter;
                        return (
                            <Tr
                                key={id}
                                _hover={{
                                    background: 'whiteAlpha.300',
                                    color: 'teal.300',
                                }}
                            >
                                <Td px={2} py={0}>
                                    {formatDate(date).substring(0, 10)}
                                </Td>
                                <Td px={2} py={0}>
                                    <Badge ml={2} colorScheme={badges[category % badges.length]}>
                                        {categoryMapping[category].name}
                                    </Badge>
                                </Td>
                                <Td textAlign="center">
                                    <Text>
                                        {read} {categoryMapping[category].unit}
                                    </Text>
                                </Td>
                                <Td px={1}>
                                    <EditMeter
                                        meter={meter}
                                        updateFunc={updateFunc}
                                        categoryMapping={categoryMapping}
                                    />
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </TableContainer>
    );
};
