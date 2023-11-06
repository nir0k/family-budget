//components/CategoriesPage.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { fetchCategories, fetchTransactionTypes, createCategory, deleteCategory, updateCategory } from './Api';


const debounce = (func, delay) => {
    let inDebounce;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(inDebounce);
        inDebounce = setTimeout(() => func.apply(context, args), delay);
    };
};


const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [transactionTypes, setTransactionTypes] = useState([]);
    const [categoryTitle, setCategoryTitle] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

    const [tableHeight, setTableHeight] = useState('calc(100vh - 100px)');
    const debouncedUpdateTableHeight = useRef(debounce(() => {
        const headerHeight = 60;
        const footerHeight = 100;
        const margin = 35;
        const newHeight = `calc(100vh - ${headerHeight + footerHeight + margin}px)`;
        setTableHeight(newHeight);
      }, 100));

    useEffect(() => {
        const debouncedResizeListener = debouncedUpdateTableHeight.current;
        debouncedResizeListener();
        window.addEventListener('resize', debouncedResizeListener);
        return () => {
          window.removeEventListener('resize', debouncedResizeListener);
        };
    }, []);

    useEffect(() => {
        async function loadData() {
            const fetchedCategories = await fetchCategories();
            const fetchedTransactionTypes = await fetchTransactionTypes();
            setCategories(fetchedCategories);
            setTransactionTypes(fetchedTransactionTypes);
            if (fetchedTransactionTypes.length > 0) {
                setSelectedType(fetchedTransactionTypes[0].id); // Set default selected type
            }
        }
        loadData();
    }, []);

    const handleCategoryTitleChange = (event) => {
        setCategoryTitle(event.target.value);
    };

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
    };

    const handleAddCategory = async () => {
        const newCategory = await createCategory({ title: categoryTitle, type: selectedType });
        setCategories([...categories, newCategory]);
        setCategoryTitle('');
    };

    const handleDeleteCategories = async () => {
        for (const categoryId of selectedCategoryIds) {
            await deleteCategory(categoryId);
        }
        setCategories(categories.filter(category => !selectedCategoryIds.includes(category.id)));
        setSelectedCategoryIds([]);
    };

    const handleCellChange = useCallback(async (params) => {
        const { id, field, newValue } = params.data; // assuming `params.data` is the object containing `id`
    
        if (!id) {
            console.error('ID is undefined', params.data);
            return;
        }
    
        try {
            await updateCategory(id, { [field]: newValue });
            const updatedCategories = [...categories];
            const categoryIndex = updatedCategories.findIndex(cat => cat.id === id);
            if (categoryIndex >= 0) {
                updatedCategories[categoryIndex] = { ...updatedCategories[categoryIndex], [field]: newValue };
                setCategories(updatedCategories);
            }
        } catch (error) {
            console.error('Updating category failed:', error);
            // Handle the error according to your needs
        }
    }, [categories]);

    const onSelectionChanged = useCallback((params) => {
        const selectedNodes = params.api.getSelectedNodes();
        const selectedIds = selectedNodes.map(node => node.data.id);
        setSelectedCategoryIds(selectedIds);
    }, []);

    const defaultColDef = {
        editable: true,
        sortable: true,
        resizable: true,
        filter: true,
    };

    const columnDefs = [
        {
          headerName: 'Title',
          field: 'title',
          checkboxSelection: true,
          headerCheckboxSelection: true
        },
        {
          headerName: 'Type',
          field: 'type',
          valueFormatter: params =>
            transactionTypes.find(type => type.id === params.value)?.title || ''
        }
      ];

      return (
        <div className="categories-page">
            <div className="add-category-form">
                <input type="text" value={categoryTitle} onChange={handleCategoryTitleChange} placeholder="Category Title" />
                <select value={selectedType} onChange={handleTypeChange}>
                    {transactionTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.title}</option>
                    ))}
                </select>
                <button onClick={handleAddCategory}>Add Category</button>
            </div>
            <button onClick={handleDeleteCategories}>Delete Selected Categories</button>
            <div className="ag-theme-alpine" style={{ margin: '20px auto', height: tableHeight, width: '80%' }}>
                <AgGridReact
                    rowData={categories}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    onCellValueChanged={handleCellChange}
                    rowSelection="multiple"
                    onSelectionChanged={onSelectionChanged}
                />
            </div>
        </div>
    );
};

export default CategoriesPage;