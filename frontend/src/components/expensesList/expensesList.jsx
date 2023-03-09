import { Badge, HStack, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import formatDate from '../../utils/dateformatter';
import { DeleteExpense } from './deleteExpense';
import { EditExpense } from './editExpense';

const badges = ['blue', 'yellow', 'red', 'green', 'gray', 'purple'];

export const ExpensesList = ({ expenses, categoryMapping, updateFunc }) => {
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
                    {expenses.map((expense) => {
                        const { id, amount, comment, date, category } = expense;
                        return (
                            <Tr key={id}>
                                <Td pr={1} pl={0}>
                                    {formatDate(date).substring(0, 10)}
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
