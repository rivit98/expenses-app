import { useState } from 'react';
import { useExpenseCategories, useExpensesSummary } from '../../hooks/queries';
import { ComponentStateHandler } from '../generic/componentStateHandler';
import { Paginate } from '../generic/paginate';
import { ExpensesSummaryList } from './expensesSummaryList';
import { CategoryMapping, ParsedExpenseSummary, SummaryGroups } from '../../types/api';

export const ExpensesMonthlySummary = () => {
    const categoriesQuery = useExpenseCategories();
    const summaryQuery = useExpensesSummary();
    const [page, setPage] = useState(1);
    const categories = categoriesQuery.data ?? [];
    const expenses = summaryQuery.data ?? [];

    const expenses_summary: ParsedExpenseSummary[] = expenses.map((exp) => {
        return {
            ...exp,
            category: exp.category,
            total: parseFloat(exp.total),
        };
    });

    // eslint-disable-next-line no-return-assign, no-param-reassign, no-sequences
    const categoryMapping: CategoryMapping = categories.reduce(
        (obj: CategoryMapping, item) => ((obj[item.id] = item.name), obj),
        {}
    );
    const summaryGroups: SummaryGroups = expenses_summary.reduce(
        (obj: SummaryGroups, item) => ((obj[item.date] = {}), obj),
        {}
    );

    expenses_summary.forEach((item) => {
        summaryGroups[item.date][item.category] = item.total;
    });

    const ITEMS_PER_PAGE = 12;
    const totalPages = Math.ceil(Object.keys(summaryGroups).length / ITEMS_PER_PAGE);
    const indexOfLastItem = page * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

    return (
        <ComponentStateHandler queries={[categoriesQuery, summaryQuery]}>
            <Paginate totalPages={totalPages} currentPage={page} setCurrentPage={setPage} />
            <ExpensesSummaryList
                summaryGroups={Object.entries(summaryGroups).slice(indexOfFirstItem, indexOfLastItem)}
                categoryMapping={categoryMapping}
            />
        </ComponentStateHandler>
    );
};
