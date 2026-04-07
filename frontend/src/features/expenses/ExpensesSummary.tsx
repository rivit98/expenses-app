import { useState } from 'react';
import { useExpenseCategories, useExpensesSummary } from '../../hooks/queries';
import { ComponentStateHandler } from '../../components/ComponentStateHandler';
import { Paginate } from '../../components/Paginate';
import { ExpensesSummaryList } from './ExpensesSummaryList';
import { CategoryMapping, ParsedExpenseSummary, SummaryGroups } from '../../types/api';

export const ExpensesMonthlySummary = () => {
    const categoriesQuery = useExpenseCategories();
    const summaryQuery = useExpensesSummary();
    const [page, setPage] = useState(1);
    const categories = categoriesQuery.data ?? [];
    const expenses = summaryQuery.data ?? [];

    const parsedSummary: ParsedExpenseSummary[] = expenses.map((exp) => {
        return {
            ...exp,
            category: exp.category,
            total: parseFloat(exp.total),
        };
    });

    const categoryMapping: CategoryMapping = Object.fromEntries(categories.map((item) => [item.id, item.name]));
    const summaryGroups: SummaryGroups = Object.fromEntries(parsedSummary.map((item) => [item.date, {}]));

    parsedSummary.forEach((item) => {
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
