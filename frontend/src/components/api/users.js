import { BASE_URL } from '../config';
import { getHeaders } from './apiUtils';

export const fetchUsers = () => {
    return fetch(`${BASE_URL}/users/`, {
        headers: getHeaders(),
    })
    .then(response => response.json());
};