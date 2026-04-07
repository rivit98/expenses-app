import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { MeterCategoryMapping, ParsedMeter } from '../../types/api';
import { round2 } from '../../utils/rounding';

const MS_IN_DAY = 1000 * 60 * 60 * 24;
const calcPerDay = (base: { date: Date; read: number }, end: { date: Date; read: number }): number => {
    const { date: baseDate, read: baseRead } = base;
    const { date: endDate, read: endRead } = end;

    const dayDiff = (endDate.getTime() - baseDate.getTime()) / MS_IN_DAY;
    if (dayDiff === 0) {
        return 0;
    }

    return (endRead - baseRead) / dayDiff;
};

interface CategorySummaryProps {
    meters: ParsedMeter[];
    categoryMapping: MeterCategoryMapping;
}

export const CategorySummary = ({ meters, categoryMapping }: CategorySummaryProps) => {
    const groups: Record<string, ParsedMeter[]> = {};
    const summary: Record<string, { base: ParsedMeter | undefined; end: ParsedMeter | undefined }> = {};

    // group meters by category
    Object.keys(categoryMapping).forEach((k) => {
        groups[k] = [];
    });

    meters.forEach((e) => {
        groups[e.category].push(e);
    });

    // sort each category group by date ascending and get oldest/newest readings
    Object.keys(categoryMapping).forEach((k) => {
        const sortedGroup = groups[k].sort((a, b) => a.date.getTime() - b.date.getTime());
        summary[k] = {
            base: sortedGroup.at(0), // oldest reading (earliest date)
            end: sortedGroup.at(-1), // newest reading (latest date)
        };
    });

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
                        .filter(
                            (entry): entry is [string, { base: ParsedMeter; end: ParsedMeter }] =>
                                entry[1].base !== undefined && entry[1].end !== undefined
                        )
                        .map(([k, { base, end }]) => {
                            return (
                                <Tr
                                    key={k}
                                    _hover={{
                                        background: 'whiteAlpha.300',
                                        color: 'teal.300',
                                    }}
                                >
                                    <Td>{categoryMapping[Number(k)].name}</Td>
                                    <Td>
                                        {round2(calcPerDay(base, end))} {categoryMapping[Number(k)].unit}
                                    </Td>
                                    <Td>
                                        {round2(calcPerDay(base, end) * 30)} {categoryMapping[Number(k)].unit}
                                    </Td>
                                </Tr>
                            );
                        })}
                </Tbody>
            </Table>
        </TableContainer>
    );
};
