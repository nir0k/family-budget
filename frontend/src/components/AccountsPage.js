// components/AccountsPage.js

import React, { useState, useEffect, useRef } from 'react';
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
} from './Api';

const AccountsPage = () => {
  const [rowData, setRowData] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [newAccountData, setNewAccountData] = useState({
    title: '',
    type: '',
    currency: '',
    owner: '',
    value: '',
  });
  const gridRef = useRef(null);

  useEffect(() => {
    const getAccountTypesAndCurrencies = async () => {
      const types = await fetchAccountTypes();
      setAccountTypes(types);
      const fetchedCurrencies = await fetchCurrencies();
      setCurrencies(fetchedCurrencies);
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
    { headerName: "Title", field: "title", editable: true },
    {
      headerName: "Type",
      field: "type",
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: accountTypes.map((type) => type.title),
      },
      valueFormatter: (params) => {
        const type = accountTypes.find((type) => type.id === params.value);
        return type ? type.title : params.value;
      },
    },
    { headerName: "Current Balance", field: "current_balance" },
    {
      headerName: "Currency",
      field: "currency",
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: currencies.map((currency) => currency.code),
      },
      valueFormatter: (params) => {
        const currency = currencies.find((currency) => currency.id === params.value);
        return currency ? currency.code : params.value;
      },
    },
    { headerName: "Owner", field: "owner", editable: true },
    { headerName: "Start Value", field: "value", editable: true },
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

  const loadAccounts = async () => {
    const accountsData = await fetchAccounts();
    setRowData(accountsData);
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAccountData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    await createAccount(newAccountData);
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
    <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
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
        <input
          type="text"
          name="owner"
          placeholder="Owner"
          value={newAccountData.owner}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="value"
          placeholder="Start Value"
          value={newAccountData.value}
          onChange={handleInputChange}
        />
        <button type="submit">Create Account</button>
      </form>
      <button onClick={handleDeleteAccounts} disabled={selectedRows.length === 0}>
        Delete Selected Account(s)
      </button>
      <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
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
