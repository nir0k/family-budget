// components/fetches/table.js
import React from 'react';

// Calculate totalPages based on totalRows and rowsPerPage (e.g., 50)
export const calculateTotalPages = (totalRows, rowsPerPage) => {
    return Math.ceil(totalRows / rowsPerPage);
};

// Function to handle going to the previous page
export const handlePreviousPage = (currentPage, setCurrentPage) => {
    if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
    }
};

// Function to handle going to the next page
export const handleNextPage = (currentPage, totalPages, setCurrentPage) => {
    if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
    }
};

export const rowsPerPage = 50;

function Pagination({ currentPage, totalPages, onPreviousPage, onNextPage, rowsPerPage }) {
    return (
        <div className="pagination">
            <button onClick={onPreviousPage} disabled={currentPage === 1} className="button">Previous Page</button>
            <span>{currentPage} of {totalPages}</span>
            <button onClick={onNextPage} disabled={currentPage === totalPages} className="button">Next Page</button>
        </div>
    );
}
export default Pagination;