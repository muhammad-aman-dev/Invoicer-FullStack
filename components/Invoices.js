'use client'
import Image from 'next/image'
import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Link from 'next/link'

const Invoices = () => {
 const [addCard, setaddCard] = useState(false)
 const [customerName, setcustomerName] = useState('')
 const [customerPhone, setcustomerPhone] = useState('')
 const [status, setstatus] = useState('Not Paid')
 const [paidAmount, setpaidAmount] = useState(0)
 const [totalAmount, settotalAmount] = useState(0)
 const [animate, setanimate] = useState()
 const [products, setproducts] = useState([{name:'',quantity:'',priceforone:'',totalPOP:''}])
 const [invoices, setinvoices] = useState([])
 const [loading, setloading] = useState(true)
 const [confirmation, setconfirmation] = useState(false)
 const [invoicetodel, setinvoicetodel] = useState('')
 const [sure, setsure] = useState(false)
 const [search, setsearch] = useState('')
 const [searchInvoices, setsearchInvoices] = useState([])
 const [notfound, setnotfound] = useState(false)
 const [isSubmitting, setisSubmitting] = useState(false)
 const handleAdd=()=>{
  (addCard==true)?setaddCard(false):setaddCard(true);
 }
 const handleClose=()=>{
  (addCard==true)?setaddCard(false):setaddCard(true);
 }
 const hancleProducts=(value,field,index)=>{
  let updateProducts=[...products];
  updateProducts[index][field]=value;
    updateProducts[index]['totalPOP']=updateProducts[index]['priceforone']*updateProducts[index]['quantity'];
  setproducts(updateProducts);
 }

 const handleAddProduct=()=>{
  let updateProducts=[...products,{name:'',quantity:'',priceforone:'',totalPOP:''}]
  setproducts(updateProducts);
}

const handleremoveProduct=()=>{
  let updateProducts=products.slice(0,-1)
  setproducts(updateProducts);
}

useEffect(() => {
  let total=0;
  products.map((product)=>{
   total=total+product.totalPOP;
  })
  if(total!=0){
  settotalAmount(total);
  }
}, [products])

const handlestatus=(value)=>{
  setstatus(value);
}

const customerN=(value)=>{
  setcustomerName(value);
}
const customerP=(value)=>{
  setcustomerPhone(value);
}

useEffect(() => {
  setanimate(addCard)
}, [addCard])

const handleSubmit=async()=>{
  let data={
    customerName,
    customerPhone,
    products,
    paidAmount,
    totalAmount,
    status
  }
  if(data.customerName==''||data.customerPhone==''||data.products==[{name:'',quantity:'',priceforone:'',totalPOP:''}]||data.totalAmount==0){
    return toast('Please Enter All Details...');
  }
  setisSubmitting(true);
  console.log(data)
  try{
    let res=await axios.post('/api/invoice',data);
    if(res.status==200){
      console.log(res.data)
      setcustomerName('');
      setcustomerPhone('');
      setproducts([{name:'',quantity:'',priceforone:'',totalPOP:''}]);
      setstatus('Not Paid');
      setpaidAmount(0);
      settotalAmount(0); 
      toast('Invoice Added!')
      getInvoices();
    }
  }
  catch(err){
    toast.error('Some Error Occurred while connecting...')
    console.log(err) 
  }
  setisSubmitting(false)
}
 
 async function getInvoices(){
  setloading(true);
  try{
    let res=await axios.get('/api/invoice');
    if(res.status==200){
      console.log('Invoices Fetched...')
    }
    let data=res.data;
    setinvoices(data.invoices)
  }
  catch(err){
    toast.error('Some Error Occurred while connecting...')
    console.log(err)
  }
  setloading(false)
 }
 
 useEffect(() => {
   getInvoices();
 }, [])
 
 function handleconfirm(num){
  setinvoicetodel(num);
  setconfirmation(true);
  setTimeout(() => {
    setsure(true)
  }, 100);
 }

 function refreshCard(){
      setcustomerName('');
      setcustomerPhone('');
      setproducts([{name:'',quantity:'',priceforone:'',totalPOP:''}]);
      setstatus('Not Paid');
      settotalAmount(0); 
 }

 const handleDelinvoice=async()=>{
  let toDel=invoicetodel;
  try{
   let res=await axios.delete(`/api/invoice/?id=${toDel}`);
   let data=await res.data;
   toast(data.data);
   getInvoices();
  }
  catch(err){
    console.log(err);
  }
 } 

 async function handleSearch(data){
  setnotfound(false)
  setsearchInvoices([]);
  setsearch(data);
  try{
  let res=await axios.get(`/api/search/?id=${data}`)
  let invoices=res.data.data;
  setsearchInvoices(invoices);
  if(res.data.data.length==0){
    setnotfound(true);
  }
  }
  catch(err){
    setsearchInvoices([])
    setnotfound(true);
    console.log(err)
  }
 }

  return (
    <div className='relative'>
      {confirmation&&<div className='absolute bg-black/30 backdrop-blur-sm w-full min-h-screen z-50 flex justify-center'><div className={`bg-white w-[80%] sm:w-[50%] ${sure?'scale-100':'scale-0'} duration-300 mt-[100px] max-h-[200px]`}><h1 className='mt-4 text-center text-gray-800 text-xl'>Are You Sure?</h1><div onClick={(e)=>{e.stopPropagation(); setconfirmation(false); setsure(false); handleDelinvoice();}} className='mt-10 flex justify-center gap-2'><div className='bg-green-600 w-[70px] text-center p-1 rounded-md hover:bg-green-700 cursor-pointer text-white'>Yes</div><div className='flex justify-center'><div onClick={(e)=>{e.stopPropagation(); setconfirmation(false); setsure(false); setinvoicetodel('');}} className='bg-red-600 w-[70px] text-center p-1 rounded-md hover:bg-red-700 cursor-pointer text-white'>No</div> </div></div></div></div>}
    <div className='flex flex-col font-serif gap-2 pr-1 sm:pr-0'>
        <h1 className='text-3xl ml-3 sm:ml-0 text-gray-800'>Invoices</h1>
        <div className='flex gap-2'>
        <div className='relative w-3/4'>
      <input type="text" value={search} onChange={(e)=>{handleSearch(e.target.value);}} placeholder='Search Invoice' className='w-[100%] border-1 p-1 rounded-xl'/>
       <Image src='/search.svg' width={20} height={20} alt='search' className='absolute top-2 right-2 cursor-pointer'/>
       </div>
       <button className='bg-[#2b7fff] rounded-xl px-2 py-1 text-white cursor-pointer hover:scale-105 h-max duration-150 flex gap-2 text-xs sm:text-xl' onClick={handleAdd}>Create Invoice<Image src='/add.svg' width={20} height={20} className='h-auto w-auto' alt='add'/></button>
       </div> 
       <div className={`${search===''?'hidden':'block'} absolute top-20 w-full sm:w-3/4 z-50 bg-white min-h-[200px] max-h-[200px] overflow-y-auto`}>
       {searchInvoices.length>0?<div className='flex flex-col gap-1 p-2'>{searchInvoices.map((invoice)=>{
        return <Link key={invoice.invoiceNum} target='_blank' href={`/invoices/${invoice.invoiceNum}`}><div className='text-white hover:scale-102 duration-150 cursor-pointer bg-[#2b7fff] p-2 flex  justify-between'><div>{invoice.invoiceNum}</div> <div>{invoice.customerName}</div> <div>${invoice.totalAmount}</div></div></Link>
       })}</div>:<><div className='ml-[40%] mt-[50px] border-black border-t-2 rounded-3xl animate-spin w-[50px] h-[50px]'></div><h1 className={`${notfound?'block':'hidden'} text-center font-bold sm:mr-25 mt-5`}>No Invoices Found!!!</h1></>}
       </div>
       </div>
       <div className='mt-6 overflow-auto w-full rounded-xl bg-gray-100 border-b-10 border-gray-100'>
       <table className='w-full bg-white text-gray-700 font-semibold table-auto '>
        <thead className='bg-gray-100 '>
          <tr className='font-semibold border-gray-700 text-center'>
          <th className=' px-2 py-2 border-2 border-gray-200  overflow-hidden text-ellipsis'>#</th>
          <th className=' px-2 py-2 border-2 border-gray-200  overflow-hidden text-ellipsis'>Customer</th>
          <th className=' px-2 py-2 border-2 border-gray-200 overflow-hidden text-ellipsis'>Phone</th>
          <th className=' px-2 py-2 border-2 border-gray-200 overflow-hidden text-ellipsis'>Amount</th>
          <th className=' px-2 py-2 border-2 border-gray-200 overflow-hidden text-ellipsis'>Date</th>
          <th className=' px-2 py-2 border-2 border-gray-200 overflow-hidden text-ellipsis'>Status</th>
          <th className=' px-2 py-2 border-2 border-gray-200 overflow-hidden text-ellipsis'>Actions</th>
          </tr>
        </thead>
        <tbody className=' bg-gray-100'>
          {loading?<tr className='bg-white'><td colSpan={7} className='text-center p-2 font-bold'><div className='flex gap-3 justify-center'><div className='w-6 h-6 border-t-2 rounded-2xl animate-spin border-t-black'></div><div>Loading Invoices.....</div></div></td></tr>:
          (invoices.length>0)?invoices.map((data,index)=>{
          return <tr className='bg-white border-5 text-center border-gray-100' key={index}>
          <td className='overflow-hidden py-2 text-ellipsis border-2 border-gray-200 px-2'>{data.invoiceNum}</td>
          <td className='overflow-hidden py-2 text-ellipsis border-2 border-gray-200 px-2'>{data.customerName}</td>
          <td className='overflow-hidden py-2 text-ellipsis border-2 border-gray-200 px-2'>{data.customerPhone}</td>
          <td className='overflow-hidden py-2 text-ellipsis border-2 border-gray-200 px-2'>${data.totalAmount}</td>
          <td className='overflow-hidden py-2 text-ellipsis border-2 border-gray-200 px-2'>{new Date(data.createdAt).toLocaleDateString()}</td>
          <td className='overflow-hidden py-2 text-ellipsis border-2 border-gray-200 px-2'>{data.status}</td>
          <td className='overflow-hidden py-2 text-ellipsis border-2 border-gray-200 px-2'><div className='flex gap-2 justify-center w-max sm:w-full'><Link href={`/invoices/${data.invoiceNum}`} target='_blank'><Image src={'/view.svg'} width={20} height={20} alt='view detailed' className='cursor-pointer'/></Link><Image onClick={()=>{handleconfirm(data.invoiceNum)}} src={'/delete1.svg'} width={20} height={20} alt='delete' className='cursor-pointer'/><Link href={`/editinvoice/${data.invoiceNum}`} target='_blank'><Image src={'/edit.svg'} height={20} width={20} className='cursor-pointer' alt='edit invoice'/></Link></div></td>
          </tr>}):<tr className='bg-white'><td colSpan={7} className='text-center p-2 font-bold'>No Invoices found!!!</td></tr>
}          
<tr className='bg-white border border-gray-100'><td colSpan={7} className='text-center p-2 '>As You are logged in as guest so you can only see last 10 minutes invoices...</td></tr>
       </tbody>
       </table>
       </div>
       {addCard&&<div className='bg-black/30 backdrop-blur-sm fixed z-50 top-0 w-full sm:w-[calc(100vw-200px)] min-h-screen' onClick={handleClose}>
       <Image src={'/close.svg'} height={30} width={30} alt='close' className='hover:scale-105 cursor-pointer absolute top-1 sm:top-3 right-2 sm:right-15' onClick={handleClose}/>
       <div onClick={(e) => e.stopPropagation()} className={`mt-[8%] text-gray-800 flex flex-col items-center rounded-xl bg-white w-[80%] h-[520px] overflow-y-auto ml-[10%] sm:ml-[3/4] sm:w-3/4 transition-all duration-700 ${(animate)?'opacity-100 scale-100':'opacity-0 scale-50'} relative`}>
        <Image src={'/refresh.svg'} width={20} height={20} alt='refresh' className='absolute z-10 right-4 top-2 cursor-pointer' onClick={(e)=>{e.stopPropagation(); refreshCard()}}/>
        <h1 className='text-2xl font-bold font-serif mt-1'>Add New Invoice</h1>
        <div className='w-full p-2'>
          <div className='flex flex-col sm:flex-row gap-2'>
            <div className='w-full relative'>
        <input type="text" id='cname1' className='w-full border-1 rounded-xl p-1 peer focus:shadow-md focus:outline-0 shadow-[#2b7fff]' placeholder='Enter Customer Name!' value={customerName} onChange={(e)=>{customerN(e.target.value)}}/>
          <label htmlFor={`cname1`} className='hidden text-gray-500 sm:block absolute bg-white top-1 left-1 peer-focus:top-[-13px] peer-focus:scale-80 peer-placeholder-shown:top-1 peer-[&:not(:placeholder-shown)]:top-[-13px] peer-[&:not(:placeholder-shown)]:scale-80 transition-all duration-150'>Enter Customer Name!</label>
        </div>
        <div className='w-full relative'>
        <input type="text" id='cphone1' className='w-full border-1 rounded-xl p-1 peer focus:shadow-md focus:outline-0 shadow-[#2b7fff]' placeholder='Enter Customer Phone!' value={customerPhone} onChange={(e)=>{customerP(e.target.value)}}/>
          <label htmlFor={`cphone1`} className='hidden text-gray-500 sm:block absolute bg-white top-1 left-1 peer-focus:top-[-13px] peer-focus:scale-80 peer-placeholder-shown:top-1 peer-[&:not(:placeholder-shown)]:top-[-13px] peer-[&:not(:placeholder-shown)]:scale-80 transition-all duration-150'>Enter Customer Phone!</label>
        </div>
        </div>
        <h1 className='text-xl font-bold font-serif ml-1 mt-1'>Products</h1>
        <div className='flex flex-col'>
        {products.map((product,index)=>{
          return <div className='flex flex-col gap-2 bg-gray-100 p-2 rounded-md' key={index}>
            <h1 className='text-center font-bold font-mono'>{index+1}</h1>
            <div className='flex gap-1'>
              <div className='relative w-2/4'>
            <input id={`pname${index}`} type="text" value={product.name} className='peer focus:shadow-md focus:outline-0 shadow-[#2b7fff] w-full border-1 rounded-xl p-1' placeholder='Enter Product Name! ' onChange={(e)=>{hancleProducts(e.target.value,'name',index)}}/>
            <label htmlFor={`pname${index}`} className='hidden text-gray-500 sm:block absolute bg-gray-100 left-1 peer-focus:top-[-13px] peer-focus:scale-80 peer-placeholder-shown:top-1 peer-[&:not(:placeholder-shown)]:top-[-13px] peer-[&:not(:placeholder-shown)]:scale-80 transition-all duration-150'>Enter Product Name!</label>
            </div>
              <div className='relative w-2/4'>
            <input id={`pnumbers${index}`} type="number" value={product.quantity} className='peer focus:shadow-md focus:outline-0 shadow-[#2b7fff] w-full border-1 rounded-xl p-1' placeholder='Enter Product Quantity!' onChange={(e)=>{hancleProducts(e.target.value,'quantity',index)}}/>
            <label htmlFor={`pnumbers${index}`} className='hidden text-gray-500 sm:block absolute bg-gray-100 left-1 peer-focus:top-[-13px] peer-focus:scale-80 peer-placeholder-shown:top-1 peer-[&:not(:placeholder-shown)]:top-[-13px] peer-[&:not(:placeholder-shown)]:scale-80 transition-all duration-150'>Enter Product Quantity!</label>
          </div>
          </div>
            <div className='flex gap-1 sm:mt-2'>
            <div className='relative w-2/4'>
            <input id={`pop1${index}`} type="number" value={product.priceforone} className='peer focus:shadow-md focus:outline-0 shadow-[#2b7fff] w-full border-1 rounded-xl p-1' placeholder='Enter Price For One Piece!' onChange={(e)=>{hancleProducts(e.target.value,'priceforone',index)}}/>
            <label htmlFor={`pop1${index}`} className='hidden text-gray-500 sm:block absolute bg-gray-100 left-1 peer-focus:top-[-13px] peer-focus:scale-80 peer-placeholder-shown:top-1 peer-[&:not(:placeholder-shown)]:top-[-13px] peer-[&:not(:placeholder-shown)]:scale-80 transition-all duration-150'>Enter Price For One Piece!</label>
            </div>
            <div className='relative w-2/4'>
            <input type="number" id={`tpop${index}`} value={product.totalPOP} className='peer focus:shadow-md focus:outline-0 shadow-[#2b7fff] w-full border-1 rounded-xl p-1' placeholder='Total Price For Product!' onChange={(e)=>{hancleProducts(e.target.value,'totalPOP',index)}}/>
            <label htmlFor={`tpop${index}`} className='hidden text-gray-500 sm:block absolute bg-gray-100 left-1 peer-focus:top-[-13px] peer-focus:scale-80 peer-placeholder-shown:top-1 peer-[&:not(:placeholder-shown)]:top-[-13px] peer-[&:not(:placeholder-shown)]:scale-80 transition-all duration-150'>Total Price For Product!</label>
          </div>
          </div>
          </div>
        })}
        </div>
        <div className='flex justify-center gap-1'>
        <button className='bg-[#2b7fff] hover:bg-blue-700 rounded-xl text-sm px-2 py-1 text-white cursor-pointer  h-max flex gap-2 mt-1' onClick={handleAddProduct}>Add Product<Image src='/add.svg' priority width={20} height={20} className='h-auto w-auto' alt='add'/></button>
        {products.length>1&&<button className='bg-red-600 hover:bg-red-700 rounded-xl px-2 py-1 text-sm text-white cursor-pointer h-max flex gap-2 mt-1' onClick={handleremoveProduct}>Remove Product<Image src='/delete.svg' width={20} height={20} className='h-auto w-auto' alt='add'/></button>}
        </div>
        </div>
        <div className='flex justify-between w-full px-4 mt-3'>
        <div className='flex flex-col justify-center'>
          <h2 className='font-bold underline'>Paid Amount</h2>
        <div className='relative w-3/4 flex flex-col'>
            <input id={`paidAmount`} type="number" value={paidAmount} className='peer focus:shadow-md focus:outline-0 shadow-[#2b7fff] w-full border-1 rounded-xl p-1' placeholder='Enter Price Paid!' onChange={(e)=>{setpaidAmount(e.target.value)}}/>
            <label htmlFor={`paidAmount`} className='hidden text-gray-500 sm:block absolute bg-gray-100 left-1 peer-focus:top-[-13px] peer-focus:scale-80 peer-placeholder-shown:top-1 peer-[&:not(:placeholder-shown)]:top-[-13px] peer-[&:not(:placeholder-shown)]:scale-80 transition-all duration-150'></label>
            </div>
        <h1 className='underline font-bold text-gray-800'>Total Amount</h1>
        <h1 className='bg-gray-100 w-150px text-center px-5 py-3 rounded-md font-bold text-xl'>${totalAmount}</h1>
        </div>
        <div>
        <h1 className='underline font-bold text-gray-800'>Status</h1>
        <select name="status" id="status" defaultValue={status} className='bg-gray-100 p-2 py-4 text-gray-800 font-bold text-xs' onChange={(e)=>{handlestatus(e.target.value)}}>
          <option value="Not Paid">Not Paid</option>
          <option value="Paid">Paid</option>
        </select>
        </div>
        </div>
        <button disabled={isSubmitting}  onClick={handleSubmit} className={`${isSubmitting?'bg-[#8ab0e9]':'bg-[#2b7fff] hover:bg-blue-700'} mb-2 rounded-b-3xl text-md px-2 py-1 text-white cursor-pointer  h-max flex justify-center gap-2 mt-4 w-[90%]`} >{isSubmitting?'Submitting...':'Save'}<Image src='/save.svg' width={20} height={20} className='h-auto w-auto' alt='add'/></button>
        </div>
       </div>}
        </div>
  )
}

export default Invoices