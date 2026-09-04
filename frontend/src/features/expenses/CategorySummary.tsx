import { Table, Text } from '@chakra-ui/react';
import { texts } from '../../constants/texts';
import type { CategoryMapping, ParsedExpense } from '../../types/api';
import { formatCurrency } from '../../utils/rounding';
import { byNumber, reverse } from '../../utils/sortUtil';

interface CategorySummaryProps {
    expenses: ParsedExpense[];
    categoryMapping: CategoryMapping;
}

export const CategorySummary = ({ expenses, categoryMapping }: CategorySummaryProps) => {
    const summary: Record<string, number> = {};
    Object.keys(categoryMapping).forEach((k) => {
        summary[k] = 0.0;
    });

    expenses.forEach((e) => {
        summary[e.category] += e.amount;
    });

    const totalSum = Object.values(summary).reduce((acc: number, c: number) => acc + c, 0);

    return (
        <Table.ScrollArea maxW="sm" mt={10}>
            <Table.Root size="md" striped colorPalette="whiteAlpha">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>{texts.common.category}</Table.ColumnHeader>
                        <Table.ColumnHeader>{texts.common.amount}</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {Object.entries(summary)
                        .sort((c1, c2) => reverse(byNumber(c1[1], c2[1])))
                        .map(([k, amount]) => {
                            return (
                                <Table.Row
                                    key={k}
                                    _hover={{
                                        background: 'whiteAlpha.300',
                                        color: 'teal.300',
                                    }}
                                >
                                    <Table.Cell>{categoryMapping[k as unknown as number]}</Table.Cell>
                                    <Table.Cell>{formatCurrency(amount)}</Table.Cell>
                                </Table.Row>
                            );
                        })}
                </Table.Body>
                <Table.Footer>
                    <Table.Row>
                        <Table.ColumnHeader>
                            <Text fontSize="md">{texts.common.total}</Text>
                        </Table.ColumnHeader>
                        <Table.ColumnHeader>
                            <Text fontSize="md">{formatCurrency(totalSum)}</Text>
                        </Table.ColumnHeader>
                    </Table.Row>
                </Table.Footer>
            </Table.Root>
        </Table.ScrollArea>
    );
};
