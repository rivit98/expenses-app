import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useAxiosEffect } from '../../hooks/useAxiosEffect';
import { isLoggedIn } from '../../context/userReducer';
import { expensesService } from '../../services/expenses';
import Login from '../auth/login';
import { ComponentStateHandler, getAggregatedState } from '../generic/componentStateHandler';
import { ExpensesList } from '../expensesList/expensesList';
import { AddExpense } from '../expensesList/addExpense';
import { CategorySummary } from '../expensesList/categorySummary';

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

    const expenses_with_date = expenses.map((exp) => {
        return { ...exp, date: new Date(exp.date), comment: exp.comment || '', amount: parseFloat(exp.amount) };
    });

    const updateFunc = () => {
        setRefresher(refresher + 1);
    };

    return (
        <ComponentStateHandler state={state}>
            <AddExpense categories={categories} updateFunc={updateFunc} />
            <ExpensesList expenses={expenses_with_date} categories={categories} updateFunc={updateFunc} />
            <CategorySummary expenses={expenses_with_date} categories={categories} />
        </ComponentStateHandler>
    );
};

export default Home;
