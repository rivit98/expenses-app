import { useSelector } from 'react-redux';
import { useAxiosEffect } from '../../hooks/useAxiosEffect';
import { isLoggedIn } from '../../context/userReducer';
import { expensesService } from '../../services/expenses';
import { AddExpense } from '../addExpense/addExpense';
import Login from '../auth/login';
import { ComponentStateHandler, getAggregatedState } from '../generic/componentStateHandler';

const Home = () => {
    const logged = useSelector(isLoggedIn) || false;

    if (!logged) {
        return <Login />;
    }

    const expensesLoader = getAggregatedState((options) => expensesService.getCategories(options));
    const state = useAxiosEffect(expensesLoader, [], [[]]);
    const [categories] = state.data;

    return (
        <ComponentStateHandler state={state}>
            <AddExpense categories={categories} />
        </ComponentStateHandler>
    );
};

export default Home;
