// components/TransactionGrid.js
import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    const formRef = useRef(null);
    const [tableHeight, setTableHeight] = useState('400px');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const loggedInUserId = userInfo?.id;
    const updateTableHeight = () => {
        const formHeight = formRef.current ? formRef.current.offsetHeight : 0;
        const navbarHeight = 60; // Replace with actual navbar height if any
        const remainingHeight = window.innerHeight - formHeight - navbarHeight;
        setTableHeight(`${remainingHeight}px`);
    };

    useEffect(() => {
        updateTableHeight();
        window.addEventListener('resize', updateTableHeight);
        return () => window.removeEventListener('resize', updateTableHeight);
    }, []);


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

    const getUsernameById = (ownerId) => {
        const user = users.find(u => u.id === ownerId);
        return user ? user.username : 'Unknown';
    };

    const [newTransaction, setNewTransaction] = useState({
        title: '',
        category: '',
        who: loggedInUserId,
        account: '',
        account_to: '',
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

                // Filter accounts for the logged-in user
                const filtered = accountsData.filter(account => account.owner === loggedInUserId);
                setFilteredAccounts(filtered);

                setNewTransaction(prev => ({
                    ...prev,
                    category: categoriesData[0]?.id,
                    who: loggedInUserId,
                    account: filtered[0]?.id
                }));
            }).catch(error => {
                console.error('Error fetching data:', error);
            });
        };
    
        fetchPageData();
    }, [currentPage, loggedInUserId]);
    

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
    
    const handleCategoryChange = (e) => {
        setNewTransaction(prev => ({ ...prev, category: parseInt(e.target.value) }));
    }

    const handleWhoChange = (e) => {
        const userId = parseInt(e.target.value);
        setNewTransaction(prev => ({ ...prev, who: userId }));
        const filtered = accounts.filter(account => account.owner === userId);
        setFilteredAccounts(filtered);

        if (!filtered.find(account => account.id === newTransaction.account)) {
            setNewTransaction(prev => ({ ...prev, account: '' }));
        }
    };

    const handleAccountChange = (e) => {
        setNewTransaction(prev => ({ ...prev, account: parseInt(e.target.value) }));
    }

    const handleAccountToChange = (e) => {
        setNewTransaction(prev => ({ ...prev, account_to: parseInt(e.target.value) }));
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
            toast.error('Who field is required!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        if (!newTransaction.category) {
            toast.error('Category field is required!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        if (!newTransaction.account) {
            toast.error('Account field is required!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        if (!newTransaction.amount) {
            toast.error('Amount field is required!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        if (!newTransaction.currency) {
            toast.error('Currency field is required!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        if (!newTransaction.date) {
            toast.error('Date field is required!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        if (newTransaction.category === 'Transfer') {
            if (!newTransaction.account_to) {
            toast.error('Account To field is required if selected Transfer category!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
            }
        }
    
        createTransaction(newTransaction)
            .then(({ status, ok, body }) => {
                if (!ok) {
                    throw new Error(`Failed to add transaction. Server responded with status: ${status}`, body);
                }
                toast.success('Transaction added successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                if (gridApi) {
                    gridApi.applyTransaction({ add: [body], addIndex: 0 });
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
            })
            .catch(error => {
                toast.error(error.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });
    };
    
    
    const onGridReady = params => {
        setGridApi(params.api);
        params.api.sizeColumnsToFit();
    };

    const originalColumnDefs = [
        { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
        { headerName: "Title", field: "title", minWidth: 150, sortable: true, editable: true },
        {
            headerName: "Type",
            field: "type",
            minWidth: 100,
            sortable: true,
            filter: 'agTextColumnFilter',
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: transactionTypes.map(type => type.id)
            },
            valueGetter: params => {
                const type = transactionTypes.find(t => t.id === params.data.type);
                return type ? type.title : '';
            },
            filterParams: {
                textCustomComparator: (filter, value, filterText) => {
                    const formattedFilterText = filterText.toLowerCase();
                    return value.toLowerCase().includes(formattedFilterText);
                }
            }
        },
        {
            headerName: "Category",
            field: "category",
            minWidth: 150,
            sortable: true,
            filter: 'agTextColumnFilter',
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: categories.map(cat => cat.id)
            },
            valueGetter: params => {
                const cat = categories.find(c => c.id === params.data.category);
                return cat ? cat.title : '';
            },
            filterParams: {
                textCustomComparator: (filter, value, filterText) => {
                    const formattedFilterText = filterText.toLowerCase();
                    return value.toLowerCase().includes(formattedFilterText);
                }
            }
        },
        {
            headerName: "Who",
            field: "who",
            minWidth: 80,
            sortable: true,
            filter: 'agTextColumnFilter',
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: users.map(user => user.id)
            },
            valueGetter: params => {
                const user = users.find(user => user.id === params.data.who);
                return user ? user.username : '';
            },
            filterParams: {
                textCustomComparator: (filter, value, filterText) => {
                    const formattedFilterText = filterText.toLowerCase();
                    return value.toLowerCase().includes(formattedFilterText);
                }
            }
        },
        {
            headerName: "Account",
            field: "account",
            minWidth: 150,
            sortable: true,
            filter: 'agTextColumnFilter',
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: accounts.map(account => account.id)
            },
            valueGetter: params => {
                const account = accounts.find(account => account.id === params.data.account);
                return account ? account.title : '';
            },
            filterParams: {
                textCustomComparator: (filter, value, filterText) => {
                    const formattedFilterText = filterText.toLowerCase();
                    return value.toLowerCase().includes(formattedFilterText);
                }
            }
        },
        {
            headerName: "Account To",
            field: "account_to",
            minWidth: 150,
            sortable: true,
            filter: 'agTextColumnFilter',
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: accounts.map(account => account.id)
            },
            valueGetter: params => {
                const account = accounts.find(account => account.id === params.data.account_to);
                return account ? account.title : '';
            },
            filterParams: {
                textCustomComparator: (filter, value, filterText) => {
                    const formattedFilterText = filterText.toLowerCase();
                    return value.toLowerCase().includes(formattedFilterText);
                }
            }
        },        
        {
            headerName: "Amount",
            field: "amount",
            minWidth: 120,
            sortable: true,
            filter: 'agNumberColumnFilter',
            editable: true,
            valueFormatter: currencyFormatter
        },
        {
            headerName: "Currency",
            field: "currency",
            minWidth: 80,
            sortable: true,
            filter: 'agTextColumnFilter',
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: currencies.map(currency => currency.id)
            },
            valueGetter: params => {
                const currency = currencies.find(curr => curr.id === params.data.currency);
                return currency ? currency.code : '';
            },
            filterParams: {
                textCustomComparator: (filter, value, filterText) => {
                    const formattedFilterText = filterText.toLowerCase();
                    return value.toLowerCase().includes(formattedFilterText);
                }
            }
        },
        {
            headerName: "Date",
            minWidth: 120,
            field: "date",
            sortable: true,
            filter: 'agDateColumnFilter',
            editable: true,
            valueFormatter: dateFormatter
        },
        { 
            headerName: "Description",
            minWidth: 100 ,
            field: "description",
            sortable: true,
            editable: true
        }
    ];

    const columnDefs = originalColumnDefs.map(col => ({
        ...col,
        cellStyle: { textAlign: 'left' }
    }));

    const getCategoryTitleById = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.title : '';
    };

    return (
        <div className="main-page-container">
            <div ref={formRef} className="form-container">
                <h3>Add Transaction</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title:</label>
                        <input value={newTransaction.title} onChange={e => setNewTransaction(prev => ({ ...prev, title: e.target.value }))} />
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
                    {getCategoryTitleById(newTransaction.category) === 'Transfer' && (
                        <div className="form-group">
                            <label>Account To:</label>
                            <select 
                                value={newTransaction.account_to}
                                onChange={handleAccountToChange}>
                                {accounts.map(account => (
                                    <option key={account.id} value={account.id}>
                                        {`${account.title} - ${getUsernameById(account.owner)}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
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
                    </div>
                </form>
            </div>
            <div className="ag-theme-alpine-dark" style={{ height: tableHeight, width: '100%' }}>
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
            <ToastContainer />
        </div>
    );
}

export default Transactions;
