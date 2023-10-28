// components/api.js

const BASE_URL = 'http://localhost:8000/api/v1';

const getHeaders = () => {
    const authToken = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': authToken ? authToken : '',
    };
};

export const login = async ({ email, password }) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/token/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Login failed: ${errorResponse.detail}`);
      }
  
      return response.json();
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  };

export const fetchTransactions = (page = 1) => {
    return fetch(`${BASE_URL}/transaction/?page=${page}`, {
        headers: getHeaders(),
    })
    .then(response => response.json());
};

export const deleteTransaction = (id) => {
    return fetch(`${BASE_URL}/transaction/${id}/`, {
        method: 'DELETE',
        headers: getHeaders()
    });
};

export const updateTransaction = (id, data) => {
    return fetch(`${BASE_URL}/transaction/${id}/`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
};

export const createTransaction = (data) => {
    return fetch(`${BASE_URL}/transaction/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    }).then(response => response.json());
};

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

export const updateExpense = (expenseId, field, newValue) => {
    const data = { [field]: newValue };
    return fetch(`${BASE_URL}/expenseitem/${expenseId}/`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
    })
    .then(response => response.json());
};

export const fetchCategories = () => {
    return fetch(`${BASE_URL}/category/`, {
        headers: getHeaders(),
    })
    .then(response => response.json());
};

export const fetchAccounts = () => {
    return fetch(`${BASE_URL}/account/`, {
        headers: getHeaders(),
    })
    .then(response => response.json());
};

export const fetchTransactionTypes = () => {
    return fetch(`${BASE_URL}/transaction-type/`, {
        headers: getHeaders(),
    })
    .then(response => response.json());
};

export const fetchUsers = () => {
    return fetch(`${BASE_URL}/users/`, {
        headers: getHeaders(),
    })
    .then(response => response.json());
};
