import axios from 'axios';

const API_PREFIX = 'expenses';
const API_VERSION = 'v1';

const getCategories = async (options = undefined) => {
    return axios.get(`/${API_PREFIX}/${API_VERSION}/categories/`, options);
};

const getExpenses = async (options = undefined) => {
    return axios.get(`/${API_PREFIX}/${API_VERSION}/expenses/`, options);
};

const getExpensesSummary = async (options = undefined) => {
    return axios.get(`/${API_PREFIX}/${API_VERSION}/expenses/summary/`, options);
};

const getExpensesByDate = async (year, month, options = undefined) => {
    return axios.get(`/${API_PREFIX}/${API_VERSION}/expenses/${year}/${month}/`, options);
};

const addExpense = async (data, options = undefined) => {
    return axios.post(`/${API_PREFIX}/${API_VERSION}/expenses/`, data, options);
};

const getExpense = async (id, options = undefined) => {
    return axios.get(`/${API_PREFIX}/${API_VERSION}/expenses/${id}/`, options);
};

const updateExpense = async (id, data, options = undefined) => {
    return axios.put(`/${API_PREFIX}/${API_VERSION}/expenses/${id}/`, data, options);
};

const deleteExpense = async (id, options = undefined) => {
    return axios.delete(`/${API_PREFIX}/${API_VERSION}/expenses/${id}/`, options);
};

export const expensesService = {
    getCategories,
    getExpenses,
    addExpense,
    getExpense,
    getExpensesByDate,
    getExpensesSummary,
    updateExpense,
    deleteExpense,
};
