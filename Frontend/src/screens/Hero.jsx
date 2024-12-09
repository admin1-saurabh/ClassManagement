import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import Navbar from '../components/Navbar'
import Herogallery from '../components/Herogallery'

export default function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role) {
      setIsLoggedIn(true); 
    }
  }, [isLoggedIn]);

  const gotoDashboard = async () => {
    const role = localStorage.getItem('role'); 

    if(role == "teacher") navigate("/teacher/dashboard/");
    if(role == "student") navigate("/student/dashboard/");
  } 

  return (
    
    <div>
        <div className='w-screen px-12 pt-4'>
            <Navbar/>
        </div>
        <div className='h-48 flex justify-center items-center'>
          <div className='text-cyan-800 text-4xl'>Organized Education for Every Mind</div>
        </div>
        {isLoggedIn && <div className='flex w-full justify-center items-center'><button onClick={gotoDashboard} className='px-6 py-3 bg-cyan-800 text-white rounded-xl hover:scale-105 hover:bg-cyan-900'>Go to Dashboard</button></div>}
        <div className='flex justify-center w-screen px-12 py-6'>
            <Herogallery/>
        </div>
    </div>
  )
}
