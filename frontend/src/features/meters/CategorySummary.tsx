import { Table } from '@chakra-ui/react';
import { texts } from '../../constants/texts';
import type { MeterCategoryMapping, ParsedMeter } from '../../types/api';
import { round2 } from '../../utils/rounding';

const MS_IN_DAY = 1000 * 60 * 60 * 24;
const WINDOW_DAYS = 365;

const calcPerDay = (base: { date: Date; read: number }, end: { date: Date; read: number }): number => {
    const { date: baseDate, read: baseRead } = base;
    const { date: endDate, read: endRead } = end;

    const dayDiff = (endDate.getTime() - baseDate.getTime()) / MS_IN_DAY;
    if (dayDiff === 0) {
        return 0;
    }

    return (endRead - baseRead) / dayDiff;
};

// pick the readings spanning the WINDOW_DAYS window that ends at the group's newest reading
const pickWindow = (sortedGroup: ParsedMeter[]): { base: ParsedMeter | undefined; end: ParsedMeter | undefined } => {
    const end = sortedGroup.at(-1);
    if (end === undefined) {
        return { base: undefined, end: undefined };
    }

    const cutoff = end.date.getTime() - WINDOW_DAYS * MS_IN_DAY;
    const firstInWindow = sortedGroup.findIndex((m) => m.date.getTime() >= cutoff);

    // the window always holds `end`, so reach back one reading when it holds nothing else
    const baseIdx = firstInWindow === sortedGroup.length - 1 ? Math.max(firstInWindow - 1, 0) : firstInWindow;

    return { base: sortedGroup[baseIdx], end };
};

interface CategorySummaryProps {
    meters: ParsedMeter[];
    categoryMapping: MeterCategoryMapping;
}

export const CategorySummary = ({ meters, categoryMapping }: CategorySummaryProps) => {
    const groups: Record<string, ParsedMeter[]> = {};
    const summary: Record<string, { base: ParsedMeter | undefined; end: ParsedMeter | undefined }> = {};

    // group meters by category
    Object.keys(categoryMapping).forEach((k) => {
        groups[k] = [];
    });

    meters.forEach((e) => {
        groups[e.category].push(e);
    });

    // sort each category group by date ascending and reduce it to the window's endpoints
    Object.keys(categoryMapping).forEach((k) => {
        const sortedGroup = groups[k].sort((a, b) => a.date.getTime() - b.date.getTime());
        summary[k] = pickWindow(sortedGroup);
    });

    return (
        <Table.ScrollArea maxW="xl" w="full" mt={10}>
            <Table.Root size="md" striped colorPalette="whiteAlpha">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>{texts.common.category}</Table.ColumnHeader>
                        <Table.ColumnHeader>{texts.meters.avgPerDay}</Table.ColumnHeader>
                        <Table.ColumnHeader>{texts.meters.avgPerMonth}</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {Object.entries(summary)
                        .filter(
                            (entry): entry is [string, { base: ParsedMeter; end: ParsedMeter }] =>
                                entry[1].base !== undefined && entry[1].end !== undefined
                        )
                        .map(([k, { base, end }]) => {
                            const perDay = calcPerDay(base, end);

                            return (
                                <Table.Row
                                    key={k}
                                    _hover={{
                                        background: 'whiteAlpha.300',
                                        color: 'teal.300',
                                    }}
                                >
                                    <Table.Cell>{categoryMapping[Number(k)].name}</Table.Cell>
                                    <Table.Cell>
                                        {round2(perDay)} {categoryMapping[Number(k)].unit}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {round2(perDay * 30)} {categoryMapping[Number(k)].unit}
                                    </Table.Cell>
                                </Table.Row>
                            );
                        })}
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea>
    );
};
