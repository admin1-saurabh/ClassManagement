import React from 'react'
import Hero from './Hero'
import Footer from './../components/Footer'
import Rating from './../components/Rating'
import Stars from './../components/Stars'

export default function Home() {
  return (
    <div className='h-full w-screen bg-gradient-to-b from-gray-200 via-indigo-300 to-gray-200'>
        <Hero/>
        <blockquote className="text-lg italic font-semibold text-gray-900 flex justify-center items-center py-8 px-8">
            <p>"Meril Classroom: Empowering learning, collaboration, and achievement with innovative tools and seamless design."</p>
        </blockquote>
        <Stars/>
        <Rating/>
        <Footer/>
    </div>
  )
}
