import { useSelector } from 'react-redux';
import { useAxiosEffect } from '../../hooks/useAxiosEffect';
import { isLoggedIn } from '../../context/userReducer';
import { expensesService } from '../../services/expenses';
import { AddExpense } from '../addExpense/addExpense';
import Login from '../auth/login';
import { ComponentStateHandler, getAggregatedState } from '../generic/componentStateHandler';
import { ExpensesList } from '../expensesList/expensesList';

const Home = () => {
    const logged = useSelector(isLoggedIn) || false;
    const expensesLoader = getAggregatedState(
        (options) => expensesService.getCategories(options),
        (options) => expensesService.getExpenses(options)
    );
    const state = useAxiosEffect(expensesLoader, [], [[], []]);
    const [categories, expenses] = state.data;

    if (!logged) {
        return <Login />;
    }

    const expenses_with_date = expenses.map((exp) => {
        return { ...exp, date: new Date(exp.date) };
    });

    return (
        <ComponentStateHandler state={state}>
            <AddExpense categories={categories} />
            <ExpensesList expenses={expenses_with_date} categories={categories} />
        </ComponentStateHandler>
    );
};

export default Home;
