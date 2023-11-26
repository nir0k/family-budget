import { BASE_URL } from '../config';

export const login = async ({ email, password }) => {
    try {
    
      const loginResponse = await fetch(`${BASE_URL}/auth/token/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!loginResponse.ok) {
        const errorResponse = await loginResponse.json();
        throw new Error(`Login failed: ${errorResponse.detail}`);
      }

      const loginData = await loginResponse.json();
      const userResponse = await fetch(`${BASE_URL}/users/me/`, {
        headers: {
          'Authorization': `Token ${loginData.auth_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userData = await userResponse.json();

      localStorage.setItem('authToken', `Token ${loginData.auth_token}`);
      localStorage.setItem('userInfo', JSON.stringify(userData));

    return loginData;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
};