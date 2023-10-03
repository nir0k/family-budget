import { useState, useEffect } from 'react';
import { TransactionData, APIResponse } from './types';
import { get } from './fetchers';

export const useGetTransactions = () => {
    const [data, setData] = useState<TransactionData[]>([]);

        const getData = async () => {
        const { results } = await get<APIResponse>('http://localhost:8000/api/v1/transaction/');
        setData(results)
    }

    useEffect(() => {
        getData()
    }, [])

    return data;
}