// frontend/src/components/api/currency.js
import { BASE_URL } from '../config';
import { getHeaders } from './apiUtils';


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

export const updateCurrency = async (id, updatedCurrency) => {
    try {
        const response = await fetch(`${BASE_URL}/currency/${id}/`, {
            method: 'PATCH',
            headers: {
                ...getHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedCurrency)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating currency:', error);
        throw error;
    }
};

export const createCurrency = async (newCurrency) => {
    try {
        const response = await fetch(`${BASE_URL}/currency/`, {
            method: 'POST',
            headers: {
                ...getHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCurrency)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating currency:', error);
        throw error;
    }
};

export const deleteCurrency = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/currency/${id}`, {
            method: 'DELETE',
            headers: getHeaders() // Your headers
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Only parse JSON if there's a response body
        if (response.status !== 204) {
            return await response.json();
        }
    } catch (error) {
        console.error('Error deleting currency:', error);
        throw error;
    }
};

