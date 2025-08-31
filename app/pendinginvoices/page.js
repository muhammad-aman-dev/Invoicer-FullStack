'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        let res = await axios.get("/api/pending");
        setData(res.data.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
    getData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <h1 className="font-semibold text-blue-600 text-xl">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 items-center w-full px-4 py-10">
      {/* Title */}
      <h1 className="text-3xl font-extrabold text-gray-800">Pending Invoices</h1>

      {/* Table Container */}
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-gray-700 font-semibold text-sm sm:text-base">
                Number
              </th>
              <th className="py-3 px-4 text-gray-700 font-semibold text-sm sm:text-base">
                Customer
              </th>
              <th className="py-3 px-4 text-gray-700 font-semibold text-sm sm:text-base">
                Link
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-6 text-gray-500 font-medium"
                >
                  No pending invoices 🎉
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">{item.invoiceNum}</td>
                  <td className="py-3 px-4">{item.customerName}</td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/invoices/${item.invoiceNum}`}
                      target="_blank"
                      className="text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                      View details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
