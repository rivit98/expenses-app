import { Badge, Stack, Table, Text } from '@chakra-ui/react';
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
        <Table.ScrollArea maxW="xl" w="full" mt={10}>
            <Table.Root size="sm" striped colorPalette="whiteAlpha">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader pr={1} pl={0} w="1">
                            {texts.common.date}
                        </Table.ColumnHeader>
                        <Table.ColumnHeader pr={1} w="1">
                            {texts.common.amount}
                        </Table.ColumnHeader>
                        <Table.ColumnHeader>{texts.common.comment}</Table.ColumnHeader>
                        <Table.ColumnHeader w="1" />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {expenses.map((expense) => {
                        const { id, amount, comment, date, category } = expense;
                        return (
                            <Table.Row
                                key={id}
                                _hover={{
                                    background: 'whiteAlpha.300',
                                    color: 'teal.300',
                                }}
                            >
                                <Table.Cell px={2} py={0}>
                                    {formatDate(date).substring(0, 10)}
                                </Table.Cell>
                                <Table.Cell px={1} py={0}>
                                    <Stack justifyContent="center" textAlign="center" gap={0.5}>
                                        <Text>{formatCurrency(amount)}</Text>
                                        <Badge ml={2} {...getBadgeColor(categoryMapping[category])}>
                                            {categoryMapping[category]}
                                        </Badge>
                                    </Stack>
                                </Table.Cell>
                                <Table.Cell whiteSpace="break-spaces" py={0}>
                                    {comment}
                                </Table.Cell>
                                <Table.Cell px={1}>
                                    <EditExpense expense={expense} categoryMapping={categoryMapping} />
                                </Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea>
    );
};
