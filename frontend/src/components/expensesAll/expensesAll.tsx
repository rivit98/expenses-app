import { useState } from 'react';
import { useExpenseCategories, useAllExpenses } from '../../hooks/queries';
import { ComponentStateHandler } from '../generic/componentStateHandler';
import { ExpensesList } from '../expensesList/expensesList';
import { Paginate } from '../generic/paginate';
import { CategoryMapping } from '../../types/api';

export const ExpensesAll = () => {
    const categoriesQuery = useExpenseCategories();
    const expensesQuery = useAllExpenses();
    const [page, setPage] = useState(1);

    const categories = categoriesQuery.data ?? [];
    const expenses = expensesQuery.data ?? [];

    const expenses_with_date = expenses.map((exp) => {
        return { ...exp, date: new Date(exp.date), comment: exp.comment || '', amount: parseFloat(exp.amount) };
    });

    // eslint-disable-next-line no-return-assign, no-param-reassign, no-sequences
    const categoryMapping: CategoryMapping = categories.reduce(
        (obj: CategoryMapping, item) => ((obj[item.id] = item.name), obj),
        {}
    );

    const ITEMS_PER_PAGE = 40;
    const totalPages = Math.ceil(expenses_with_date.length / ITEMS_PER_PAGE);
    const indexOfLastItem = page * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

    return (
        <ComponentStateHandler queries={[categoriesQuery, expensesQuery]}>
            <Paginate totalPages={totalPages} currentPage={page} setCurrentPage={setPage} />
            <ExpensesList
                expenses={expenses_with_date.slice(indexOfFirstItem, indexOfLastItem)}
                categoryMapping={categoryMapping}
            />
        </ComponentStateHandler>
    );
};
