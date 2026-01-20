import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { round2 } from '../../utils/rounding';

const MS_IN_DAY = 1000 * 60 * 60 * 24;
const calcPerDay = (base, end) => {
    const { date: base_date, read: base_read } = base;
    const { date: end_date, read: end_read } = end;

    const dayDiff = (end_date - base_date) / MS_IN_DAY;
    if (dayDiff === 0) {
        return 0;
    }

    return (end_read - base_read) / dayDiff;
};

export const CategorySummary = ({ meters, categoryMapping }) => {
    const groups = {};
    const summary = {};

    // group meters by category
    Object.keys(categoryMapping).forEach((k) => {
        groups[k] = [];
    });

    meters.forEach((e) => {
        groups[e.category].push(e);
    });

    // sort each category group by date ascending and get oldest/newest readings
    Object.keys(categoryMapping).forEach((k) => {
        const sortedGroup = groups[k].sort((a, b) => a.date - b.date);
        summary[k] = {
            base: sortedGroup.at(0), // oldest reading (earliest date)
            end: sortedGroup.at(-1), // newest reading (latest date)
        };
    });

    console.log(summary);

    return (
        <TableContainer maxW="xl" w="full" mt={10}>
            <Table size="md" variant="striped" colorScheme="whiteAlpha">
                <Thead>
                    <Tr>
                        <Th>Category</Th>
                        <Th>Avg per day</Th>
                        <Th>Avg per month</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {Object.entries(summary)
                        .filter(([, { base, end }]) => base && end)
                        .map(([k, { base, end }]) => {
                            return (
                                <Tr
                                    key={k}
                                    _hover={{
                                        background: 'whiteAlpha.300',
                                        color: 'teal.300',
                                    }}
                                >
                                    <Td>{categoryMapping[k].name}</Td>
                                    <Td>
                                        {round2(calcPerDay(base, end))} {categoryMapping[k].unit}
                                    </Td>
                                    <Td>
                                        {round2(calcPerDay(base, end) * 30)} {categoryMapping[k].unit}
                                    </Td>
                                </Tr>
                            );
                        })}
                </Tbody>
            </Table>
        </TableContainer>
    );
};
