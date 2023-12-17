import React, { useState, useEffect, useCallback } from 'react';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
// import './css/common.css'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    fetchTransactions,
    deleteTransaction,
    updateTransaction,
    createTransaction,
    fetchTransactionTypes,
    fetchCategories,
    fetchUsers,
    fetchCurrencies,
    fetchAccounts,
} from './Api';
import { getCurrentDate, currencyFormatter, dateFormatter } from './fetches/utils'
import { calculateTotalPages, handlePreviousPage, handleNextPage, rowsPerPage } from './fetches/table';
import Pagination from './fetches/table';
import DropdownCellEditor from './DropdownCellEditor';

const someOffset = 150;

const debounce = (fn, delay) => {
    let timeoutId;
    return function (...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn(...args);
        }, delay);
    };
};

const Transactions = () => {
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const loggedInUserId = userInfo?.username;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const totalPages = calculateTotalPages(totalRows, rowsPerPage);
    const onPreviousPage = () => handlePreviousPage(currentPage, setCurrentPage);
    const onNextPage = () => handleNextPage(currentPage, totalPages, setCurrentPage);
    const [tableHeight, setTableHeight] = useState(window.innerHeight - someOffset);
    const [typeOptions, setTypeOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [userOptions, setUserOptions] = useState([]);
    const [currencyOptions, setCurrencyOptions] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [accountOptions, setAccountOptions] = useState([]);

    const updateTableHeight = () => {
        const newHeight = window.innerHeight - someOffset;
        console.log("New height:", newHeight);
        setTableHeight(newHeight);
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const [types, categories, users, currencies, accounts] = await Promise.all([
              fetchTransactionTypes(),
              fetchCategories(),
              fetchUsers(),
              fetchCurrencies(),
              fetchAccounts(),
            ]);
            setTypeOptions(types);
            setCategoryOptions(categories);
            setFilteredCategories(categories);
            setUserOptions(users);
            setCurrencyOptions(currencies);
            setAccountOptions(accounts.map(account => ({ id: account.id, title: account.title, owner: account.owner })));
          } catch (error) {
            toast.error('Error fetching initialization data:', error);
          }
        };
    
        fetchData();
    }, []);
    useEffect(() => {
        const debouncedUpdateHeight = debounce(updateTableHeight, 300);
        window.addEventListener('resize', debouncedUpdateHeight);
        // Cleanup
        return () => {
            window.removeEventListener('resize', debouncedUpdateHeight);
        };
    }, []);
    
    const [newTransaction, setNewTransaction] = useState({
        title: '',
        type: '',
        category: '',
        who: loggedInUserId,
        account: '',
        account_to: '',
        amount: '',
        currency: '',
        description: '',
        date: getCurrentDate(),
        author: loggedInUserId,
    });

    const addNewRow = () => {
        const newItem = createNewRowData();
        newItem.isNew = true;
        filterCategoriesByType(newItem.type);
    
        gridApi.applyTransaction({ add: [newItem], addIndex: 0 });
        setNewTransaction(newItem);
    
        // Update dropdown values
        const filteredAccounts = accountOptions.filter(account => account.owner === loggedInUserId);
        const dropdownValues = filteredAccounts.map(account => ({ title: account.title }));
    
        if (gridApi && gridApi.getColumnDef('account')) {
            gridApi.getColumnDef('account').cellEditorParams.values = dropdownValues;
        }
    
        // Force refresh the grid or cells
        gridApi.refreshCells({ force: true });
    
        // Start editing the first cell
        gridApi.startEditingCell({
            rowIndex: 0,
            colKey: 'title'
        });
    
        setIsEditMode(true);
    };
    
    

    const cancelEdit = () => {
        setIsEditMode(false);
        setFilteredCategories(categoryOptions);
        // Remove any rows that are marked as new
        const allRows = [];
        gridApi.forEachNode(node => {
            if (!node.data.isNew) {
                allRows.push(node.data);
            }
        });
        gridApi.setRowData(allRows);
        toast.success('Adding a new transaction was canceled');
    };
    
    
    const createNewRowData = () => {
        return {
            title: '',
            type: 'Expense',
            category: '',
            who: loggedInUserId,
            account: '',
            account_to: '',
            amount: '',
            currency: '',
            description: '',
            date: getCurrentDate(),
            author: loggedInUserId
        };
    };
    

    const validateNewRecord = (record) => {
        // List all required fields
        const requiredFields = ['title', 'type', 'category', 'who', 'account', 'amount', 'currency', 'date'];
    
        for (let field of requiredFields) {
            if (!record[field]) {
                // Field is empty or undefined
                return false;
            }
        }
        return true;
    };

    const handleCellEditingStarted = (event) => {
        if (event.colDef.field === 'account') {
            const currentOwner = event.data.who;
            const filteredAccounts = accountOptions.filter(account => account.owner === currentOwner);
            const dropdownValues = filteredAccounts.map(account => ({ title: account.title }));
    
            if (event.api && event.api.getCellEditorInstances) {
                const cellEditorInstances = event.api.getCellEditorInstances({
                    rowIndex: event.rowIndex,
                    colKey: 'account'
                });
    
                if (cellEditorInstances && cellEditorInstances.length > 0) {
                    const accountEditor = cellEditorInstances[0];
                    accountEditor.refreshOptions(dropdownValues, 'title', event.data.account);
                }
            }
        }
        if (event.colDef.field === 'category' && event.data.type) {
            filterCategoriesByType(event.data.type);
        } else if (event.colDef.field === 'type' || event.data.isNew) {
            filterCategoriesByType(event.data.type);
        }
        if (event.colDef.field === 'currency') {
            event.api.getColumnDef('currency').cellEditorParams.values = currencyOptions.map(currency => ({ code: currency.code }));
        }
    };
      

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateNewRecord(newTransaction)) {
            toast.error('Please fill in all required fields.');
            return;
        }
    
        createTransaction(newTransaction)
            .then(response => {
                if (response.ok) {
                    toast.success('Transaction added successfully!');
                    fetchPageData();
                } else {
                    toast.error('Failed to add transaction');
                }
            })
            .catch(error => {
                toast.error(`Error: ${error.message}`);
            });
    };
    
    const fetchPageData = useCallback(async () => {
        try {
            const transactionsData = await fetchTransactions(currentPage);
            setRowData(transactionsData.results);
            setTotalRows(transactionsData.count);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchPageData();
    }, [fetchPageData]);

    const removeSelected = () => {
        const selectedNodes = gridApi.getSelectedNodes();
        const selectedTransactions = selectedNodes.map(node => ({
            id: node.data.id,
            title: node.data.title
        }));
        Promise.all(selectedTransactions.map(transaction => 
            deleteTransaction(transaction.id).then(response => {
                if (response.ok) {
                    toast.success(`Transaction ${transaction.id} - ${transaction.title} deleted successfully.`);
                } else {
                    toast.error(`Failed to delete transaction ${transaction.id} - ${transaction.title}.`);
                }
            })
        ))
        .then(() => {
            fetchPageData();
        })
        .catch(error => {
            toast.error(`Error: ${error.message}`);
        });
    };

    const onCellValueChanged = (params) => {
        console.log("New value: ", params.newValue);
        if (params.data.id == null) {
            setNewTransaction(prev => ({
                ...prev,
                [params.colDef.field]: params.newValue
            }));
        } else {
            const id = params.data.id;
            const updatedField = params.colDef.field;
            const newValue = params.newValue;
            updateTransaction(id, { [updatedField]: newValue })
                .then(response => {
                    if (!response.ok) {
                        toast.error('Failed to update data');
                    }
                })
                .catch(error => {
                    toast.error(`Error: ${error.message}`);
                });
        }
        if (params.colDef.field === 'type') {
            const selectedType = params.newValue;
            filterCategoriesByType(selectedType);
        }
        if (params.colDef.field === 'account') {
            const selectedAccountTitle = params.newValue;
            const selectedAccount = accountOptions.find(acc => acc.title === selectedAccountTitle);
            if (selectedAccount) {
                // Set the account ID instead of the title
                params.data.account = selectedAccount.id; 
                params.api.refreshCells({ force: true });
            }
        }
    };

    const filterCategoriesByType = (selectedType) => {
        const filtered = categoryOptions.filter(cat => cat.type === selectedType);
        setFilteredCategories(filtered.length > 0 ? filtered : categoryOptions);
    };    

    const onGridReady = params => {
        setGridApi(params.api);
        params.api.sizeColumnsToFit();
    };

    const originalColumnDefs = [
        { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
        { headerName: "Title", field: "title", editable: true, sortable: true, },
        { 
            headerName: "Type",
            field: "type",
            editable: true,
            cellEditor: DropdownCellEditor,
            sortable: true,
            cellEditorParams: {
                values: typeOptions,
                property: 'title' // Specify the property name
            }
        },
        { 
            headerName: "Category", 
            field: "category", 
            editable: true,
            cellEditor: DropdownCellEditor,
            sortable: true,
            cellEditorParams: {
                values: filteredCategories,
                property: 'title' // Specify the property name
            }
        },
        { 
            headerName: "Who",
            field: "who",
            editable: true,
            cellEditor: DropdownCellEditor,
            sortable: true,
            cellEditorParams: {
                values: userOptions,
                property: 'username' // Use 'username' for the "Who" column
            }
        },
        // { 
        //     headerName: "Account",
        //     field: "account",
        //     editable: true,
        //     valueFormatter: (params) => accountOptions.find(acc => acc.id === params.value)?.title || '',
        //     cellEditor: DropdownCellEditor,
        //     sortable: true,
        //     cellEditorParams: {
        //         values: accountOptions.map(account => account.title),
        //         property: 'title'
        //     }
        // },
        {
            headerName: "Account",
            field: "account",
            editable: true,
            cellEditor: DropdownCellEditor,
            cellEditorParams: {
                accountOptions: accountOptions,
                values: accountOptions.map(account => account.title),
                property: 'title'
            },
            // Update the valueFormatter to display the title instead of the ID
            valueFormatter: (params) => {
                const account = accountOptions.find(acc => acc.id === params.value);
                return account ? account.title : '';
            }
        },
        { headerName: "Amount", field: "amount", valueFormatter: currencyFormatter, editable: true },
        { 
            headerName: "Currency",
            field: "currency",
            editable: true,
            cellEditor: DropdownCellEditor,
            sortable: true,
            cellEditorParams: {
                values: currencyOptions,
                property: 'code' // Specify the property name
            }
        },
        { headerName: "Description", field: "description", editable: true, sortable: true, },
        { headerName: "Date", field: "date", valueFormatter: dateFormatter, editable: true, sortable: true, }
    ];

    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <div className="main-page-container">
                <div className="button-container">
                    {isEditMode ? (
                        <>
                            <button onClick={handleSubmit} className="button">Save Transaction</button>
                            <button onClick={cancelEdit} className="button">Cancel</button>
                        </>
                    ) : (
                        <>
                            <button onClick={addNewRow} className="button">Add New Transaction</button>
                            <button onClick={removeSelected} className="button delete-button">Remove Selected Transactions</button>
                        </>
                    )}
                </div>
                <div className="ag-theme-alpine-dark ag-grid-container" style={{ height: `${tableHeight}px`, width: '100%' }}>
                    <AgGridReact
                        columnDefs={originalColumnDefs}
                        rowData={rowData}
                        rowSelection="multiple"
                        onGridReady={onGridReady}
                        onCellValueChanged={onCellValueChanged}
                        onCellEditingStarted={handleCellEditingStarted}
                    />
                </div>
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPreviousPage={onPreviousPage} 
                    onNextPage={onNextPage} 
                />
                <ToastContainer />
            </div>
        </React.Suspense>
    );
}

export default Transactions;
