// frontend/src/components/fetches/useFetchData.js
import { useState, useEffect } from 'react';
import { fetchAccounts } from '../Api';

const useFetchData = () => {
  // const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  // const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // const categoriesData = await fetchCategories();
      const accountsData = await fetchAccounts();
      // const currenciesData = await fetchCurrencies();
      // setCategories(categoriesData);
      setAccounts(accountsData);
      // setCurrencies(currenciesData);
    };
    fetchData();
  }, []);

  return { accounts };
};

export default useFetchData;
