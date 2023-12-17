import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { 
    fetchCurrencies,
    updateCurrency,
    createCurrency,
    deleteCurrency
} from './Api'; // Adjust the path as needed

const CurrencyGrid = () => {
    const [currencies, setCurrencies] = useState([]);
    const [isNewRow, setIsNewRow] = useState(false);
    const [gridApi, setGridApi] = useState(null);

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

    const addNewRow = () => {
        const newRowTemplate = {
            title: '',
            code: '',
            isNew: true
        };
        setCurrencies([newRowTemplate, ...currencies]);
        setIsNewRow(true);
    };

    const saveNewRow = async () => {
        const newRowData = currencies.find(row => row.isNew);
        if (newRowData) {
            try {
                const savedRow = await createCurrency(newRowData); 
                setCurrencies(currentCurrencies => currentCurrencies.map(row => row.isNew ? savedRow : row));
                setIsNewRow(false);
            } catch (error) {
                console.error('Error saving new currency:', error);
            }
        }
    };

    const cancelNewRow = () => {
        // Remove the new row and reset the isNewRow state
        setCurrencies(currentCurrencies => currentCurrencies.filter(currency => !currency.isNew));
        setIsNewRow(false);
    };

    const onCellValueChanged = async (params) => {
        if (params.data.isNew) {
            // If it's a new row, do not send the PATCH request
            return;
        }
        try {
            await updateCurrency(params.data.id, params.data);
            console.log('Currency updated');
        } catch (error) {
            console.error('Error updating currency:', error);
        }
    };

    const onGridReady = params => {
        setGridApi(params.api);
    };    

    const deleteSelectedRow = async () => {
        const selectedNodes = gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        for (const data of selectedData) {
            try {
                await deleteCurrency(data.id);
                setCurrencies(currentCurrencies => currentCurrencies.filter(currency => currency.id !== data.id));
            } catch (error) {
                console.error('Error deleting currency:', error);
            }
        }
    };
    

    const columns = [
        { checkboxSelection: true, headerCheckboxSelection: true, width: 50 },
        { headerName: "Title", field: "title", editable: true, sortable: true, filter: 'agTextColumnFilter' },
        { headerName: "Code", field: "code", editable: true, sortable: true, filter: 'agTextColumnFilter'},
        // Add additional column definitions here
    ];

    return (
        <div className="main-page-container ag-theme-alpine-dark" style={{ height: 400, width: '100%' }}>
            <div className="button-container">
                {isNewRow ? (
                    <>
                        <button onClick={saveNewRow} className="button">Save New Currency</button>
                        <button onClick={cancelNewRow} className="button">Cancel</button>
                    </>
                ) : (
                    <>
                        <button onClick={addNewRow} className="button">Add New Currency</button>
                        <button onClick={deleteSelectedRow} className="button delete-button">Delete Selected Currency</button>
                    </>
                )}
            </div>
            <AgGridReact
                gridOptions={{ rowSelection: 'multiple' }}
                columnDefs={columns}
                rowData={currencies}
                onCellValueChanged={onCellValueChanged}
                onGridReady={onGridReady}
                // Add additional grid options here
            />
        </div>
    );
};

export default CurrencyGrid;
