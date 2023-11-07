// components/TransactionGrid.js
import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { 
    fetchTransactions,
    fetchCategories,
    fetchAccounts,
    fetchTransactionTypes,
    fetchUsers,
    deleteTransaction,
    updateTransaction,
    createTransaction,
    fetchCurrencies
} from './Api';


const Transactions = () => {
    const [rowData, setRowData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [transactionTypes, setTransactionTypes] = useState([]);
    const [users, setUsers] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [prevPageUrl, setPrevPageUrl] = useState(null);
    const [currencies, setCurrencies] = useState([]);
    useEffect(() => {
        const getCurrencies = async () => {
            try {
                const data = await fetchCurrencies();
                setCurrencies(data);
            } catch (error) {
                console.error('Error fetching currencies:', error);
            }
        };

        getCurrencies();
    }, []);

    const getCurrentDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [newTransaction, setNewTransaction] = useState({
        title: '',
        type: '',
        category: '',
        who: '',
        account: '',
        amount: '',
        description: '',
        date: getCurrentDate()
    });

    useEffect(() => {
        const fetchPageData = () => {
            Promise.all([
                fetchTransactions(currentPage),
                fetchCategories(),
                fetchAccounts(),
                fetchTransactionTypes(),
                fetchUsers()
            ]).then(([transactionsData, categoriesData, accountsData, types, usersData]) => {
                setRowData(transactionsData.results);
                setCategories(categoriesData);
                setAccounts(accountsData);
                setTransactionTypes(types);
                setUsers(usersData);
                setNextPageUrl(transactionsData.next);
                setPrevPageUrl(transactionsData.previous);
                setTotalPages(Math.ceil(transactionsData.count / 50));  
    
                setNewTransaction(prev => ({
                    ...prev,
                    type: types[0]?.id,
                    category: categoriesData[0]?.id,
                    who: usersData[0]?.id,
                    account: accountsData[0]?.id
                }));
            }).catch(error => {
                console.error('Error fetching data:', error);
            });
        };
    
        fetchPageData();
    }, [currentPage]);

    const handleNextPage = () => {
        if (nextPageUrl) {
            setCurrentPage(currentPage + 1);
        }
    };
    
    const handlePrevPage = () => {
        if (prevPageUrl) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleTypeChange = (e) => {
        setNewTransaction(prev => ({ ...prev, type: parseInt(e.target.value) }));
    }
    
    const handleCategoryChange = (e) => {
        setNewTransaction(prev => ({ ...prev, category: parseInt(e.target.value) }));
    }
    
    // const handleWhoChange = (e) => {
    //     setNewTransaction(prev => ({ ...prev, who: parseInt(e.target.value) }));
    // }

    const handleWhoChange = (e) => {
        const userId = parseInt(e.target.value);
        setNewTransaction(prev => ({ ...prev, who: userId }));
        // Filter accounts based on selected user
        const filtered = accounts.filter(account => account.owner === userId);
        setFilteredAccounts(filtered);
        // If the current selected account is not owned by the new user, reset it
        if (!filtered.find(account => account.id === newTransaction.account)) {
            setNewTransaction(prev => ({ ...prev, account: '' }));
        }
    };



    const handleAccountChange = (e) => {
        setNewTransaction(prev => ({ ...prev, account: parseInt(e.target.value) }));
    }

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
        return dateObj.toLocaleDateString();
    }

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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!newTransaction.who) {
            console.error('Who field is required!');
            return;
        }

        createTransaction(newTransaction).then(data => {
            if (gridApi) {
                gridApi.applyTransaction({ add: [data] });
            }
            setNewTransaction({
                title: '',
                type: transactionTypes[0]?.id,
                category: categories[0]?.id,
                who: users[0]?.id,
                account: accounts[0]?.id,
                amount: '',
                currency: currencies[0]?.id || '',
                description: '',
                date: getCurrentDate()
            });
        }).catch(error => {
            console.error('Error adding new transaction:', error);
            if (error.response && error.response.data) {
                console.error('Backend error:', error.response.data.message);
            }
        });
    };
    
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
                values: transactionTypes.map(type => type.id)
            },
            valueFormatter: params => {
                const type = transactionTypes.find(t => t.id === params.value);
                return type ? type.title : '';
            }
        },
        {
            headerName: "Category",
            field: "category",
            sortable: true,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: categories.map(cat => cat.id)
            },
            valueFormatter: params => {
                const cat = categories.find(c => c.id === params.value);
                return cat ? cat.title : '';
            }
        },
        {
            headerName: "Who",
            field: "who",
            sortable: true,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: users.map(user => user.id)
            },
            valueFormatter: params => {
                const user = users.find(user => user.id === params.value);
                return user ? user.username : '';
            }
        },
        {
            headerName: "Account",
            field: "account",
            sortable: true,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: accounts.map(account => account.id)
            },
            valueFormatter: params => {
                const account = accounts.find(account => account.id === params.value);
                return account ? account.title : '';
            }
        },
        { headerName: "Amount", field: "amount", sortable: true, editable: true, valueFormatter: currencyFormatter },
        {
            headerName: "Currency",
            field: "currency",
            sortable: true,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: currencies.map(currency => currency.id)
            },
            valueFormatter: params => {
                const currency = currencies.find(curr => curr.id === params.value);
                return currency ? currency.code : '';
            }
        },
        { headerName: "Description", field: "description", sortable: true, editable: true },
        { headerName: "Date", field: "date", sortable: true, editable: true, valueFormatter: dateFormatter }
    ];

    const columnDefs = originalColumnDefs.map(col => ({
        ...col,
        cellStyle: { textAlign: 'left' }
    }));

    return (
        <div>
            <div className="form-container">
                <h3>Add Transaction</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title:</label>
                        <input value={newTransaction.title} onChange={e => setNewTransaction(prev => ({ ...prev, title: e.target.value }))} />
                    </div>
                    <div className="form-group">
                        <label>Type:</label>
                        <select value={newTransaction.type} onChange={handleTypeChange}>
                            <option value="">Select a type</option>
                            {transactionTypes.map(type => <option key={type.id} value={type.id}>{type.title}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Category:</label>
                        <select value={newTransaction.category} onChange={handleCategoryChange}>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Who:</label>
                        <select value={newTransaction.who} onChange={handleWhoChange}>
                            {users.map(user => <option key={user.id} value={user.id}>{user.username}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Account:</label>
                        <select value={newTransaction.account} onChange={handleAccountChange}>
                            {filteredAccounts.map(account => (
                                <option key={account.id} value={account.id}>{account.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Amount:</label>
                        <input value={newTransaction.amount} onChange={e => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))} />
                    </div>
                    <div className="form-group">
                        <label>Currency:</label>
                        <select value={newTransaction.currency} onChange={e => setNewTransaction(prev => ({ ...prev, currency: parseInt(e.target.value) }))}>
                            {currencies.map(currency => <option key={currency.id} value={currency.id}>{currency.title}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <input value={newTransaction.description} onChange={e => setNewTransaction(prev => ({ ...prev, description: e.target.value }))} />
                    </div>
                    <div className="form-group">
                        <label>Date:</label>
                        <input type="date" value={newTransaction.date} onChange={e => setNewTransaction(prev => ({ ...prev, date: e.target.value }))} />
                    </div>
                    <div className="button-container">
                        <button type="submit">Add</button>
                    </div>
                    <div className="button-remove">
                        <button type="button" onClick={removeSelected}>Remove Selected</button>
                        {/* <button onClick={removeSelected}>Remove Selected</button> */}
                    </div>
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
            <div>
                <button onClick={handlePrevPage} disabled={!prevPageUrl}>Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={!nextPageUrl}>Next</button>
            </div>
        </div>
    );
}

export default Transactions;
