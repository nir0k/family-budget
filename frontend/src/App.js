// App.js
import React from 'react';
import './App.css';
import TransactionGrid from './components/TransactionGrid';
import MainPage from './MainPage';
import NavigationBar from './components/NavigationBar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BudgetGrid from './components/BudgetGrid';

function App() {
  return (
      <Router>
          <div>
              <NavigationBar />
              <Routes>
                  <Route path="/transactions" element={<TransactionGrid />} />
                  <Route path="/" element={<MainPage />} />
                  <Route path="/budgets" element={<BudgetGrid />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;
