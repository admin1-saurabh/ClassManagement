import React from 'react'
import Navbar from '../components/Navbar'
import Herogallery from '../components/Herogallery'

export default function Hero() {
  return (
    <div>
        <div className='w-screen px-12 pt-4'>
            <Navbar/>
        </div>
        <div className='h-48 flex justify-center items-center'>
          <div className='text-cyan-800 text-4xl'>Organized Education for Every Mind</div>
        </div>
        <div className='flex justify-center w-screen px-12 py-6'>
            <Herogallery/>
        </div>
    </div>
  )
}
