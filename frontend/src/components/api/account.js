import { BASE_URL } from '../config';
import { getHeaders } from './apiUtils';

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

export const fetchFamilyState = async () => {
    try {
        const response = await fetch(`${BASE_URL}/family-state/`, {
            headers: getHeaders(),
        });

        if (!response.ok) {
            if(response.headers.get("content-type").includes("application/json")) {
                const errorResponse = await response.json();
                throw new Error(`Fetching family state failed: ${errorResponse.detail}`);
            } else {
                const errorText = await response.text();
                throw new Error(`Fetching family state failed: ${errorText}`);
            }
        }

        return response.json();
    } catch (error) {
        throw new Error(`Fetching family state failed: ${error.message}`);
    }
};
