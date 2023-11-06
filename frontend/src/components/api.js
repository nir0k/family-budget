// components/Api.js
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


export const fetchAccounts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/account/`, {
        headers: getHeaders(),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Fetching accounts failed: ${errorResponse.detail}`);
      }
  
      return response.json();
    } catch (error) {
      throw new Error(`Fetching accounts failed: ${error.message}`);
    }
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

export const fetchIncomeItems = () => {
    return fetch(`${BASE_URL}/incomeitem/`, {
        headers: getHeaders(),
    })
    .then(response => response.json())
    .then(data => data.results);
};

export const fetchCurrencies = async () => {
    try {
        const response = await fetch(`${BASE_URL}/currency/`, {
            headers: getHeaders(),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching currencies:', error);
        throw error;
    }
};

export const createAccount = async (accountData) => {
    try {
        const response = await fetch(`${BASE_URL}/account/`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(accountData),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Creating account failed: ${errorResponse.detail}`);
        }

        return response.json();
    } catch (error) {
        throw new Error(`Creating account failed: ${error.message}`);
    }
};

export const deleteAccount = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/account/${id}/`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Deleting account failed: ${errorResponse.detail}`);
        }

        return response;
    } catch (error) {
        throw new Error(`Deleting account failed: ${error.message}`);
    }
};

export const updateAccount = async (id, accountData) => {
    try {
        const response = await fetch(`${BASE_URL}/account/${id}/`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(accountData),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Updating account failed: ${errorResponse.detail}`);
        }

        return response.json();
    } catch (error) {
        throw new Error(`Updating account failed: ${error.message}`);
    }
};

export const fetchAccountTypes = async () => {
    try {
        const response = await fetch(`${BASE_URL}/account-type/`, {
            headers: getHeaders(),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Fetching account types failed: ${errorResponse.detail}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching account types:', error);
        throw error;
    }
};

// Add this function to create a new category
export const createCategory = async (data) => {
    try {
        const response = await fetch(`${BASE_URL}/category/`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Creating category failed: ${errorResponse.detail}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(`Creating category failed: ${error.message}`);
    }
};

// Add this function to delete a category
export const deleteCategory = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/category/${id}/`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Deleting category failed: ${errorResponse.detail}`);
        }

        return response;
    } catch (error) {
        throw new Error(`Deleting category failed: ${error.message}`);
    }
};

// Add this function to update a category
export const updateCategory = async (id, data) => {
    try {
        const response = await fetch(`${BASE_URL}/category/${id}/`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Updating category failed: ${errorResponse.detail}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(`Updating category failed: ${error.message}`);
    }
};
