import { useState } from 'react';
import { useExpenseCategories, useAllExpenses } from '../../hooks/queries';
import { ComponentStateHandler } from '../../components/ComponentStateHandler';
import { ExpensesList } from './ExpensesList';
import { Paginate } from '../../components/Paginate';
import { CategoryMapping } from '../../types/api';

export const ExpensesAll = () => {
    const categoriesQuery = useExpenseCategories();
    const expensesQuery = useAllExpenses();
    const [page, setPage] = useState(1);

    const categories = categoriesQuery.data ?? [];
    const expenses = expensesQuery.data ?? [];

    const parsedExpenses = expenses.map((exp) => {
        return { ...exp, date: new Date(exp.date), comment: exp.comment || '', amount: parseFloat(exp.amount) };
    });

    const categoryMapping: CategoryMapping = Object.fromEntries(categories.map((item) => [item.id, item.name]));

    const ITEMS_PER_PAGE = 40;
    const totalPages = Math.ceil(parsedExpenses.length / ITEMS_PER_PAGE);
    const indexOfLastItem = page * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

    return (
        <ComponentStateHandler queries={[categoriesQuery, expensesQuery]}>
            <Paginate totalPages={totalPages} currentPage={page} setCurrentPage={setPage} />
            <ExpensesList
                expenses={parsedExpenses.slice(indexOfFirstItem, indexOfLastItem)}
                categoryMapping={categoryMapping}
            />
        </ComponentStateHandler>
    );
};
