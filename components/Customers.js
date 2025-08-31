import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'

const Customers = () => {
  const [customers, setcustomers] = useState([])
  const [Loading, setLoading] = useState(true);
  
  async function getData() {
    setLoading(true);
    try {
      let data = await axios.get('/api/customers');
      setcustomers(data.data.data);
      setLoading(false);
    }
    catch (err) {
      console.log(err)
      setLoading(true);
    }
  }
  
  useEffect(() => {
    getData();
  }, [])
  
  if (Loading) {
    return (
      <div className='flex flex-col justify-center items-center h-screen gap-2'>
        <div className='w-12 h-12 border-4 border-t-4 border-gray-200 border-t-blue-600 rounded-full animate-spin'></div>
        <h1 className='font-bold text-blue-600 text-2xl'>Loading...</h1>
      </div>
    )
  }

  return (
    <div className='flex flex-col font-serif gap-4 px-3 sm:px-6 text-gray-800'>
      <h1 className='text-3xl font-bold text-gray-800'>Customers</h1>
      
      <section className='customers-display w-full mt-3 bg-white rounded-xl shadow-sm overflow-hidden'>
        {/* Table Header */}
        <div className='grid grid-cols-4 bg-gray-100 text-gray-700 font-semibold'>
          <h3 className='py-3 text-center border-r border-gray-200'>Name</h3>
          <h3 className='py-3 text-center border-r border-gray-200'>Phone</h3>
          <h3 className='py-3 text-center border-r border-gray-200'>Invoices</h3>
          <h3 className='py-3 text-center'>Link</h3>
        </div>
        
        {/* Table Rows */}
        {customers.map((customer, index) => (
          <div 
            key={index} 
            className='grid grid-cols-4 text-center text-gray-700 border-t border-gray-200 hover:bg-blue-50 transition duration-150'
          >
            <h3 className='py-3 border-r border-gray-200 text-xs sm:text-lg'>{customer.customerName}</h3>
            <h3 className='py-3 border-r border-gray-200 text-xs sm:text-lg'>{customer.customerPhone}</h3>
            <h3 className='py-3 border-r border-gray-200 font-semibold '>{customer.invoices}</h3>
            <h3 className='py-3'>
              <Link 
                href={`/customer/${customer._id}`} 
                target='_blank' 
                className='text-blue-600  hover:underline'
              >
                View Details
              </Link>
            </h3>
          </div>
        ))}
      </section>
    </div>
  )
}

export default Customers
