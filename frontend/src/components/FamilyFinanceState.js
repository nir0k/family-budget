import React, { useState, useEffect } from 'react';
import { fetchFamilyState } from './Api';
import './css/FamilyFinanceState.css';

const FamilyFinanceState = () => {
    const [familyState, setFamilyState] = useState(null);
    const [error, setError] = useState(null);

    const formatNumber = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'decimal' }).format(value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchFamilyState();
                setFamilyState(data[0]);
            } catch (error) {
                console.error('Error fetching family state:', error);
            }
            fetchData().catch(err => setError(err.message));
        };

        fetchData();
    }, []);

    if (error) {
        return <div className="centered-container">Error: {error}</div>;
    }

    if (!familyState) {
        return <div className="centered-container">Loading...</div>;
    }

    return (
        <div className="centered-container, main-page-container">
            <div>
                <h1>{familyState.title}</h1>
                <div>Current state: {formatNumber(familyState.current)} {familyState.currency}</div>
            </div>
        </div>
    );
};

export default FamilyFinanceState;
