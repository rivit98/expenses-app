import { Table } from '@chakra-ui/react';
import { texts } from '../../constants/texts';
import type { CategoryMapping, SummaryGroup, SummaryGroups } from '../../types/api';
import { formatCurrency } from '../../utils/rounding';

interface ExpensesSummaryListProps {
    summaryGroups: [string, SummaryGroup][];
    categoryMapping: CategoryMapping;
}

const calcAvgs = (
    summaryGroups: SummaryGroups,
    categoryMapping: CategoryMapping
): { categoryAvgs: Record<string, number>; totalAvg: number } => {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    const todayStr = `${month}-${year}`;
    const categorySums: Record<string, number> = Object.fromEntries(
        Object.keys(categoryMapping).map((item) => [item, 0])
    );

    const filteredGroups = Object.keys(summaryGroups)
        .filter((date) => date !== todayStr)
        .map((date) => summaryGroups[date]);

    filteredGroups.forEach((g) => {
        Object.entries(g).forEach(([k, v]) => {
            categorySums[k] += v;
        });
    });
    const total = Object.values(categorySums).reduce((acc, x) => acc + x, 0);
    const count = filteredGroups.length;
    const totalAvg = count > 0 ? total / count : 0;

    const categoryAvgs: Record<string, number> = {};
    Object.entries(categorySums).forEach(([k, v]) => {
        categoryAvgs[k] = count > 0 ? v / count : 0;
    });

    return { categoryAvgs, totalAvg };
};

export const ExpensesSummaryList = ({ summaryGroups, categoryMapping }: ExpensesSummaryListProps) => {
    const summaryGroupsObj: SummaryGroups = Object.fromEntries(summaryGroups);
    const categoryIDs = Object.keys(categoryMapping);
    const tableHeaders = [texts.expenses.month].concat(Object.values(categoryMapping)).concat(texts.common.total);
    const { categoryAvgs, totalAvg } = calcAvgs(summaryGroupsObj, categoryMapping);

    return (
        <Table.ScrollArea mt={5}>
            <Table.Root size="md" striped colorPalette="whiteAlpha">
                <Table.Header>
                    <Table.Row>
                        {tableHeaders.map((cat) => {
                            return <Table.ColumnHeader key={cat}>{cat}</Table.ColumnHeader>;
                        })}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {Object.entries(summaryGroupsObj).map(([k, group]) => {
                        return (
                            <Table.Row
                                key={k}
                                _hover={{
                                    background: 'whiteAlpha.300',
                                    color: 'teal.300',
                                }}
                            >
                                <Table.Cell>{k}</Table.Cell>
                                {categoryIDs.map((catID) => {
                                    return (
                                        <Table.Cell key={catID}>
                                            {formatCurrency(group[catID as unknown as number] || 0)}
                                        </Table.Cell>
                                    );
                                })}
                                <Table.Cell>
                                    {formatCurrency(Object.values(group).reduce((acc, x) => acc + x, 0))}
                                </Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
                <Table.Footer>
                    <Table.Row>
                        <Table.ColumnHeader>{texts.common.avg}</Table.ColumnHeader>
                        {categoryIDs.map((catID) => {
                            return (
                                <Table.ColumnHeader key={catID}>
                                    {formatCurrency(categoryAvgs[catID])}
                                </Table.ColumnHeader>
                            );
                        })}
                        <Table.ColumnHeader>{formatCurrency(totalAvg)}</Table.ColumnHeader>
                    </Table.Row>
                </Table.Footer>
            </Table.Root>
        </Table.ScrollArea>
    );
};
