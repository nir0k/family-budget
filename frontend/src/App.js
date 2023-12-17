// App.js
import React, { useState, useEffect } from 'react';
import './components/css/App.css';
import './components/css/common.css';
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
import ProtectedRoute from './components/ProtectedRoute';
import ExchangeRatesGrid from './components/ExchangeRatesPage';
import CurrencyGrid from './components/CurrencyPage';


function App() {

    const [userDetails, setUserDetails] = useState({ username: '', familyTitle: '' });

    const updateUserDetails = (newDetails) => {
        setUserDetails(newDetails);
    };

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            fetchUserData().then(data => {
                if (data) {
                    setUserDetails({
                        username: data.username,
                        familyTitle: data.family?.title
                    });
                }
            });
        }
    }, []);

    return (
        <BrowserRouter>
            <div>
                <NavigationBar userDetails={userDetails} />
                <Routes>
                    <Route path="/" element={
                        <ProtectedRoute>
                            <MainPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/login" element={<Login updateUserDetails={updateUserDetails} />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/transactions" element={
                        <ProtectedRoute>
                            <TransactionGrid />
                        </ProtectedRoute>
                    } />
                    <Route path="/budget" element={
                        <ProtectedRoute>
                            <BudgetGrid />
                        </ProtectedRoute>
                    } />
                    <Route path="/accounts" element={
                        <ProtectedRoute>
                            <AccountsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/categories" element={
                        <ProtectedRoute>
                            <CategoriesPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/family-finance-state" element={
                        <ProtectedRoute>
                            <FamilyFinanceState />
                        </ProtectedRoute>
                    } />
                    <Route path="/family" element={
                        <ProtectedRoute>
                            <FamilyPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/exchange-rate" element={
                        <ProtectedRoute>
                            <ExchangeRatesGrid />
                        </ProtectedRoute>
                    } />
                    <Route path="/currency" element={
                        <ProtectedRoute>
                            <CurrencyGrid />
                        </ProtectedRoute>
                    } />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
