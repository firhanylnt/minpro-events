"use client";

import axiosInstance from "@/utils/axios";
import { useEffect, useState } from "react";

interface IRegistered {
    id: number;
    user: {
        fullname: string;
        email: string;
    }
    qty: number;
}

interface ITransaction {
    id: number;
    code: string;
    user: {
        fullname: string;
    }
    total_amount: number;
    status: number;
    qty: number;
    createdAt: Date;
}

export default function EventDetails(params: any) {
  const [dataRegistered, setDataRegistered] = useState<IRegistered[]>([]);
  const [dataTransactions, setDataTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageRegistered, setPageRegistered] = useState(1);
  const [pageSizeRegistered, setPageSizeRegistered] = useState(10);
  const [totalPagesRegistered, setTotalPagesRegistered] = useState(1);
  const [pageTransactions, setPageTransactions] = useState(1);
  const [pageSizeTransactions, setPageSizeTransactions] = useState(10);
  const [totalPagesTransactions, setTotalPagesTransactions] = useState(1);

  const fetchDataRegistered = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/events/detail-registered/${params.params}`, {
        params: { page: pageRegistered, pageSize: pageSizeRegistered },
      });
      setDataRegistered(data.registered);
      setTotalPagesRegistered(Math.ceil(data.data.length / pageSizeRegistered));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataTransactions = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/events/detail-transactions/${params.params}`, {
        params: { page: pageTransactions, pageSize: pageSizeTransactions },
      });
      setDataTransactions(data.transactions);
      setTotalPagesTransactions(Math.ceil(data.data.length / pageSizeTransactions));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataRegistered();
    fetchDataTransactions();
  }, [pageRegistered, pageSizeRegistered,pageTransactions, pageSizeTransactions]);

  return (
    <>
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Registered</h1>

      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Qty</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                className="border border-gray-300 px-4 py-2 text-center"
                colSpan={8}
              >
                Loading...
              </td>
            </tr>
          ) : dataRegistered.length > 0 ? (
            dataRegistered.map((reg) => (
              <tr key={reg.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{reg.user.fullname}</td>
                <td className="border border-gray-300 px-4 py-2">{reg.user.email}</td>
                <td className="border border-gray-300 px-4 py-2">{reg.qty}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                className="border border-gray-300 px-4 py-2 text-center"
                colSpan={8}
              >
                No Data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPageRegistered((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Previous
        </button>
        <span>
          Page {pageRegistered} of {totalPagesRegistered}
        </span>
        <button
          onClick={() => setPageRegistered((prev) => Math.min(prev + 1, totalPagesRegistered))}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>

    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Transactions</h1>

      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Code</th>
            <th className="border border-gray-300 px-4 py-2">Fullname</th>
            <th className="border border-gray-300 px-4 py-2">Qty</th>
            <th className="border border-gray-300 px-4 py-2">Total Amount</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Transaction Date</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                className="border border-gray-300 px-4 py-2 text-center"
                colSpan={8}
              >
                Loading...
              </td>
            </tr>
          ) : dataTransactions.length > 0 ? (
            dataTransactions.map((trx) => (
              <tr key={trx.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{trx.code}</td>
                <td className="border border-gray-300 px-4 py-2">{trx.user.fullname}</td>
                <td className="border border-gray-300 px-4 py-2">{trx.qty}</td>
                <td className="border border-gray-300 px-4 py-2">{trx.total_amount}</td>
                <td className="border border-gray-300 px-4 py-2">{trx.status === 1 ? 'Paid' : trx.status === 2 ? 'Unpaid' : 'Canceled'}</td>
                <td className="border border-gray-300 px-4 py-2"> {new Date(trx.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                className="border border-gray-300 px-4 py-2 text-center"
                colSpan={8}
              >
                No Data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPageRegistered((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Previous
        </button>
        <span>
          Page {pageRegistered} of {totalPagesRegistered}
        </span>
        <button
          onClick={() => setPageRegistered((prev) => Math.min(prev + 1, totalPagesRegistered))}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
    </>
    

    
  );
}
