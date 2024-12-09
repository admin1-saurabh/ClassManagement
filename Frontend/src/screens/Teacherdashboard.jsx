import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Class from '../components/Class';

export default function TeacherDashboard() {
  const [classes, setClasses] = useState([]);
  const [showForm, setShowForm] = useState(false); 
  const [newClass, setNewClass] = useState({ name: '', description: '', class_id: '' }); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = {
          teacher_id: localStorage.getItem('teacher_id')
        };
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_SERVICE_URL}service/classrooms/`, data);
        setClasses(response.data.data); 
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to Get Dashboard!');
      }
    };
    fetchData();
  }, []); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClass((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...newClass,
        teacher_id: localStorage.getItem('teacher_id'),
      };
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_SERVICE_URL}teacher/create_classroom/`, data);
      alert('Class created successfully!');
      setShowForm(false); 
      setClasses([...classes, response.data.data]); 
    } catch (error) {
      console.error('Error creating class:', error);
      alert('Failed to create class!');
    }
  };

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

      {/* Floating Create Class Button */}
      <div className="flex fixed bottom-0 right-0 z-50 m-8">
        <div
          className="px-8 py-3 bg-cyan-800 text-white rounded-2xl cursor-pointer hover:scale-105 hover:bg-cyan-900"
          onClick={() => setShowForm(true)}
        >
          + Create Class
        </div>
      </div>

      {/* Modal for Create Class Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Create a New Class</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  name="name"
                  value={newClass.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={newClass.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Class Code</label>
                <input
                  type="text"
                  name="class_id"
                  value={newClass.class_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-cyan-800 text-white rounded">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
