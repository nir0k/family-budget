// components/TransactionGrid.js
import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { fetchTransactions, fetchCategories, fetchAccounts, fetchTransactionTypes, fetchUsers, deleteTransaction, updateTransaction, createTransaction } from './Api';


const Transactions = () => {
    const [rowData, setRowData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [transactionTypes, setTransactionTypes] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchTransactions()
            .then(data => {
                setRowData(data);
            })
            .catch(error => {
                console.error('Error fetching transactions:', error);
            });

        fetchCategories()
            .then(data => setCategories(data));

        fetchAccounts()
            .then(data => setAccounts(data));

        fetchTransactionTypes()
            .then(data => setTransactionTypes(data));

        fetchUsers()
            .then(data => setUsers(data));
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
        // author: '',
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
                // author: '',
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
        {
            headerName: "Type",
            field: "type",
            sortable: true,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: transactionTypes.map(type => type.title)
            }
        },
        {
            headerName: "Category",
            field: "category",
            sortable: true,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: categories.map(cat => cat.title)
            }
        },
        {
            headerName: "Who",
            field: "who",
            sortable: true,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: users.map(users => users.username)
            }
        },
        {
            headerName: "Account",
            field: "account",
            sortable: true,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: accounts.map(accounts => accounts.title)
            }
        },
        { headerName: "Amount", field: "amount", sortable: true, editable: true, valueFormatter: currencyFormatter },
        { headerName: "Description", field: "description", sortable: true, editable: true },
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
                    {/* ... input fields */}
                    <div>
                        <label>Title:</label>
                        <input value={newTransaction.title} onChange={e => setNewTransaction(prev => ({ ...prev, title: e.target.value }))} />
                    </div>
                    <div>
                        <label>Type:</label>
                        <select value={newTransaction.type} onChange={e => setNewTransaction(prev => ({ ...prev, type: e.target.value }))}>
                            {transactionTypes.map(type => <option key={type.id} value={type.title}>{type.title}</option>)}
                        </select>
                    </div>
                    <div>
                        <label>Category:</label>
                        <select value={newTransaction.category} onChange={e => setNewTransaction(prev => ({ ...prev, category: e.target.value }))}>
                            {categories.map(cat => <option key={cat.id} value={cat.title}>{cat.title}</option>)}
                        </select>
                    </div>
                    <div>
                        <label>Who:</label>
                        <select value={newTransaction.user} onChange={e => setNewTransaction(prev => ({ ...prev, user: e.target.value }))}>
                            {users.map(user => <option key={user.id} value={user.username}>{user.username}</option>)}
                        </select>
                    </div>
                    <div>
                        <label>Account:</label>
                        <select value={newTransaction.account} onChange={e => setNewTransaction(prev => ({ ...prev, account: e.target.value }))}>
                            {accounts.map(account => <option key={account.id} value={account.title}>{account.title}</option>)}
                        </select>
                    </div>
                    <div>
                        <label>Amount:</label>
                        <input value={newTransaction.amount} onChange={e => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))} />
                    </div>
                    <div>
                        <label>Description:</label>
                        <input value={newTransaction.description} onChange={e => setNewTransaction(prev => ({ ...prev, description: e.target.value }))} />
                    </div>
                    <div>
                        <label>Date:</label>
                        <input type="date" value={newTransaction.date} onChange={e => setNewTransaction(prev => ({ ...prev, date: e.target.value }))} />
                    </div>
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
