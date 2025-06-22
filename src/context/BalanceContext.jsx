// context/BalanceContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../api/config';

const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState('');

  const fetchBalance = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch(`${API_BASE_URL}/account/balance`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const { data } = await res.json();
    setBalance(data.balance);
    setCurrency(data.currency);
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const updateBalance = (newBalance) => setBalance(newBalance);

  return (
    <BalanceContext.Provider value={{ balance, currency, updateBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => useContext(BalanceContext);
