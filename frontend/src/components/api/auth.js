import { BASE_URL } from '../config';

export const login = async ({ email, password }) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/token/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Login failed: ${errorResponse.detail}`);
      }
  
      return response.json();
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
};