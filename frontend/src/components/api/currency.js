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