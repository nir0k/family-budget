import { BASE_URL } from '../config';
import { getHeaders } from './apiUtils';


export const fetchFamilies = async () => {
    try {
        const response = await fetch(`${BASE_URL}/family/`, {
            headers: getHeaders(),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with fetching families:', error);
    }
};

export const fetchUserById = async (userId) => {
    try {
        const response = await fetch(`${BASE_URL}/users/${userId}`, {
            headers: getHeaders(),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error(`There was a problem with fetching user ${userId}:`, error);
    }
};

export const updateFamilyTitle = async (familyId, newTitle) => {
    try {
        const response = await fetch(`${BASE_URL}/family/${familyId}/`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ title: newTitle })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error(`Error updating family title: ${error}`);
    }
};

export const removeFamilyMember = async (familyId, memberId) => {
    try {
        const response = await fetch(`${BASE_URL}/family/${familyId}/members/${memberId}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error(`Error removing family member: ${error}`);
    }
};

export const addFamilyMember = async (familyId, email) => {
    try {
        const response = await fetch(`${BASE_URL}/family/${familyId}/add-member/`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ email })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error(`Error adding family member: ${error}`);
    }
};