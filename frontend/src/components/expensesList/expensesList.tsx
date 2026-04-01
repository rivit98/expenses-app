import { Badge, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { CategoryMapping, ParsedExpense } from '../../types/api';
import formatDate from '../../utils/dateformatter';
import { EditExpense } from './editExpense';

const badges: string[] = ['yellow', 'red', 'green', 'gray', 'purple', 'blue', 'pink'];

interface ExpensesListProps {
    expenses: ParsedExpense[];
    categoryMapping: CategoryMapping;
}

export const ExpensesList = ({ expenses, categoryMapping }: ExpensesListProps) => {
    return (
        <TableContainer maxW="xl" w="full" mt={10}>
            <Table size="sm" variant="striped" colorScheme="whiteAlpha">
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
                            <Tr
                                key={id}
                                _hover={{
                                    background: 'whiteAlpha.300',
                                    color: 'teal.300',
                                }}
                            >
                                <Td px={2} py={0}>
                                    {formatDate(date).substring(0, 10)}
                                </Td>
                                <Td px={1} py={0}>
                                    <Stack justifyContent="center" textAlign="center" spacing={0.5}>
                                        <Text>{amount} zł</Text>
                                        <Badge ml={2} colorScheme={badges[(category - 1) % badges.length]}>
                                            {categoryMapping[category]}
                                        </Badge>
                                    </Stack>
                                </Td>
                                <Td whiteSpace="break-spaces" py={0}>
                                    {comment}
                                </Td>
                                <Td px={1}>
                                    <EditExpense expense={expense} categoryMapping={categoryMapping} />
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </TableContainer>
    );
};
