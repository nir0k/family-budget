import React, { useState, useEffect } from 'react';
import { fetchFamilyState } from './Api';
import './css/FamilyFinanceState.css'; // Import the CSS file

const FamilyFinanceState = () => {
    const [familyState, setFamilyState] = useState(null);

    // Function to format number as currency
    const formatNumber = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'decimal' }).format(value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchFamilyState();
                setFamilyState(data[0]); // Assuming the response is always an array with at least one item
            } catch (error) {
                console.error('Error fetching family state:', error);
            }
        };

        fetchData();
    }, []);

    if (!familyState) {
        return <div className="centered-container">Loading...</div>;
    }

    return (
        <div className="centered-container">
            <div>
                <h1>{familyState.title}</h1>
                <div>Current state: {formatNumber(familyState.current)}</div>
            </div>
        </div>
    );
};

export default FamilyFinanceState;
