// NavigationBar.js
import React from 'react';
import { NavLink, useMatch } from 'react-router-dom';

const NavigationBar = () => {
    const isMainPageActive = useMatch('/');
    const isTransactionsActive = useMatch('/transactions');
    const isBudgetsActive = useMatch('/budgets');  // <-- New line

    return (
        <div className="nav-panel">
            <div className="nav-links"></div>
            <NavLink to="/" className={isMainPageActive ? 'nav-link active-link' : 'nav-link'}>Main Page</NavLink>
            <NavLink to="/transactions" className={isTransactionsActive ? 'nav-link active-link' : 'nav-link'}>Transactions</NavLink>
            <NavLink to="/budgets" className={isBudgetsActive ? 'nav-link active-link' : 'nav-link'}>Budgets</NavLink>  {/* <-- New link */}
        </div>
    );
};

export default NavigationBar;
