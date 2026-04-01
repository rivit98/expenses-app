import { useMemo } from 'react';
import { useExpenseCategories, useExpensesByDate } from '../../hooks/queries';
import { ComponentStateHandler } from '../generic/componentStateHandler';
import { ExpensesList } from '../expensesList/expensesList';
import { AddExpense } from '../expensesList/addExpense';
import { CategorySummary } from '../expensesList/categorySummary';
import { LinkPanel } from './linkPanel';
import { CategoryMapping, ParsedExpense } from '../../types/api';

const Home = () => {
    const today = useMemo(() => new Date(), []);

    const categoriesQuery = useExpenseCategories();
    const expensesQuery = useExpensesByDate(today.getFullYear(), today.getMonth() + 1);

    const categories = categoriesQuery.data ?? [];
    const expenses = expensesQuery.data ?? [];

    const expenses_with_date: ParsedExpense[] = expenses.map((exp) => {
        return { ...exp, date: new Date(exp.date), comment: exp.comment || '', amount: parseFloat(exp.amount) };
    });

    // eslint-disable-next-line no-return-assign, no-param-reassign, no-sequences
    const categoryMapping: CategoryMapping = categories.reduce(
        (obj: CategoryMapping, item) => ((obj[item.id] = item.name), obj),
        {}
    );

    return (
        <ComponentStateHandler queries={[categoriesQuery, expensesQuery]}>
            <AddExpense categories={categories} />
            <LinkPanel />
            <ExpensesList expenses={expenses_with_date} categoryMapping={categoryMapping} />
            <CategorySummary expenses={expenses_with_date} categoryMapping={categoryMapping} />
        </ComponentStateHandler>
    );
};

export default Home;
