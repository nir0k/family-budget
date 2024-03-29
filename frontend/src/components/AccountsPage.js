// components/AccountsPage.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
  fetchAccounts,
  createAccount,
  deleteAccount,
  updateAccount,
  fetchAccountTypes,
  fetchCurrencies,
  fetchUsers,
} from './Api';

const AccountsPage = () => {
  const [rowData, setRowData] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [users, setUsers] = useState([]);
  const [newAccountData, setNewAccountData] = useState({
    title: '',
    type: '',
    currency: '',
    owner: '',
    value: '',
  });
  const gridRef = useRef(null);

  const updateTableHeight = () => {
    const tableContainer = document.querySelector('.ag-theme-alpine-dark');
    if (tableContainer) {
      const offsetTop = tableContainer.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const newHeight = windowHeight - offsetTop;
      tableContainer.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    updateTableHeight(); // Set initial height
    window.addEventListener('resize', updateTableHeight); // Adjust on window resize

    return () => window.removeEventListener('resize', updateTableHeight); // Clean up on unmount
  }, []);

  useEffect(() => {
    const getAccountTypesAndCurrencies = async () => {
      const types = await fetchAccountTypes();
      setAccountTypes(types);
      const fetchedCurrencies = await fetchCurrencies();
      setCurrencies(fetchedCurrencies);
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    };
    getAccountTypesAndCurrencies();
  }, []);

  const columnDefs = [
    {
      headerName: "Checkbox",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50,
    },
    {
      headerName: "Title",
      minWidth: 150,
      field: "title",
      editable: true,
      sortable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: "Type",
      field: "type",
      minWidth: 80,
      editable: true,
      sortable: true,
      filter: 'agTextColumnFilter',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: accountTypes.map((type) => type.title),
      },
      valueGetter: params => {
        const type = accountTypes.find((type) => type.id === params.data.type);
        return type ? type.title : params.value;
      },
      filterParams: {
          textCustomComparator: (filter, value, filterText) => {
              const formattedFilterText = filterText.toLowerCase();
              return value.toLowerCase().includes(formattedFilterText);
          }
      }
    },
    {
      headerName: "Current Balance",
      minWidth: 150,
      field: "balance",
      sortable: true,
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: "Currency",
      field: "currency",
      minWidth: 80,
      editable: true,
      sortable: true,
      filter: 'agTextColumnFilter',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: currencies.map((currency) => currency.code),
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
      headerName: "Owner",
      field: "owner",
      sortable: true,
      filter: 'agTextColumnFilter',
      minWidth: 100,
      valueFormatter: (params) => {
        const user = users.find(user => user.id === params.value);
        return user ? user.username : params.value;
      },
      editable: true,
    }
  ];

  const onSelectionChanged = () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    setSelectedRows(selectedData);
  };

  const onCellEditingStopped = async (event) => {
    if (event.colDef.field === 'type') {
      const selectedType = accountTypes.find(t => t.title === event.value);
      event.data.type = selectedType ? selectedType.id : null;
    }
    await updateAccount(event.data.id, event.data);
    loadAccounts();
  };

  const gridOptions = {
    suppressRowClickSelection: true,
    rowSelection: 'multiple',
    onSelectionChanged: onSelectionChanged,
    onCellEditingStopped: onCellEditingStopped,
  };

  const loadAccounts = useCallback(async () => {
    const accountsData = await fetchAccounts();
    const userMap = {};
    users.forEach(user => {
      userMap[user.id] = user.username;
    });
  
    const accountsWithUsernames = accountsData.map(account => ({
      ...account,
      owner: userMap[account.owner] || account.owner,
    }));
  
    setRowData(accountsWithUsernames);
  }, [users]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAccountData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    const ownerUser = users.find(user => user.username === newAccountData.owner);
    const accountDataWithOwnerId = {
      ...newAccountData,
      owner: ownerUser ? ownerUser.id : null,
    };
    await createAccount(accountDataWithOwnerId);
    loadAccounts();
    setNewAccountData({ title: '', type: '', currency: '', owner: '', value: '' });
  };
  

  const handleDeleteAccounts = async () => {
    for (const account of selectedRows) {
      await deleteAccount(account.id);
    }
    loadAccounts();
    setSelectedRows([]);
  };

  return (
    <div className="ag-theme-alpine, main-page-container" style={{ height: '100%', width: '100%' }}>
      <form onSubmit={handleCreateAccount}>
        <input
          type="text"
          name="title"
          placeholder="Account Title"
          value={newAccountData.title}
          onChange={handleInputChange}
        />
        <select
          name="type"
          value={newAccountData.type}
          onChange={handleInputChange}
        >
          <option value="">Select Type</option>
          {accountTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.title}
            </option>
          ))}
        </select>
        <select
          name="currency"
          value={newAccountData.currency}
          onChange={handleInputChange}
        >
          <option value="">Select Currency</option>
          {currencies.map((currency) => (
            <option key={currency.id} value={currency.id}>
              {currency.code}
            </option>
          ))}
        </select>
        <select
          name="owner"
          value={newAccountData.owner}
          onChange={handleInputChange}
        >
          <option value="">Select Owner</option>
          {users.map((user) => (
            <option key={user.id} value={user.username}>
              {user.username}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="balance"
          placeholder="balance"
          value={newAccountData.balance}
          onChange={handleInputChange}
        />
        <button type="submit">Create Account</button>
      </form>
      <button onClick={handleDeleteAccounts} disabled={selectedRows.length === 0}>
        Delete Selected Account(s)
      </button>
      <div className="ag-theme-alpine-dark" style={{ height: '500px', width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          gridOptions={gridOptions}
          onGridReady={(params) => params.api.sizeColumnsToFit()}
        />
      </div>
    </div>
  );
};

export default AccountsPage;
