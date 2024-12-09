import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role) {
      setIsLoggedIn(true); 
    }
  }, [isLoggedIn]);

  const handlelogin = () => {
    navigate("/login/");  
  }; 

  const handlelogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('name'); 
    localStorage.removeItem('email'); 

    setIsLoggedIn(false); 
    navigate('/home/');
  }; 

  return (
    <div className='flex justify-between'>
      <div className='flex space-x-3'>
        <img className='h-12 rounded-md' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIZuFd6PEH1vayJY0Y-PaKCybmY8ODpIWBwA&s" alt="" />
        <div className='flex items-center text-xl'>Meril Classroom</div>
      </div>
      <div className='flex space-x-10 text-lg mr-48 items-center'>
        <div>Home</div>
        <div>Products</div>
        <div>Services</div>
        <div>Support</div>
      </div>
      <div>
        {isLoggedIn && <button onClick={handlelogout} className='px-8 py-2 rounded-md bg-blue-500 text-white text-lg shadow-sm hover:scale-105 hover:bg-blue-600'>Logout</button>}
        {!isLoggedIn && <button onClick={handlelogin} className='px-8 py-2 rounded-md bg-blue-500 text-white text-lg shadow-sm hover:scale-105 hover:bg-blue-600'>Login</button>}
      </div>
    </div>
  )
}
