"use client";
import React, { useState, useEffect } from "react";
import TransactionItem from "./TransactionItem";
import { API_BASE_URL } from "../../api/config";
import SearchBar from "./SearchBar";

function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
const fetchTransactions = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const queryParams = new URLSearchParams({
      page: pagination.page,
      limit: pagination.limit,
      ...(searchTerm && { search: searchTerm })
    });

    const response = await fetch(
      `${API_BASE_URL}/account/transactions?${queryParams}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch transactions');
    }

    const result = await response.json();
    console.log('Transactions API response:', result);

    if (result.success) {
      setTransactions(result.data.transactions);
      setPagination({
        page: result.data.pagination.currentPage,
        limit: result.data.pagination.limit,
        total: result.data.pagination.total,
        pages: result.data.pagination.pages
      });
    } else {
      throw new Error(result.message);
    }
  } catch (err) {
    console.error('Transactions fetch error:', err);
  } finally {
    setLoading(false);
  }
};

    const debounceTimer = setTimeout(fetchTransactions, 300);
    return () => clearTimeout(debounceTimer);
  }, [pagination.page, pagination.limit, searchTerm]);



  if (loading && transactions.length === 0) {
    return (
      <section className="mt-5">
        <h3 className="text-[12px] tracking-normal leading-none text-stone-300">
          RECENT TRANSACTIONS
        </h3>
        <div className="mt-1.5 space-y-1.5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-neutral-800 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-5">
      <h3 className="text-[12px] tracking-normal leading-none text-stone-300">
        RECENT TRANSACTIONS
      </h3>
      
      <div className="mt-1.5 space-y-1.5">
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            date={new Date(transaction.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
            bank={transaction.bankName}
            amount={`${transaction.amount} ${transaction.currency || 'NGN'}`}
            details={{
              bankName: transaction.bankName,
              accountName: transaction.accountName,
              accountNumber: transaction.accountNumber,
              withdrawalToken: transaction.reference
            }}
            type={transaction.type}
            status={transaction.status}
            showProof={transaction.type === 'deposit' && transaction.status === 'pending'}
          />
        ))}
      </div>
    </section>
  );
}

export default TransactionList;