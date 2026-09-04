import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { FieldValues } from 'react-hook-form';
import { authService } from '../services/auth';
import { expensesService } from '../services/expenses';
import { metersService } from '../services/meters';
import type { Expense, LoginData, Meter, UserData } from '../types/api';
import { queryKeys } from './queries';

// Expense mutations

export const useAddExpense = () => {
    const queryClient = useQueryClient();
    return useMutation<Expense, unknown, FieldValues>({
        mutationFn: (data) => expensesService.addExpense(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.expenseCategories });
            queryClient.invalidateQueries({ queryKey: queryKeys.allExpenses });
            queryClient.invalidateQueries({ queryKey: queryKeys.expensesSummary });
            // Invalidate all date-specific expense queries
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
        },
    });
};

export const useUpdateExpense = () => {
    const queryClient = useQueryClient();
    return useMutation<Expense, unknown, { id: number; data: FieldValues }>({
        mutationFn: ({ id, data }) => expensesService.updateExpense(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.allExpenses });
            queryClient.invalidateQueries({ queryKey: queryKeys.expensesSummary });
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
        },
    });
};

export const useDeleteExpense = () => {
    const queryClient = useQueryClient();
    return useMutation<void, unknown, number>({
        mutationFn: (id) => expensesService.deleteExpense(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.allExpenses });
            queryClient.invalidateQueries({ queryKey: queryKeys.expensesSummary });
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
        },
    });
};

// Meter mutations

export const useAddMeter = () => {
    const queryClient = useQueryClient();
    return useMutation<Meter, unknown, FieldValues>({
        mutationFn: (data) => metersService.addMeter(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.meters });
        },
    });
};

export const useUpdateMeter = () => {
    const queryClient = useQueryClient();
    return useMutation<Meter, unknown, { id: number; data: FieldValues }>({
        mutationFn: ({ id, data }) => metersService.updateMeter(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.meters });
        },
    });
};

export const useDeleteMeter = () => {
    const queryClient = useQueryClient();
    return useMutation<void, unknown, number>({
        mutationFn: (id) => metersService.deleteMeter(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.meters });
        },
    });
};

// Auth mutations

export const useLogin = () => {
    return useMutation<UserData, unknown, LoginData>({
        mutationFn: (data) => authService.login(data),
    });
};
