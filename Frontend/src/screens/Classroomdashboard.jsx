import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Test from '../components/Test'; // Assume this is a component for displaying a single test.

export default function TestDashboard() {
  const [tests, setTests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTest, setNewTest] = useState({
    name: '',
    description: '',
    max_marks: 100,
    scheduled_time: '',
  });

  // Fetch the list of tests
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = {
          classroom_id: localStorage.getItem('classroom_id'), 
        };
        console.log(data);
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_SERVICE_URL}service/tests/`,
          data
        );
        setTests(response.data.data); // Assume `data` contains the list of tests.
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to Get Dashboard!');
      }
    };
    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTest((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission to create a new test
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...newTest,
        classroom_id: localStorage.getItem('classroom_id'), // Link the test to a specific classroom
      };
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_SERVICE_URL}service/create_test/`,
        data
      );
      alert('Test created successfully!');
      setShowForm(false); // Close the form
      setTests([...tests, response.data.data]); // Update the test list
    } catch (error) {
      console.error('Error creating test:', error);
      alert('Failed to create test!');
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-gray-200 via-cyan-100 to-gray-200">
      <div className="w-screen px-12 pt-4">
        <Navbar />
      </div>
      <div>
        <div className="flex flex-wrap space-x-8 py-8 px-12 justify-center">
          {tests.map((test, index) => (
            <div key={index} className="w-80">
              <Test
                name={test[2]}
                description={test[3]}
                maxMarks={test[4]}
                scheduledTime={test[5]}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Floating Create Test Button */}
      <div className="flex fixed bottom-0 right-0 z-50 m-8">
        <div
          className="px-8 py-3 bg-cyan-800 text-white rounded-2xl cursor-pointer hover:scale-105 hover:bg-cyan-900"
          onClick={() => setShowForm(true)}
        >
          + Create Test
        </div>
      </div>

      {/* Modal for Create Test Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Create a New Test</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Test Name</label>
                <input
                  type="text"
                  name="name"
                  value={newTest.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={newTest.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Maximum Marks</label>
                <input
                  type="number"
                  name="max_marks"
                  value={newTest.max_marks}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  min="0"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Scheduled Time</label>
                <input
                  type="datetime-local"
                  name="scheduled_time"
                  value={newTest.scheduled_time}
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
