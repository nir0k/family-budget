// components/ExchangeRatesPage.js
import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { 
    fetchExchangeRates,
    deleteExchangeRate,
    addExchangeRate,
    editExchangeRate,
    fetchCurrencies
} from './Api';
import Pagination from './fetches/table';
import { 
    calculateTotalPages,
    handlePreviousPage,
    handleNextPage,
    rowsPerPage,
} from './fetches/table'
import DropdownCellEditor from './DropdownCellEditor';
import { dateFormatter } from './fetches/utils'

const offset = 100;

function ExchangeRatesGrid() {
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [gridHeight, setGridHeight] = useState(window.innerHeight - offset);
    const totalPages = calculateTotalPages(totalRows, rowsPerPage);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currencyOptions, setCurrencyOptions] = useState([]);
    const addNewRow = () => {
        const newRowTemplate = {
            from_currency: '',
            to_currency: '',
            rate: '',
            rate_date: new Date().toISOString().split('T')[0],
            isNew: true
        };
        setRowData(currentRows => [newRowTemplate, ...currentRows]);
        setIsEditMode(true);
    };
    const saveNewRow = () => {
        const newRowData = rowData.find(row => row.isNew);
        if (newRowData) {
            addExchangeRate(newRowData).then(response => {
                toast.success('New record added successfully!');
                setRowData(currentRows => {
                    return currentRows.map(row => row.isNew ? response : row);
                });
                setIsEditMode(false);
            }).catch(error => {
                toast.error('Failed to add new record: ' + error.message);
            });
        }
    };
  
    const onPreviousPage = () => {
        handlePreviousPage(currentPage, setCurrentPage);
    };
    const onNextPage = () => {
        handleNextPage(currentPage, totalPages, setCurrentPage);
    };

    const fetchDataForPage = (page) => {
        fetchExchangeRates(page).then(data => {
            setRowData(data.results);
            setTotalRows(data.count);
            setCurrentPage(page);
        });
    };

    const cancelNewRow = () => {
        setRowData(currentRows => currentRows.filter(row => !row.isNew));
        setIsEditMode(false);
    };    

    const onCellValueChanged = params => {
        if (params.data.isNew) {
            return;
        }
        // Assuming each row has a unique 'id'
        const id = params.data.id;
        const updatedField = params.colDef.field;
        const newValue = params.newValue;
    
        editExchangeRate(id, { [updatedField]: newValue })
            .then(response => {
                toast.success('Record updated successfully!');
                // Optionally refresh the grid data here
            })
            .catch(error => {
                toast.error('Failed to update record: ' + error.message);
                // Optionally revert the changes in the grid
            });
    };

    const onGridReady = params => {
        setGridApi(params.api);
        params.api.sizeColumnsToFit();
    };

    const onDeleteSelected = () => {
        const selectedNodes = gridApi.getSelectedNodes();
        const selectedIds = selectedNodes.map(node => node.data.id);

        Promise.all(selectedIds.map(id => deleteExchangeRate(id)))
            .then(() => {
                toast.success('Record(s) deleted successfully!');
                setRowData(currentRows => currentRows.filter(row => !selectedIds.includes(row.id)));
            })
            .catch(error => {
                toast.error('Failed to delete record(s): ' + error.message);
            });
    };

    useEffect(() => {
        fetchDataForPage(currentPage);
    }, [currentPage]);

    useEffect(() => {
        const handleResize = () => {
            setGridHeight(window.innerHeight - offset);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (gridApi) {
            fetchExchangeRates(1).then(data => {
                setRowData(data.results);
                gridApi.sizeColumnsToFit();
            });
        }
    }, [gridApi]);

    useEffect(() => {
        const loadCurrencies = async () => {
            try {
                const currencies = await fetchCurrencies();
                setCurrencyOptions(currencies);
            } catch (error) {
                console.error('Error fetching currencies:', error);
            }
        };
    
        loadCurrencies();
    }, []);


    const columnDefs = [
        { checkboxSelection: true, headerCheckboxSelection: true, width: 50 },
        // { headerName: "ID", field: "id", editable: false },
        {
            headerName: "From Currency",
            field: "from_currency",
            editable: true,
            sortable: true,
            filter: 'agTextColumnFilter',
            cellEditor: DropdownCellEditor,
            cellEditorParams: {
                values: currencyOptions,
                property: 'code' // Specify the property name
            }
            
        },
        {
            headerName: "To Currency",
            field: "to_currency",
            editable: true,
            sortable: true,
            filter: 'agTextColumnFilter',
            cellEditor: DropdownCellEditor,
            cellEditorParams: {
                values: currencyOptions,
                property: 'code' // Specify the property name
            }
        },
        { 
            headerName: "Rate",
            field: "rate",
            editable: true,
            sortable: true,
            filter: 'agNumberColumnFilter'
        },
        { 
            headerName: "Rate date",
            field: "rate_date",
            valueFormatter: dateFormatter,
            editable: true,
            filter: 'agDateColumnFilter',
            sortable: true,
        },
        { headerName: "Last Updated", field: "last_updated", editable: false, sortable: true, filter: 'agTextColumnFilter',}
    ];

    return (
        <div className="main-page-container ag-theme-alpine-dark" style={{ height: `${gridHeight}px`, width: '100%' }}>
            <div className="button-container">
                {isEditMode ? (
                    <>
                        <button onClick={saveNewRow} className="button">Save</button>
                        <button onClick={cancelNewRow} className="button">Cancel</button>
                    </>
                ) : (
                    <>
                        <button onClick={addNewRow}>Add New Record</button>
                        <button onClick={onDeleteSelected} className="button delete-button">Delete Selected</button>
                    </>
                )}
            </div>
            <AgGridReact
                gridOptions={{ rowSelection: 'multiple' }}
                rowData={rowData}
                onGridReady={onGridReady}
                columnDefs={columnDefs}
                onCellValueChanged={onCellValueChanged}
            />
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPreviousPage={onPreviousPage}
                onNextPage={onNextPage}
            />
            <ToastContainer />
        </div>
    );
}

export default ExchangeRatesGrid;
