// App.js
import React from 'react';
import './App.css';
import TransactionGrid from './components/TransactionGrid';
import MainPage from './MainPage';
import NavigationBar from './components/NavigationBar';
import Login from './components/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BudgetGrid from './components/BudgetGrid';
import Logout from './components/Logout';

function App() {
    return (
        <BrowserRouter>
            <div>
                <NavigationBar />
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/transactions" element={<TransactionGrid />} />
                    <Route path="/budget" element={<BudgetGrid />} />
                    {/* Add other routes as needed */}
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
