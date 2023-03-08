import { Badge, HStack, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import formatDate from '../../utils/dateformatter';
import { byDate, byNumber, reverse } from '../generic/sortUtil';
import { DeleteExpense } from './deleteExpense';
import { EditExpense } from './editExpense';

const badges = ['blue', 'yellow', 'red', 'green', 'gray', 'purple'];

export const ExpensesList = ({ expenses, categoryMapping, updateFunc }) => {
    const currentMonth = new Date().getMonth();
    const thisMonthExpenses = expenses
        .filter(({ date }) => date.getMonth() === currentMonth)
        .sort((t1, t2) => byDate(t1.date, t2.date) || reverse(byNumber(t1.id, t2.id)));

    return (
        <TableContainer maxW="xl" w="full" mt={10}>
            <Table size="sm">
                <Thead>
                    <Tr>
                        <Th pr={1} pl={0} w="1">
                            Date
                        </Th>
                        <Th pr={1} w="1">
                            Amount
                        </Th>
                        <Th>Comment</Th>
                        <Th w="1" />
                    </Tr>
                </Thead>
                <Tbody>
                    {thisMonthExpenses.map((expense) => {
                        const { id, amount, comment, date, category } = expense;
                        return (
                            <Tr key={id}>
                                <Td pr={1} pl={0}>
                                    {formatDate(date).substring(0, 5)}
                                </Td>
                                <Td pr={1}>
                                    {amount} zł
                                    <Badge ml={2} colorScheme={badges[category % badges.length]}>
                                        {categoryMapping[category]}
                                    </Badge>
                                </Td>
                                <Td whiteSpace="break-spaces">{comment}</Td>
                                <Td p={1}>
                                    <HStack p={0} m={0}>
                                        <DeleteExpense expense={expense} updateFunc={updateFunc} />
                                        <EditExpense
                                            expense={expense}
                                            updateFunc={updateFunc}
                                            categoryMapping={categoryMapping}
                                        />
                                    </HStack>
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </TableContainer>
    );
};
