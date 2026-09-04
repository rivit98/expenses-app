import type { AxiosRequestConfig } from 'axios';
import type { Category, Expense, ExpenseSummary } from '../types/api';
import { api } from '../utils/axiosConfig';

const API_PREFIX = 'expenses';
const API_VERSION = 'v1';

const getCategories = async (options?: AxiosRequestConfig): Promise<Category[]> => {
    return api.get(`/${API_PREFIX}/${API_VERSION}/categories/`, options);
};

const getExpenses = async (options?: AxiosRequestConfig): Promise<Expense[]> => {
    return api.get(`/${API_PREFIX}/${API_VERSION}/expenses/`, options);
};

const getExpensesSummary = async (options?: AxiosRequestConfig): Promise<ExpenseSummary[]> => {
    return api.get(`/${API_PREFIX}/${API_VERSION}/expenses/summary/`, options);
};

const getExpensesByDate = async (year: number, month: number, options?: AxiosRequestConfig): Promise<Expense[]> => {
    return api.get(`/${API_PREFIX}/${API_VERSION}/expenses/${year}/${month}/`, options);
};

const addExpense = async (data: Partial<Expense>, options?: AxiosRequestConfig): Promise<Expense> => {
    return api.post(`/${API_PREFIX}/${API_VERSION}/expenses/`, data, options);
};

const updateExpense = async (id: number, data: Partial<Expense>, options?: AxiosRequestConfig): Promise<Expense> => {
    return api.put(`/${API_PREFIX}/${API_VERSION}/expenses/${id}/`, data, options);
};

const deleteExpense = async (id: number, options?: AxiosRequestConfig): Promise<void> => {
    return api.delete(`/${API_PREFIX}/${API_VERSION}/expenses/${id}/`, options);
};

export const expensesService = {
    getCategories,
    getExpenses,
    addExpense,
    getExpensesByDate,
    getExpensesSummary,
    updateExpense,
    deleteExpense,
};
