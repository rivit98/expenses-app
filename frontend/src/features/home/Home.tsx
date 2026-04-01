import { useMemo } from 'react';
import { useExpenseCategories, useExpensesByDate } from '../../hooks/queries';
import { ComponentStateHandler } from '../../components/ComponentStateHandler';
import { ExpensesList } from '../expenses/ExpensesList';
import { AddExpense } from '../expenses/AddExpense';
import { CategorySummary } from '../expenses/CategorySummary';
import { LinkPanel } from '../../components/LinkPanel';
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

    const categoryMapping: CategoryMapping = Object.fromEntries(categories.map((item) => [item.id, item.name]));

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
