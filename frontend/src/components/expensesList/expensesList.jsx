import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import formatDate from '../../utils/dateformatter';

export const ExpensesList = ({ expenses, categories }) => {
    const categoryMapping = {};
    categories.forEach((c) => {
        categoryMapping[c.id] = c.name;
    });
    return (
        <TableContainer maxW="xl" w="full" mt={20}>
            <Table size="sm">
                <Thead>
                    <Tr>
                        <Th>Date</Th>
                        <Th>Amount</Th>
                        <Th>Category</Th>
                        <Th>Comment</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {expenses.map(({ amount, comment, date, categoryId }) => {
                        return (
                            <Tr>
                                <Td>{formatDate(date)}</Td>
                                <Td>{amount}</Td>
                                <Td>{categories[categoryId]}</Td>
                                <Td>{comment}</Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </TableContainer>
    );
};
