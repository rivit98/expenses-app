import { Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import { round2 } from '../../utils/rounding';

// const TableFooter = (summaryGroups, categoryMapping) => {
//     const total_per_avg = {};
//     const total
// };

export const ExpensesSummaryList = ({ summaryGroups, categoryMapping }) => {
    const summaryGroupsObj = Object.fromEntries(summaryGroups);
    const categoryIDs = Object.keys(categoryMapping);
    const tableHeaders = ['Month'].concat(Object.values(categoryMapping)).concat('Total');

    return (
        <TableContainer mt={10}>
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
                        <Th>Avg:</Th>
                        {categoryIDs.map((catID) => {
                            return <Th key={catID}>TODO zł</Th>;
                        })}
                        <Th>TODO zł</Th>
                    </Tr>
                </Tfoot>
            </Table>
        </TableContainer>
    );
};
