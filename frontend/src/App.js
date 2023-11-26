// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import TransactionGrid from './components/TransactionGrid';
import MainPage from './MainPage';
import NavigationBar from './components/NavigationBar';
import Login from './components/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BudgetGrid from './components/BudgetGrid';
import Logout from './components/Logout';
import AccountsPage from './components/AccountsPage';
import CategoriesPage from './components/CategoriesPage';
import FamilyFinanceState from './components/FamilyFinanceState';
import { fetchUserData } from './components/Api';
import FamilyPage from './components/FamilyPage';
import ProfilePage from './components/ProfilePage';


function App() {

    const [userDetails, setUserDetails] = useState({ username: '', familyTitle: '' });

    const updateUserDetails = (newDetails) => {
        setUserDetails(newDetails);
    };

    useEffect(() => {
        fetchUserData().then(data => {
            if (data) {
                setUserDetails({
                    username: data.username,
                    familyTitle: data.family?.title
                });
            }
        });
    }, []);

    return (
        <BrowserRouter>
            <div>
                <NavigationBar userDetails={userDetails} />
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/login" element={<Login updateUserDetails={updateUserDetails} />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/transactions" element={<TransactionGrid />} />
                    <Route path="/budget" element={<BudgetGrid />} />
                    <Route path="/accounts" element={<AccountsPage />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/family-finance-state" element={<FamilyFinanceState />} />
                    <Route path="/family" element={<FamilyPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
