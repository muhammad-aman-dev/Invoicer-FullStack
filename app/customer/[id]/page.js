'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const Page = ({ params }) => {
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState({});
  const [invoices, setInvoices] = useState([]);

  async function getData(id) {
    setLoading(true);
    try {
      const res = await axios.get(`/api/customerDetails?id=${id}`);
      const customergot = res.data.data.customer;
      const invoicesgot = res.data.data.customerInvoices;
      setCustomer(customergot);
      setInvoices(invoicesgot);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(true);
    }
  }

  useEffect(() => {
    if (params?.id) {
      getData(params.id);
    }
  }, [params.id]);  // ✅ add dependency here

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-2">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <h1 className="font-bold text-blue-600 text-2xl">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white shadow-md rounded-2xl p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Customer Details</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <span className="font-semibold text-gray-600">Name: </span>
            <span className="text-gray-800">{customer.customerName}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-600">Phone: </span>
            <span className="text-gray-800">{customer.customerPhone}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-600">Invoices: </span>
            <span className="text-gray-800">{customer.invoices}</span>
          </div>
        </div>

        {/* Invoices Table */}
        <section className="Invoices w-full mt-6">
          <div className="grid grid-cols-6 bg-gray-100 text-gray-700 font-semibold rounded-t-lg">
            <h3 className="py-3 text-center text-xs sm:text-sm">Number</h3>
            <h3 className="py-3 text-center text-xs sm:text-sm">Products</h3>
            <h3 className="py-3 text-center text-xs sm:text-sm">Amount</h3>
            <h3 className="py-3 text-center text-xs sm:text-sm">Paid</h3>
            <h3 className="py-3 text-center text-xs sm:text-sm">Status</h3>
            <h3 className="py-3 text-center text-xs sm:text-sm">Link</h3>
          </div>

          {invoices.map((invoice, index) => {
            const products = invoice.products.length;

            return (
              <div
                key={index}
                className="grid grid-cols-6 text-center text-gray-700 border-t border-gray-200 bg-white hover:bg-blue-50 transition duration-150"
              >
                <h3 className="py-3 text-xs sm:text-sm">{invoice.invoiceNum}</h3>
                <h3 className="py-3 text-xs sm:text-sm">{products}</h3>
                <h3 className="py-3 text-xs sm:text-sm">${invoice.totalAmount}</h3>
                <h3 className="py-3 text-xs sm:text-sm">${invoice.paidAmount}</h3>
                <h3 className="py-3 text-xs sm:text-sm">{invoice.status}</h3>
                <h3 className="py-3 text-xs sm:text-sm">
                  <Link
                    href={`/invoices/${invoice.invoiceNum}`}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </h3>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default Page;