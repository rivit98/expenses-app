import { useState } from 'react';
import { useAxiosEffect } from '../../hooks/useAxiosEffect';
import { expensesService } from '../../services/expenses';
import { ComponentStateHandler, getAggregatedState } from '../generic/componentStateHandler';
import { ExpensesList } from '../expensesList/expensesList';
import { AddExpense } from '../expensesList/addExpense';
import { CategorySummary } from '../expensesList/categorySummary';
import { LinkPanel } from './linkPanel';
import { Category, CategoryMapping, Expense, ParsedExpense } from '../../types/api';

const Home = () => {
    const today = new Date();

    const expensesLoader = getAggregatedState<[Category[], Expense[]]>(expensesService.getCategories, () =>
        expensesService.getExpensesByDate(today.getFullYear(), today.getMonth() + 1)
    );
    const [refresher, setRefresher] = useState(0);
    const state = useAxiosEffect<[Category[], Expense[]]>(expensesLoader, [refresher], [[], []]);
    const [categories, expenses] = state.data;

    const expenses_with_date: ParsedExpense[] = expenses.map((exp) => {
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

    return (
        <ComponentStateHandler state={state}>
            <AddExpense categories={categories} updateFunc={updateFunc} />
            <LinkPanel />
            <ExpensesList expenses={expenses_with_date} categoryMapping={categoryMapping} updateFunc={updateFunc} />
            <CategorySummary expenses={expenses_with_date} categoryMapping={categoryMapping} />
        </ComponentStateHandler>
    );
};

export default Home;
