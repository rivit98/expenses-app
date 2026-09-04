import { useQuery } from '@tanstack/react-query';
import { expensesService } from '../services/expenses';
import { metersService } from '../services/meters';
import type { Category, Expense, ExpenseSummary, Meter, MeterCategory } from '../types/api';

export const queryKeys = {
    expenseCategories: ['expenseCategories'] as const,
    expenses: (year: number, month: number) => ['expenses', year, month] as const,
    allExpenses: ['allExpenses'] as const,
    expensesSummary: ['expensesSummary'] as const,
    meterCategories: ['meterCategories'] as const,
    meters: ['meters'] as const,
};

export const useExpenseCategories = () => {
    return useQuery<Category[]>({
        queryKey: queryKeys.expenseCategories,
        queryFn: () => expensesService.getCategories(),
    });
};

export const useExpensesByDate = (year: number, month: number) => {
    return useQuery<Expense[]>({
        queryKey: queryKeys.expenses(year, month),
        queryFn: () => expensesService.getExpensesByDate(year, month),
    });
};

export const useAllExpenses = () => {
    return useQuery<Expense[]>({
        queryKey: queryKeys.allExpenses,
        queryFn: () => expensesService.getExpenses(),
    });
};

export const useExpensesSummary = () => {
    return useQuery<ExpenseSummary[]>({
        queryKey: queryKeys.expensesSummary,
        queryFn: () => expensesService.getExpensesSummary(),
    });
};

export const useMeterCategories = () => {
    return useQuery<MeterCategory[]>({
        queryKey: queryKeys.meterCategories,
        queryFn: () => metersService.getCategories(),
    });
};

export const useMeters = () => {
    return useQuery<Meter[]>({
        queryKey: queryKeys.meters,
        queryFn: () => metersService.getMeters(),
    });
};
