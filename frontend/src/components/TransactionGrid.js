// Transactions.js
import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { fetchTransactions, deleteTransaction, updateTransaction, createTransaction } from './api';


const Transactions = () => {
    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        fetchTransactions().then(data => setRowData(data));
    }, []);

    const removeSelected = () => {
        const selectedNodes = gridApi.getSelectedNodes();
        const selectedIds = selectedNodes.map(node => node.data.id);
        selectedIds.forEach(id => {
            deleteTransaction(id).then(() => {
                gridApi.applyTransaction({ remove: selectedNodes.map(node => node.data) });
            });
        });
    };

    const currencyFormatter = (params) => {
        return parseFloat(params.value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const dateFormatter = (params) => {
        let dateObj = new Date(params.value);
        return dateObj.toLocaleDateString();  // Format: MM/DD/YYYY
    }

    const getCurrentDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const onCellValueChanged = (params) => {
        const id = params.data.id;
        const updatedField = params.colDef.field;
        const newValue = params.newValue;
        updateTransaction(id, {
            ...params.data, 
            [updatedField]: newValue
        }).then(res => {
            if (!res.ok) {
                console.error('Failed to update data in backend');
            }
        });
    };

    const [newTransaction, setNewTransaction] = useState({
        title: '',
        type: '',
        category: '',
        who: '',
        account: '',
        amount: '',
        description: '',
        author: '',
        date: getCurrentDate()
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createTransaction(newTransaction).then(data => {
            if (gridApi) {
                gridApi.applyTransaction({ add: [data] });
            }
            setNewTransaction({
                title: '',
                type: '',
                category: '',
                who: '',
                account: '',
                amount: '',
                description: '',
                author: '',
                date: ''
            });
        }).catch(error => {
            console.error('Error adding new transaction:', error);
        });
    };
    
    const [gridApi, setGridApi] = useState(null);

    const onGridReady = params => {
        setGridApi(params.api);
        params.api.sizeColumnsToFit();
    };

    const originalColumnDefs = [
        { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
        { headerName: "Title", field: "title", sortable: true, editable: true },
        { headerName: "Type", field: "type", sortable: true, editable: true },
        { headerName: "Category", field: "category", sortable: true, editable: true },
        { headerName: "Who", field: "who", sortable: true, editable: true },
        { headerName: "Account", field: "account", sortable: true, editable: true },
        { headerName: "Amount", field: "amount", sortable: true, editable: true, valueFormatter: currencyFormatter },
        { headerName: "Description", field: "description", sortable: true, editable: true },
        { headerName: "Author", field: "author", sortable: true, editable: true },
        { headerName: "Date", field: "date", sortable: true, editable: true, valueFormatter: dateFormatter }
    ];

    const columnDefs = originalColumnDefs.map(col => ({
        ...col,
        cellStyle: { textAlign: 'left' }
    }));


    return (
        <div>
            <div style={{ marginBottom: '10px' }}>
                <button onClick={removeSelected}>Remove Selected</button>
                {/* ... other buttons as needed */}
            </div>
            <div>
                <h3>Add Transaction</h3>
                <form onSubmit={handleSubmit}>
                    <input placeholder="Title" value={newTransaction.title} onChange={e => setNewTransaction({ ...newTransaction, title: e.target.value })} />
                    <input placeholder="Type" value={newTransaction.type} onChange={e => setNewTransaction({ ...newTransaction, type: e.target.value })} />
                    <input placeholder="Category" value={newTransaction.category} onChange={e => setNewTransaction({ ...newTransaction, category: e.target.value })} />
                    <input placeholder="Who" value={newTransaction.who} onChange={e => setNewTransaction({ ...newTransaction, who: e.target.value })} />
                    <input placeholder="Account" value={newTransaction.account} onChange={e => setNewTransaction({ ...newTransaction, account: e.target.value })} />
                    <input placeholder="Amount" value={newTransaction.amount} onChange={e => setNewTransaction({ ...newTransaction, amount: e.target.value })} />
                    <input placeholder="Description" value={newTransaction.description} onChange={e => setNewTransaction({ ...newTransaction, description: e.target.value })} />
                    <input placeholder="Author" value={newTransaction.author} onChange={e => setNewTransaction({ ...newTransaction, author: e.target.value })} />
                    <input placeholder="Date" value={newTransaction.date} onChange={e => setNewTransaction({ ...newTransaction, date: e.target.value })} />
                    
                    <button type="submit">Add</button>
                </form>
            </div>
            <div className="ag-theme-alpine-dark" style={{ height: 400, width: '100%' }}>
                <AgGridReact
                columnDefs={columnDefs}
                rowData={rowData}
                rowSelection="multiple"
                onGridReady={onGridReady}
                onCellValueChanged={onCellValueChanged}
                />
            </div>
        </div>
    );
}

export default Transactions;
