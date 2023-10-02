import { useState, useEffect } from 'react';
// import { DailyPrice, APIResponse } from '../components/types/types';
import { Transaction, APIResponse } from '../components/types/types';
import { get } from '../components/fetchers/fetchers';

export const useGetTransactions = () => {
    const [data, setData] = useState<Transaction[]>([]);
    // const [data, setData] = useState<DailyPrice[]>([]);

    const getData = () => {
        const results = get('./data/DUMMY_DATA.json');
        // const { results } = await get<APIResponse>('http://localhost:8000/api/v1/transaction');
        setData(results)
    }

    useEffect(() => {
        getData()
    }, [])

    return data;
}