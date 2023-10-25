// components/logout.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ className, linkStyle }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className={`${className} ${linkStyle} nav-button`}>Logout</button>
  );
};

export default Logout;
