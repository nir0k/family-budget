import { BASE_URL } from '../config';
import { getHeaders } from './apiUtils';

export const fetchUsers = () => {
    return fetch(`${BASE_URL}/users/`, {
        headers: getHeaders(),
    })
    .then(response => response.json());
};

export const fetchUserData = async () => {
    try {
        const response = await fetch(`${BASE_URL}/users/me/`, {
                headers: getHeaders(),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

export const fetchUserProfile = async () => {
    try {
        const response = await fetch(`${BASE_URL}/users/me/`, {
            method: 'GET',
            headers: getHeaders(),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
};

export const updateUserProfile = async (userData) => {
    try {
        const response = await fetch(`${BASE_URL}/users/me/`, {
            method: 'PUT', // or 'PATCH' for partial updates
            headers: getHeaders(),
            body: JSON.stringify(userData)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating user profile:', error);
    }
};

export const deleteUserProfile = async () => {
    try {
        const response = await fetch(`${BASE_URL}/users/me/`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response; // No need to return JSON for a DELETE request
    } catch (error) {
        console.error('Error deleting user profile:', error);
    }
};