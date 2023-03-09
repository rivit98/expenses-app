import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Heading } from '@chakra-ui/react';
import { useAxiosEffect } from '../../hooks/useAxiosEffect';
import { isLoggedIn } from '../../context/userReducer';
import { expensesService } from '../../services/expenses';
import Login from '../auth/login';
import { ComponentStateHandler, getAggregatedState } from '../generic/componentStateHandler';
import { byDate, byNumber, reverse } from '../generic/sortUtil';
import { ExpensesList } from '../expensesList/expensesList';

export const ExpensesAll = () => {
    const logged = useSelector(isLoggedIn) || false;
    const expensesLoader = getAggregatedState(
        (options) => expensesService.getCategories(options),
        (options) => expensesService.getExpenses(options)
    );
    const [refresher, setRefresher] = useState(0);
    const state = useAxiosEffect(expensesLoader, [refresher], [[], []]);
    const [categories, expenses] = state.data;

    if (!logged) {
        return <Login />;
    }

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

    const totalSum = expenses_with_date.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <ComponentStateHandler state={state}>
            <Heading size="lg"> You spent {totalSum} zł in total</Heading>
            <ExpensesList expenses={expenses_with_date} categoryMapping={categoryMapping} updateFunc={updateFunc} />
        </ComponentStateHandler>
    );
};
