import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, fetchUserData } from './Api'; 


const Login = ({ updateUserDetails }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const response = await login({ email, password });
      if (response.auth_token) {
          localStorage.setItem('authToken', `Token ${response.auth_token}`);
          // Fetch user data and update the state in App component
          fetchUserData().then(userData => {
              updateUserDetails({
                  username: userData.username,
                  familyTitle: userData.family?.title
              });
          });
          navigate('/');
      } else {
          setErrorMessage('Invalid login credentials.');
      }
    } catch (error) {
        setErrorMessage('An error occurred while trying to log in.');
    }
  // };
  };

  return (
    <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        width: '100vw' 
      }}>
      <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          marginTop: '-50px'
      }}>
        <h2>Login</h2>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
