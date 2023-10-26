// components/BudgetGrid.js
import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { fetchBudgets, updateBudget, updateExpense } from './Api';

const BudgetGrid = () => {
    const [rowData, setRowData] = useState([]);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const expenseRowStyle = (params) => {
        if (params.data.expense > params.data.amount) {
            return { backgroundColor: '#E97451' }; 
        }
        if (params.data.expense < params.data.amount) {
            return { backgroundColor: '#5F8575' }; 
        }
        return {};
    };
    const budgetRowStyle = (params) => {
        if (params.data.total_expense > params.data.total_amount) {
            return { backgroundColor: '#E97451' }; 
        }
        if (params.data.total_expense < params.data.total_amount) {
            return { backgroundColor: '#5F8575' }; 
        }
        return {};
    };
    

    useEffect(() => {
        fetchBudgets().then(data => {
            setRowData(data);
        });
    }, []);

    const budgetColumns = [
        { headerName: "Title", field: "title", editable: true, flex: 1},
        { headerName: "Start Date", field: "start_date", editable: true, flex: 1 },
        { headerName: "End Date", field: "end_date", editable: true, flex: 1 },
        { headerName: "Total Budget", field: "total_budget", editable: true, flex: 1 },
        { headerName: "Total Amount", field: "total_amount", editable: true, flex: 1 },
        { headerName: "Total Expense", field: "total_expense", editable: true, flex: 1 },
    ];

    const expenseColumns = [
        { headerName: "Category", field: "category", editable: true, flex: 1 },
        { headerName: "Budget", field: "budget", editable: true, flex: 1 },
        { headerName: "Amount", field: "amount", editable: true, flex: 1 },
        { headerName: "Expense", field: "expense", editable: true, flex: 1 },
        { headerName: "Description", field: "description", editable: true, flex: 1 },
    ];

    const handleBudgetChange = (event) => {
        updateBudget(event.data.id, event.colDef.field, event.newValue)
            .then(res => {
                if (!res.ok) {
                    console.error('Failed to update data in backend');
                }
            });
    };
    
    const handleExpenseChange = (event) => {
        updateExpense(event.data.id, event.colDef.field, event.newValue)
            .then(res => {
                if (!res.ok) {
                    console.error('Failed to update data in backend');
                }
            });
    };

    return (
        <div style={{ width: "100%", height: "500px" }}>
            <div className="ag-theme-alpine-dark" style={{ height: '250px', width: '100%' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={budgetColumns}
                    domLayout='autoHeight'
                    onRowClicked={e => setSelectedBudget(e.data)}
                    onCellValueChanged={handleBudgetChange}
                    getRowStyle={budgetRowStyle}
                />
            </div>

            <h2>Expense Items</h2>
            {selectedBudget && (
                <div className="ag-theme-alpine-dark" style={{ height: '250px', width: '100%' }}>
                    <AgGridReact
                        rowData={selectedBudget.expense_items}
                        columnDefs={expenseColumns}
                        domLayout='autoHeight'
                        onCellValueChanged={handleExpenseChange}
                        getRowStyle={expenseRowStyle}
                    />
                </div>
            )}
        </div>
    );
}

export default BudgetGrid;
