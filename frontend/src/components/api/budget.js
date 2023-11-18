import { BASE_URL } from '../config';
import { getHeaders } from './apiUtils';

export const fetchBudgets = () => {
    return fetch(`${BASE_URL}/budget/`, {
        headers: getHeaders(),
    })
    .then(response => response.json())
    .then(data => data.results);
};

export const updateBudget = (budgetId, field, newValue) => {
    const data = { [field]: newValue };
    return fetch(`${BASE_URL}/budget/${budgetId}/`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
    })
    .then(response => response.json());
};

export const fetchIncomeItems = () => {
    return fetch(`${BASE_URL}/incomeitem/`, {
        headers: getHeaders(),
    })
    .then(response => response.json())
    .then(data => data.results);
};

export const updateExpense = (expenseId, field, newValue) => {
    const data = { [field]: newValue };
    return fetch(`${BASE_URL}/expenseitem/${expenseId}/`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
    })
    .then(response => response.json());
};