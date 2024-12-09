import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Class from '../components/Class';

export default function StudentDashboard() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = {
          student_id: localStorage.getItem('student_id')
        };
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_SERVICE_URL}service/student_classrooms/`, data);
        console.log(response)
        setClasses(response.data.data); 
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to Get Dashboard!');
      }
    };
    fetchData();
  }, []); 

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-gray-200 via-cyan-100 to-gray-200">
      <div className="w-screen px-12 pt-4">
        <Navbar />
      </div>
      <div>
        <div className="flex flex-wrap space-x-8 py-8 px-12 justify-center">
          {classes.map((classItem, index) => (
            <div key={index} className="w-80">
              <Class
                classroom_id={classItem[0]}
                title={classItem[2]}
                classcode={classItem[4]}
                description={classItem[3]}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
