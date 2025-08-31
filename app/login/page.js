'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Typewriter } from 'react-simple-typewriter';
import Image from 'next/image';

const Page = () => {
  const router = useRouter();
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [isActiveLogin, setisActiveLogin] = useState(false);
  const [isActiveGuest, setisActiveGuest] = useState(false);
  const [showPass, setshowPass] = useState(false);

  function handleshowPass() {
    setshowPass(!showPass);
  }

  async function handleLogin() {
    setisActiveLogin(true);
    if (email === '' || password === '') {
      toast('Please Enter Valid Inputs....');
      setisActiveLogin(false)
      return;
    }
    let data = { email, password };
    try {
      let res = await axios.post('/api/login', data);
      if (res.status === 200) {
        toast('Login Successful...');
        setTimeout(() => router.push('/'), 500);
      }
      setemail('');
      setpassword('');
    } catch (err) {
      toast('Some Error Occurred...');
      console.log(err);
    }
    setisActiveLogin(false);
  }

  async function handleGuest() {
    setisActiveGuest(true);
    let data = { email: 'guest@gmail.com', password: 'guestguestguest' };
    try {
      let res = await axios.post('/api/login', data);
      if (res.status === 200) {
        toast('Login Successful...');
        setTimeout(() => router.push('/'), 500);
      }
      setemail('');
      setpassword('');
    } catch (err) {
      toast('Some Error Occurred...');
      console.log(err);
    }
    setisActiveGuest(false);
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 flex-col w-full gap-6 px-4">
      <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
        Invoicer
      </h1>
      <h2 className="text-lg sm:text-xl h-11 font-medium text-gray-700 text-center max-w-xl leading-relaxed">
        <Typewriter
          words={[
            "Professional Invoices, hassle-free...",
            "Realtime Revenue Tracking & Reports...",
            "Manage Customers and Payments with ease...",
            "Empower your business with clear insights..."
          ]}
          loop={0}
          cursor
          cursorStyle="|"
          typeSpeed={70}
          delaySpeed={1300}
          deleteSpeed={50}
        />
      </h2>
      <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-2xl shadow-xl w-full sm:w-1/2 lg:w-1/3 flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
          className="border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 p-3 rounded-xl transition"
        />
        <div className='w-full relative'>
          <Image src={showPass?'/notview.svg':'/view.svg'} className='absolute cursor-pointer right-2 top-3' height={24} width={24} alt='Show Password Image' onClick={handleshowPass}/>
        <input
          type={showPass?"text":"password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          className="border w-full border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 p-3 rounded-xl transition"
        />
        </div>
        <button
          className={`w-full ${isActiveLogin||isActiveGuest?'bg-[#71a7f8] cursor-no-drop':'bg-[#2b7fff] hover:bg-blue-600 cursor-pointer'} active:scale-[0.98] text-white py-3 rounded-xl font-semibold transition shadow-md`}
          onClick={handleLogin}
          disabled={isActiveLogin||isActiveGuest}
        >
          {isActiveLogin?"Loging In....":"Login"}
        </button>
        <button
          className={`w-full ${isActiveGuest||isActiveLogin?'bg-gray-300 cursor-no-drop':'bg-gray-100 hover:bg-gray-200 cursor-pointer'} flex justify-center items-center gap-2 active:scale-[0.98] text-gray-700 rounded-xl py-3 font-medium transition shadow`}
          onClick={handleGuest}
          disabled={isActiveGuest||isActiveLogin}
        >
          {isActiveGuest?'Guest Logging In...':<><Image src={'/guest.svg'} height={25} width={25} alt='Guest SVG Link' className='invert'/>
          <h4>Try As Guest</h4></>}
        </button>
      </div>
    </div>
  );
};

export default Page;
