import { useState } from 'react';
import { useAxiosEffect } from '../../hooks/useAxiosEffect';
import { expensesService } from '../../services/expenses';
import { ComponentStateHandler, getAggregatedState } from '../generic/componentStateHandler';
import { Paginate } from '../generic/paginate';
import { ExpensesSummaryList } from './expensesSummaryList';

export const ExpensesMonthlySummary = () => {
    const expensesLoader = getAggregatedState(expensesService.getCategories, expensesService.getExpensesSummary);
    const [page, setPage] = useState(1);
    const state = useAxiosEffect(expensesLoader, [], [[], []]);
    const [categories, expenses] = state.data;

    const expenses_summary = expenses.map((exp) => {
        return {
            ...exp,
            category: exp.category,
            total: parseFloat(exp.total),
        };
    });

    const categoryMapping = categories.reduce((obj, item) => ((obj[item.id] = item.name), obj), {});
    const summaryGroups = expenses_summary.reduce((obj, item) => ((obj[item.date] = {}), obj), {});

    expenses_summary.forEach((item) => {
        summaryGroups[item.date][item.category] = item.total;
    });

    const ITEMS_PER_PAGE = 12;
    const totalPages = Math.ceil(Object.keys(summaryGroups).length / ITEMS_PER_PAGE);
    const indexOfLastItem = page * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

    return (
        <ComponentStateHandler state={state}>
            <Paginate totalPages={totalPages} currentPage={page} setCurrentPage={setPage} />
            <ExpensesSummaryList
                summaryGroups={Object.entries(summaryGroups).slice(indexOfFirstItem, indexOfLastItem)}
                categoryMapping={categoryMapping}
            />
        </ComponentStateHandler>
    );
};
