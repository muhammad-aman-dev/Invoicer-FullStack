"use client";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { useState,useEffect } from "react";
import axios from "axios";
import Dashboard from "@/components/Dashboard";
import Customers from "@/components/Customers";
import Invoices from "@/components/Invoices";
import { useRouter } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export default function Home() {
  const [tab, settab] = useState()
  const router=useRouter();
 async function dbConnect() {
  await axios.get('/api/database'); 
 }

  useEffect(() => {
   dbConnect();
    let newtab=localStorage.getItem('tab')||'home';
  settab(newtab)
  }, [])
  

 async function handleSignOut() {
  try{
  await axios.post('/api/logout');
  router.push('/login');
  }
  catch(err){
    console.log(err)
  }
 }

  const handleHome = () => {
    settab('home');
    localStorage.setItem('tab','home')
  };
  
  const handleCustomers = () => {
    settab('customers')
    localStorage.setItem('tab','customers')
  };
  
  const handleInvoices = () => {
    settab('invoices')
    localStorage.setItem('tab','invoices')
  };

  return (
    <>
    <div>
      <div className=" sm:p-2 flex flex-col sm:flex-row gap-3 h-screen text-[#c2c2c2]">
        <div className="flex-col gap-2 sm:flex ">
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 w-full h-[60px] sm:h-[150px] relative sm:min-w-[200px] sm:max-w-[200px] border-1 sm:rounded-xl px-2">
            <div
              className={`absolute bottom-0 flex ${poppins.className} text-2xl text-amber-50`}
            >
              <Image
                src="/cart.svg"
                width={20}
                height={20}
                alt="Cart"
                priority
                className="h-auto w-auto"
              />
              <div className="text-md sm:text-sm font-bold ">Guest Account</div>
            </div>
          </div>
          <div className="btns bg-[#fafafa] flex flex-row sm:flex-col items-start p-2 sm:h-screen sm:rounded-xl border-1 gap-3">
            <button onClick={handleHome} className={`flex items-center ${(tab==='home')?'bg-blue-200 text-blue-500':''} hover:bg-blue-200 hover:text-blue-500 cursor-pointer w-15 sm:w-full rounded-lg p-2 duration-300`}><Image src='/home.svg' className="ml-3 sm:ml-0" alt="Home" width={20} height={20} /><p className="sm:inline hidden">Home</p></button>
            <button onClick={handleInvoices} className={`flex items-center ${(tab==='invoices')?'bg-blue-200 text-blue-500':''} hover:bg-blue-200 duration-300 hover:text-blue-500 cursor-pointer w-15 sm:w-full rounded-lg p-2`}><Image src='/invoice.svg' className="ml-3 sm:ml-0" alt="Invoices" width={20} height={20}/><p className="sm:inline hidden">Invoices</p></button>
            <button onClick={handleCustomers} className={`flex items-center ${(tab==='customers')?'bg-blue-200 text-blue-500':''} hover:bg-blue-200 duration-300 hover:text-blue-500 cursor-pointer w-15 sm:w-full rounded-lg p-2`}><Image src='/customers.svg' className="ml-3 sm:ml-0" alt="Customers" width={20} height={20}/><p className="sm:inline hidden">Customers</p></button>
          <button onClick={handleSignOut} className="flex sm:hidden bg-[#fafafa] items-center justify-end hover:bg-blue-200 duration-300 hover:text-blue-500 w-30 rounded-lg p-2"><Image src='/out.svg' alt="Sign Out" width={20} height={20} className="h-auto"/>Sign Out</button>
          </div>
          <button onClick={handleSignOut} className="sm:flex bg-[#fafafa] hidden  items-center hover:bg-blue-200 duration-300 hover:text-blue-500 w-full rounded-lg p-2"><Image src='/out.svg' alt="Sign Out" width={20} height={20} className="h-auto"/>Sign Out</button>
        </div>
        <div className="w-full">
        {(tab==='home') && <Dashboard />}
        {(tab==='customers') && <Customers />}
        {(tab==='invoices') && <Invoices />}
        </div>
      </div> 
    </div>
    </>
  );
}

