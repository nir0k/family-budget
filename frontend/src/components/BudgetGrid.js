// src/components/BudgetGrid.js
import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { fetchBudgets, updateBudget, updateExpense } from './api';

const BudgetGrid = () => {
    const [rowData, setRowData] = useState([]);
    const [selectedBudget, setSelectedBudget] = useState(null);

    useEffect(() => {
        fetchBudgets().then(data => setRowData(data));
    }, []);

    const budgetColumns = [
        // ... other columns ...
        { headerName: "Title", field: "title", editable: true },
        { headerName: "Start Date", field: "start_date", editable: true },
        { headerName: "End Date", field: "end_date", editable: true },
        { headerName: "Total Budget", field: "total_budget", editable: true }
    ];
    
    const expenseColumns = [
        // ... other columns ...
        { headerName: "Description", field: "description", editable: true },
        { headerName: "Category", field: "category", editable: true },
        { headerName: "Budget", field: "budget", editable: true },
        { headerName: "Amount", field: "amount", editable: true }
    ];

    const handleBudgetChange = (event) => {
        // You can access the updated value with event.newValue
        // and the row data with event.data
    
        // Call API to update the budget item
        updateBudget(event.data.id, event.colDef.field, event.newValue);
    };
    
    const handleExpenseChange = (event) => {
        // Call API to update the expense item
        updateExpense(event.data.id, event.colDef.field, event.newValue);
    };
    
    

    return (
        <div style={{ width: "100%", height: "500px" }}>
            <div className="ag-theme-alpine" style={{ height: '250px', width: '100%' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={budgetColumns}
                    domLayout='autoHeight'
                    onRowClicked={e => setSelectedBudget(e.data)}
                    onCellValueChanged={handleBudgetChange}
                />
            </div>

            <h2>Expense Items</h2>
            {selectedBudget && (
                <div className="ag-theme-alpine" style={{ height: '250px', width: '100%' }}>
                    <AgGridReact
                        rowData={selectedBudget.expense_items}
                        columnDefs={expenseColumns}
                        domLayout='autoHeight'
                        onCellValueChanged={handleExpenseChange}
                    />
                </div>
            )}
        </div>
    );
}

export default BudgetGrid;
