import { Badge, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { texts } from '../../constants/texts';
import type { CategoryMapping, ParsedExpense } from '../../types/api';
import { getBadgeColor } from '../../utils/badgeColor';
import formatDate from '../../utils/dateFormatter';
import { formatCurrency } from '../../utils/rounding';
import { EditExpense } from './EditExpense';

interface ExpensesListProps {
    expenses: ParsedExpense[];
    categoryMapping: CategoryMapping;
}

export const ExpensesList = ({ expenses, categoryMapping }: ExpensesListProps) => {
    if (expenses.length === 0) {
        return null;
    }

    return (
        <TableContainer maxW="xl" w="full" mt={10}>
            <Table size="sm" variant="striped" colorScheme="whiteAlpha">
                <Thead>
                    <Tr>
                        <Th pr={1} pl={0} w="1">
                            {texts.common.date}
                        </Th>
                        <Th pr={1} w="1">
                            {texts.common.amount}
                        </Th>
                        <Th>{texts.common.comment}</Th>
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
                                        <Text>{formatCurrency(amount)}</Text>
                                        <Badge ml={2} {...getBadgeColor(categoryMapping[category])}>
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
