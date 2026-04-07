import { Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import { round2 } from '../../utils/rounding';
import { CategoryMapping, SummaryGroup, SummaryGroups } from '../../types/api';

interface ExpensesSummaryListProps {
    summaryGroups: [string, SummaryGroup][];
    categoryMapping: CategoryMapping;
}

const calcAvgs = (
    summaryGroups: SummaryGroups,
    categoryMapping: CategoryMapping
): { categoryAvgs: Record<string, number>; totalAvg: number } => {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    const todayStr = `${month}-${year}`;
    const categorySums: Record<string, number> = Object.fromEntries(
        Object.keys(categoryMapping).map((item) => [item, 0])
    );

    const filteredGroups = Object.keys(summaryGroups)
        .filter((date) => date !== todayStr)
        .map((date) => summaryGroups[date]);

    filteredGroups.forEach((g) =>
        Object.entries(g).forEach(([k, v]) => {
            categorySums[k] += v;
        })
    );
    const total = Object.values(categorySums).reduce((acc, x) => acc + x, 0);
    const count = filteredGroups.length;
    const totalAvg = count > 0 ? total / count : 0;

    const categoryAvgs: Record<string, number> = {};
    Object.entries(categorySums).forEach(([k, v]) => {
        categoryAvgs[k] = count > 0 ? v / count : 0;
    });

    return { categoryAvgs, totalAvg };
};

export const ExpensesSummaryList = ({ summaryGroups, categoryMapping }: ExpensesSummaryListProps) => {
    const summaryGroupsObj: SummaryGroups = Object.fromEntries(summaryGroups);
    const categoryIDs = Object.keys(categoryMapping);
    const tableHeaders = ['Month'].concat(Object.values(categoryMapping)).concat('Total');
    const { categoryAvgs, totalAvg } = calcAvgs(summaryGroupsObj, categoryMapping);

    return (
        <TableContainer mt={5}>
            <Table size="md" variant="striped" colorScheme="whiteAlpha">
                <Thead>
                    <Tr>
                        {tableHeaders.map((cat) => {
                            return <Th key={cat}>{cat}</Th>;
                        })}
                    </Tr>
                </Thead>
                <Tbody>
                    {Object.entries(summaryGroupsObj).map(([k, group]) => {
                        return (
                            <Tr
                                key={k}
                                _hover={{
                                    background: 'whiteAlpha.300',
                                    color: 'teal.300',
                                }}
                            >
                                <Td>{k}</Td>
                                {categoryIDs.map((catID) => {
                                    return <Td key={catID}>{round2(group[catID as unknown as number] || 0)} zł</Td>;
                                })}
                                <Td>{round2(Object.values(group).reduce((acc, x) => acc + x, 0))} zł</Td>
                            </Tr>
                        );
                    })}
                </Tbody>
                <Tfoot>
                    <Tr>
                        <Th>Avg</Th>
                        {categoryIDs.map((catID) => {
                            return <Th key={catID}>{round2(categoryAvgs[catID])} zł</Th>;
                        })}
                        <Th>{round2(totalAvg)} zł</Th>
                    </Tr>
                </Tfoot>
            </Table>
        </TableContainer>
    );
};
