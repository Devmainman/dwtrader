import React from "react";
import TransactionItem from "./TransactionItem";

function TransactionList() {
  const transactions = [
    {
      id: 1,
      bank: "Citi Bank",
      date: "27 Nov, 2024 09:14am",
      method: "Bank Transfer",
      type: "Withdrawal",
      amount: "10,000 NGN",
      status: "Pending",
      statusColor: "bg-yellow-700",
      action: "Paused",
      actionColor: "bg-yellow-600",
      details: `Bank Name : eafasfsd
Account Name : afasgsa
Account Number : sfsgs
withdrawal token : 6137257094`,
    },
    {
      id: 2,
      bank: "Citi Bank",
      date: "27 Nov, 2024 09:14am",
      method: "Bank Transfer",
      type: "Deposit",
      amount: "10,000 NGN",
      status: "Pending",
      statusColor: "bg-yellow-700",
      action: "View Poof",
      actionColor: "bg-blue-600",
      details: `Bank Name : eafasfsd
Account Name : afasgsa
Account Number : sfsgs
withdrawal token : 6137257094`,
    },
    {
      id: 3,
      bank: "Citi Bank",
      date: "27 Nov, 2024 09:14am",
      method: "Bank Transfer",
      type: "Deposit",
      amount: "10,000 NGN",
      status: "Pending",
      statusColor: "bg-yellow-700",
      action: "View Poof",
      actionColor: "bg-blue-600",
      details: `Bank Name : eafasfsd
Account Name : afasgsa
Account Number : sfsgs
withdrawal token : 6137257094`,
    },
    {
      id: 4,
      bank: "Citi Bank",
      date: "27 Nov, 2024 09:14am",
      method: "Bank Transfer",
      type: "Deposit",
      amount: "10,000 NGN",
      status: "Completed",
      statusColor: "bg-green-700",
      action: "View Poof",
      actionColor: "bg-blue-600",
      details: `Bank Name : eafasfsd
Account Name : afasgsa
Account Number : sfsgs
withdrawal token : 6137257094`,
    },
    {
      id: 5,
      bank: "Citi Bank",
      date: "27 Nov, 2024 09:14am",
      method: "Bank Transfer",
      type: "Withdrawal",
      amount: "10,000 NGN",
      status: "Failed",
      statusColor: "bg-red-600",
      action: "View Poof",
      actionColor: "bg-blue-600",
      details: `Bank Name : eafasfsd
Account Name : afasgsa
Account Number : sfsgs
withdrawal token : 6137257094`,
    },
  ];

  return (
    <div>
      {transactions.map((transaction) => (
        <div
          className="flex gap-2.5 items-start mt-4 w-full max-md:max-w-full"
          key={transaction.id}
        >
          <TransactionItem transaction={transaction} />
        </div>
      ))}
    </div>
  );
}

export default TransactionList;
