// components/api/exchangeRate.js
import { BASE_URL } from '../config';
import { getHeaders } from './apiUtils';


export const fetchExchangeRates = (page = 1) => {
    return fetch(`${BASE_URL}/exchange-rate/?page=${page}`, {
        headers: getHeaders()
    })
    .then(response => response.json());
};

export const deleteExchangeRate = (id) => {
    return fetch(`${BASE_URL}/exchange-rate/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
};

export const addExchangeRate = (newExchangeRateData) => {
    return fetch(`${BASE_URL}/exchange-rate/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newExchangeRateData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Network response was not ok.');
        }
    });
};

export const editExchangeRate = (id, updatedData) => {
    return fetch(`${BASE_URL}/exchange-rate/${id}/`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(updatedData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    });
};