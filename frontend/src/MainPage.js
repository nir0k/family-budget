// MainPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './components/css/MainPage.css'; // Import the CSS file

const MainPage = () => {
    return (
        <div className="main-container"> {/* Apply the CSS class */}
            <h1>Welcome to the Main Page</h1>
            <ul>
                <li><Link to="/transactions">Go to Transactions</Link></li>
                <li><Link to="/budget">Go to Budget</Link></li>
                <li><Link to="/accounts">Go to Accounts</Link></li>
                <li><Link to="/categories">Go to Categories</Link></li>
                <li><Link to="/family-finance-state">Go to Family Finance State</Link></li>
                {/* Add other links here as needed */}
            </ul>
        </div>
    );
};

export default MainPage;
