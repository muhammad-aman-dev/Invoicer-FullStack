'use client'
import React from 'react'
import Image from 'next/image'
import Chart from './Chart.js'
import { useState,useEffect } from 'react'
import Link from 'next/link.js'
import axios from 'axios'

const Dashboard = () => {
   const [Loading, setLoading] = useState(true);
   const [Revenue, setRevenue] = useState('')
   const [Pending, setPending] = useState('')
   const [totalInvoices, settotalInvoices] = useState('')
   const [totalCustomers, settotalCustomers] = useState('')

   async function getData() {
      try {
        const res = await axios.get('/api/dashboardDetails');
        const result = res.data.data;
    
        setRevenue(result.revenue);
        setPending(result.pending);
        settotalInvoices(result.invoicesNumber);
        settotalCustomers(result.customersNumber);
    
        setLoading(false); 
      } catch (err) {
        console.log(err);
        setLoading(false); 
      }
    }
    
    useEffect(() => {
      getData();
    }, []);
    
   

   if(Loading){
      return <div className='flex flex-col justify-center items-center h-screen gap-2'><div className='w-30 h-30 border-t-5 border-blue-600 rounded-full animate-spin'></div><h1 className='font-bold text-blue-600 text-2xl'>Loading...</h1></div>
   }

  return (
    <div className='flex flex-col font-serif gap-2'>
        <h1 className='text-3xl text-gray-800'>Dashboard</h1>
     <div className='flex gap-2 sm:flex-row flex-col max-w-screen'>
      <div className='flex'>
        <div className='flex gap-2'>
        <div className='min-h-[130px] min-w-[180px] bg-[#fafafa] rounded-2xl'>
            <div className='flex ml-1 items-center'>
        <Image src='/money.svg' width={20} height={20} className='mt-1' alt='dollar'/>
        <h1 className='text-md mt-2 text-gray-800'>Revenue</h1>
        </div>
           <div className='ml-[10%] w-[80%] mt-2 h-[80px] flex justify-center items-center bg-white text-lg text-gray-800'><div>$ {Revenue}</div></div>
        </div>
        <Link href={'/pendinginvoices'} target='_blank'><div className='min-h-[130px] min-w-[180px] bg-[#fafafa] rounded-2xl'>
            <div className='flex items-center ml-1'>
        <Image src='/money.svg' width={20} height={20} className='mt-1' alt='dollar'/>
        <h1 className='text-md mt-2 text-gray-800'>Pending</h1>
        </div>
           <div className='ml-[10%] w-[80%] mt-2 h-[80px] flex justify-center items-center bg-white text-lg text-gray-800'><div>$ {Pending}</div></div>
        </div></Link>
        </div>
        </div>
        <div className='flex'>
        <div className='flex gap-2'>
        <div className='min-h-[130px] min-w-[180px] bg-[#fafafa] rounded-2xl'>
            <div className='flex items-center ml-1'>
        <Image src='/invoice.svg' width={20} height={20} className='mt-1' alt='dollar'/>
        <h1 className='text-md mt-2 text-gray-800'>Total Invoices</h1>
        </div>
           <div className='ml-[10%] w-[80%] mt-2 h-[80px] flex justify-center items-center bg-white text-lg text-gray-800'><div>{totalInvoices}</div></div>
        </div>
        <div className='min-h-[130px] min-w-[180px] bg-[#fafafa] rounded-2xl'>
            <div className='flex items-center ml-1'>
        <Image src='/customers.svg' width={20} height={20} className='mt-1' alt='dollar'/>
        <h1 className='text-md mt-2 text-gray-800'>Total customers</h1>
        </div>
           <div className='ml-[10%] w-[80%] mt-2 h-[80px] flex justify-center items-center bg-white text-lg text-gray-800'><div>{totalCustomers}</div></div>
        </div>
        </div>
        </div>
     </div>
     <Chart/>
    </div>
  )
}

export default Dashboard