const BASE_URL = 'http://localhost:8000/api/v1';

export const fetchTransactions = () => {
    return fetch(`${BASE_URL}/transaction/`)
        .then(response => response.json());
};

export const deleteTransaction = (id) => {
    return fetch(`${BASE_URL}/transaction/${id}/`, {
        method: 'DELETE',
    });
};

export const updateTransaction = (id, data) => {
    return fetch(`${BASE_URL}/transaction/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
};

export const createTransaction = (data) => {
    return fetch(`${BASE_URL}/transaction/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json());
};

export const fetchBudgets = () => {
    return fetch(`${BASE_URL}/budget/`)
        .then(response => response.json());
};

export const updateBudget = (budgetId, field, newValue) => {
    // Create the data object based on the field and newValue
    const data = { [field]: newValue };

    // Call your API to update the budget
    fetch(`${BASE_URL}/budget/${budgetId}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            // Handle any errors here
        }
        return response.json();
    })
    .then(updatedBudget => {
        // Optionally, you can update the rowData state to reflect the changes in the UI
    });
};

export const updateExpense = (expenseId, field, newValue) => {
    // Create the data object based on the field and newValue
    const data = { [field]: newValue };

    // Call your API to update the expense
    fetch(`${BASE_URL}/expenseitem/${expenseId}/`, { // Update this endpoint URL accordingly
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            // Handle any errors here
        }
        return response.json();
    })
    .then(updatedExpense => {
        // Optionally, you can update the rowData state to reflect the changes in the UI
    });
};
