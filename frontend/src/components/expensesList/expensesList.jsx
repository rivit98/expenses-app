import { Badge, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import formatDate from '../../utils/dateformatter';
import { DeleteExpense } from './deleteExpense';

const byDate = (t1, t2) => {
    return t2.date.getTime() - t1.date.getTime();
};

const badges = ['blue', 'yellow', 'red', 'green', 'gray', 'purple'];

export const ExpensesList = ({ expenses, categories, updateFunc }) => {
    const categoryMapping = {};
    categories.forEach((c) => {
        categoryMapping[c.id] = c.name;
    });

    const currentMonth = new Date().getMonth();
    const thisMonthExpenses = expenses.filter(({ date }) => date.getMonth() === currentMonth).sort(byDate);

    return (
        <TableContainer maxW="xl" w="full" mt={20}>
            <Table size="sm">
                <Thead>
                    <Tr>
                        <Th>Date</Th>
                        <Th>Amount</Th>
                        <Th>Comment</Th>
                        <Th />
                    </Tr>
                </Thead>
                <Tbody>
                    {thisMonthExpenses.map((expense) => {
                        const { id, amount, comment, date, category } = expense;
                        return (
                            <Tr key={id}>
                                <Td>{formatDate(date)}</Td>
                                <Td alignContent="center">
                                    {amount} zł
                                    <Badge ml={3} colorScheme={badges[category % badges.length]}>
                                        {categoryMapping[category]}
                                    </Badge>
                                </Td>
                                <Td>{comment}</Td>
                                <Td>
                                    <DeleteExpense expense={expense} updateFunc={updateFunc} />
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </TableContainer>
    );
};
