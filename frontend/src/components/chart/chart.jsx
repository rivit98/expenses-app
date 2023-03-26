import { useAxiosEffect } from '../../hooks/useAxiosEffect';
import { expensesService } from '../../services/expenses';
import { ComponentStateHandler, getAggregatedState } from '../generic/componentStateHandler';
import { ChartRenderer } from './chartRenderer';

export const Chart = () => {
    const expensesLoader = getAggregatedState(expensesService.getCategories, expensesService.getExpensesSummary);
    const state = useAxiosEffect(expensesLoader, [], [[], []]);
    const [categories, expenses] = state.data;

    const expenses_summary = expenses.map((exp) => {
        return {
            ...exp,
            category: exp.category,
            total: parseFloat(exp.total),
        };
    });

    const categoryMapping = categories.reduce((obj, item) => ((obj[item.id] = item.name), obj), {});
    const summaryGroups = expenses_summary.reduce((obj, item) => ((obj[item.date] = {}), obj), {});

    expenses_summary.forEach((item) => {
        summaryGroups[item.date][item.category] = item.total;
    });

    return (
        <ComponentStateHandler state={state}>
            <ChartRenderer summaryGroups={Object.entries(summaryGroups)} categoryMapping={categoryMapping} />
        </ComponentStateHandler>
    );
};
