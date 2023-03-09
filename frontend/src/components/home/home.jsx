import { useSelector } from 'react-redux';
import { useState } from 'react';
import { HStack } from '@chakra-ui/react';
import { useAxiosEffect } from '../../hooks/useAxiosEffect';
import { isLoggedIn } from '../../context/userReducer';
import { expensesService } from '../../services/expenses';
import Login from '../auth/login';
import { ComponentStateHandler, getAggregatedState } from '../generic/componentStateHandler';
import { ExpensesList } from '../expensesList/expensesList';
import { AddExpense } from '../expensesList/addExpense';
import { CategorySummary } from '../expensesList/categorySummary';
import { LinkPanel } from './linkPanel';
import { byDate, byNumber, reverse } from '../generic/sortUtil';

const Home = () => {
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

    const currentMonth = new Date().getMonth();
    const expenses_with_date = expenses
        .map((exp) => {
            return { ...exp, date: new Date(exp.date), comment: exp.comment || '', amount: parseFloat(exp.amount) };
        })
        .filter(({ date }) => date.getMonth() === currentMonth)
        .sort((t1, t2) => byDate(t1.date, t2.date) || reverse(byNumber(t1.id, t2.id)));

    // eslint-disable-next-line no-return-assign, no-param-reassign, no-sequences
    const categoryMapping = categories.reduce((obj, item) => ((obj[item.id] = item.name), obj), {});

    const updateFunc = () => {
        setRefresher(refresher + 1);
    };

    return (
        <ComponentStateHandler state={state}>
            <AddExpense categories={categories} updateFunc={updateFunc} />
            <ExpensesList expenses={expenses_with_date} categoryMapping={categoryMapping} updateFunc={updateFunc} />
            <HStack mt={10} w="full" maxW="xl" flex justifyContent="space-between">
                <CategorySummary expenses={expenses_with_date} categoryMapping={categoryMapping} />
                <LinkPanel />
            </HStack>
        </ComponentStateHandler>
    );
};

export default Home;
