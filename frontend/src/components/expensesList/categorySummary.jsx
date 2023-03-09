import { Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import { byNumber, reverse } from '../generic/sortUtil';

export const CategorySummary = ({ expenses, categoryMapping }) => {
    const summary = {};
    Object.keys(categoryMapping).forEach((k) => {
        summary[k] = 0.0;
    });

    expenses.forEach((e) => {
        summary[e.category] += e.amount;
    });

    return (
        <TableContainer maxW="sm">
            <Table size="sm">
                <Thead>
                    <Tr>
                        <Th>Category</Th>
                        <Th>Amount</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {Object.entries(summary)
                        .sort((c1, c2) => reverse(byNumber(c1[1], c2[1])))
                        .map(([k, amount]) => {
                            return (
                                <Tr key={k}>
                                    <Td>{categoryMapping[k]}</Td>
                                    <Td>{amount} zł</Td>
                                </Tr>
                            );
                        })}
                </Tbody>
                <Tfoot>
                    <Tr>
                        <Th>Total</Th>
                        <Th>{Object.values(summary).reduce((acc, c) => acc + c, 0)} zł</Th>
                    </Tr>
                </Tfoot>
            </Table>
        </TableContainer>
    );
};
