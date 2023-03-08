import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { byNumber, reverse } from '../generic/sortUtil';

export const CategorySummary = ({ expenses, categories }) => {
    const categoryMapping = {};
    categories.forEach((c) => {
        categoryMapping[c.id] = c.name;
    });
    const summary = {};
    categories.forEach((c) => {
        summary[c.id] = 0.0;
    });

    expenses.forEach((e) => {
        summary[e.category] += e.amount;
    });

    return (
        <TableContainer maxW="sm" mt={10}>
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
            </Table>
        </TableContainer>
    );
};
