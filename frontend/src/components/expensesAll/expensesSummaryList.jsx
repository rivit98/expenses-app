import { Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import { round2 } from '../../utils/rounding';

const calcAvgs = (summaryGroups, categoryMapping) => {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    const today_str = `${month}-${year}`;
    const categorySums = Object.keys(categoryMapping).reduce((obj, item) => ((obj[item] = 0), obj), {});

    const filtered_categories = Object.keys(summaryGroups)
        .filter((date) => date !== today_str)
        .map((date) => summaryGroups[date]);

    filtered_categories.forEach((g) =>
        Object.entries(g).forEach(([k, v]) => {
            categorySums[k] += v;
        })
    );
    const total = Object.values(categorySums).reduce((acc, x) => acc + x, 0);
    const totalAvg = total / filtered_categories.length;

    const categoryAvgs = {};
    Object.entries(categorySums).forEach(([k, v]) => {
        categoryAvgs[k] = v / filtered_categories.length;
    });

    return { categoryAvgs, totalAvg };
};

export const ExpensesSummaryList = ({ summaryGroups, categoryMapping }) => {
    const summaryGroupsObj = Object.fromEntries(summaryGroups);
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
                                    return <Td key={catID}>{round2(group[catID]) || 0} zł</Td>;
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
