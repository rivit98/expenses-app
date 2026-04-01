import { useState } from 'react';
import { Heading } from '@chakra-ui/react';
import { useAxiosEffect } from '../../hooks/useAxiosEffect';
import { expensesService } from '../../services/expenses';
import { ComponentStateHandler, getAggregatedState } from '../generic/componentStateHandler';
import { ExpensesList } from '../expensesList/expensesList';
import { round2 } from '../../utils/rounding';
import { Paginate } from '../generic/paginate';
import { Category, CategoryMapping, Expense } from '../../types/api';

export const ExpensesAll = () => {
    const expensesLoader = getAggregatedState<[Category[], Expense[]]>(
        expensesService.getCategories,
        expensesService.getExpenses
    );
    const [refresher, setRefresher] = useState(0);
    const [page, setPage] = useState(1);
    const state = useAxiosEffect<[Category[], Expense[]]>(expensesLoader, [refresher], [[], []]);
    const [categories, expenses] = state.data;

    const expenses_with_date = expenses.map((exp) => {
        return { ...exp, date: new Date(exp.date), comment: exp.comment || '', amount: parseFloat(exp.amount) };
    });

    // eslint-disable-next-line no-return-assign, no-param-reassign, no-sequences
    const categoryMapping: CategoryMapping = categories.reduce(
        (obj: CategoryMapping, item) => ((obj[item.id] = item.name), obj),
        {}
    );

    const updateFunc = () => {
        setRefresher(refresher + 1);
    };

    const ITEMS_PER_PAGE = 40;
    const totalSum = expenses_with_date.reduce((acc, curr) => acc + curr.amount, 0);
    const totalPages = Math.ceil(expenses_with_date.length / ITEMS_PER_PAGE);
    const indexOfLastItem = page * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

    return (
        <ComponentStateHandler state={state}>
            <Heading size="lg"> You spent {round2(totalSum)} zł in total</Heading>
            <Paginate totalPages={totalPages} currentPage={page} setCurrentPage={setPage} />
            <ExpensesList
                expenses={expenses_with_date.slice(indexOfFirstItem, indexOfLastItem)}
                categoryMapping={categoryMapping}
                updateFunc={updateFunc}
            />
        </ComponentStateHandler>
    );
};
