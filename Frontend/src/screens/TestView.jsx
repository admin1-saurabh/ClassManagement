import React from 'react'
import { useState } from 'react'

export default function TestView() {
  
    const test_id = localStorage.getItem('test_id'); 

    return (
    <div>
      {test_id}
    </div>
  )
}
