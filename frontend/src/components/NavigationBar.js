// components/NavigationBar.js
import React from 'react';
import { NavLink, useMatch } from 'react-router-dom';
import Logout from './Logout';

const NavigationBar = () => {
    const isMainPageActive = useMatch('/');
    const isTransactionsActive = useMatch('/transactions');
    const isBudgetsActive = useMatch('/budget');
    const isAccountsActive = useMatch('/accounts');
    const isCategoriesActive = useMatch('/categories');
    const isFamilyFinanceStateActive = useMatch('/family-finance-state')
    const isLoggedIn = Boolean(localStorage.getItem('authToken'));

    return (
        <div className="nav-panel">
            <div className="nav-links">
                {isLoggedIn && <NavLink to="/" className={isMainPageActive ? 'nav-link active-link' : 'nav-link'}>Main Page</NavLink>}
                {isLoggedIn && <NavLink to="/transactions" className={isTransactionsActive ? 'nav-link active-link' : 'nav-link'}>Transactions</NavLink>}
                {isLoggedIn && <NavLink to="/budget" className={isBudgetsActive ? 'nav-link active-link' : 'nav-link'}>Budgets</NavLink>}
                {isLoggedIn && <NavLink to="/accounts" className={isAccountsActive ? 'nav-link active-link' : 'nav-link'}>Accounts</NavLink>}
                {isLoggedIn && <NavLink to="/categories" className={isCategoriesActive ? 'nav-link active-link' : 'nav-link'}>Categories</NavLink>}
                {isLoggedIn && <NavLink to="/family-finance-state" className={isFamilyFinanceStateActive ? 'nav-link active-link' : 'nav-link'}>Family Finance State</NavLink>}
            </div>
            <div>
                {isLoggedIn ? <Logout className="nav-link" linkStyle="active-link"/> : <NavLink to="/login" className="nav-link">Login</NavLink>}
            </div>
        </div>
    );
};

export default NavigationBar;
