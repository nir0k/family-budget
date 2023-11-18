import { BASE_URL } from '../config';
import { getHeaders } from './apiUtils';

export const fetchCategories = () => {
    return fetch(`${BASE_URL}/category/`, {
        headers: getHeaders(),
    })
    .then(response => response.json());
};

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