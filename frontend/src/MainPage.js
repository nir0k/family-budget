// MainPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
    return (
        <div>
            <h1>Welcome to the Main Page</h1>
            <ul>
                <li><Link to="/transactions">Go to Transactions</Link></li>
                <li><Link to="/budget">Go to Budget</Link></li>
                {/* Add other links here as needed */}
            </ul>
        </div>
    );
};

export default MainPage;
