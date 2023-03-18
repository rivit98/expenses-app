import { useState } from 'react';
import { Heading } from '@chakra-ui/react';
import { useAxiosEffect } from '../../hooks/useAxiosEffect';
import { expensesService } from '../../services/expenses';
import { ComponentStateHandler, getAggregatedState } from '../generic/componentStateHandler';
import { byDate, byNumber, reverse } from '../generic/sortUtil';
import { ExpensesList } from '../expensesList/expensesList';
import { round2 } from '../../utils/rounding';
import { Paginate } from '../generic/paginate';

export const ExpensesAll = () => {
    const expensesLoader = getAggregatedState(
        (options) => expensesService.getCategories(options),
        (options) => expensesService.getExpenses(options)
    );
    const [refresher, setRefresher] = useState(0);
    const [page, setPage] = useState(1);
    const state = useAxiosEffect(expensesLoader, [refresher], [[], []]);
    const [categories, expenses] = state.data;

    const expenses_with_date = expenses
        .map((exp) => {
            return { ...exp, date: new Date(exp.date), comment: exp.comment || '', amount: parseFloat(exp.amount) };
        })
        .sort((t1, t2) => byDate(t1.date, t2.date) || reverse(byNumber(t1.id, t2.id)));

    // eslint-disable-next-line no-return-assign, no-param-reassign, no-sequences
    const categoryMapping = categories.reduce((obj, item) => ((obj[item.id] = item.name), obj), {});

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
            <ExpensesList
                expenses={expenses_with_date.slice(indexOfFirstItem, indexOfLastItem)}
                categoryMapping={categoryMapping}
                updateFunc={updateFunc}
            />
            <Paginate totalPages={totalPages} currentPage={page} setCurrentPage={setPage} />
        </ComponentStateHandler>
    );
};
