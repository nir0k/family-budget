// components/NavigationBar.js
import React from 'react';
import { NavLink, useMatch } from 'react-router-dom';
import Logout from './Logout';

const NavigationBar = () => {
    const isMainPageActive = useMatch('/');
    const isTransactionsActive = useMatch('/transactions');
    const isBudgetsActive = useMatch('/budget');
    const isLoggedIn = Boolean(localStorage.getItem('authToken'));

    return (
        <div className="nav-panel">
            <div className="nav-links">
                {isLoggedIn && <NavLink to="/" className={isMainPageActive ? 'nav-link active-link' : 'nav-link'}>Main Page</NavLink>}
                {isLoggedIn && <NavLink to="/transactions" className={isTransactionsActive ? 'nav-link active-link' : 'nav-link'}>Transactions</NavLink>}
                {isLoggedIn && <NavLink to="/budget" className={isBudgetsActive ? 'nav-link active-link' : 'nav-link'}>Budgets</NavLink>}
            </div>
            <div>
                {isLoggedIn ? <Logout className="nav-link" linkStyle="active-link"/> : <NavLink to="/login" className="nav-link">Login</NavLink>}
            </div>
        </div>
    );
};

export default NavigationBar;
