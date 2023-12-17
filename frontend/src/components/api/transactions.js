import { BASE_URL } from '../config';
import { getHeaders } from './apiUtils';


export const fetchTransactions = (page = 1) => {
    return fetch(`${BASE_URL}/transaction/?page=${page}`, {
        headers: getHeaders(),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    });
};


export const deleteTransaction = (id) => {
    return fetch(`${BASE_URL}/transaction/${id}/`, {
        method: 'DELETE',
        headers: getHeaders()
    });
};

export const updateTransaction = (id, data) => {
    return fetch(`${BASE_URL}/transaction/${id}/`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
};

export const createTransaction = (data) => {
    return fetch(`${BASE_URL}/transaction/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    })
    .then(response => 
        response.json().then(body => ({ 
            status: response.status, 
            ok: response.ok,
            body 
        }))
    );
};

export const fetchTransactionTypes = () => {
    return fetch(`${BASE_URL}/transaction-type/`, {
        headers: getHeaders(),
    })
    .then(response => response.json());
};