import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Test from '../components/Test';

export default function TestDashboard() {
  const [tests, setTests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTest, setNewTest] = useState({
    name: '',
    description: '',
    max_marks: 100,
    schedule_time: '',
  });
  const [activeTab, setActiveTab] = useState('upcoming'); 
  const navigate = useNavigate();

  // Fetch the list of tests
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = {
          classroom_id: localStorage.getItem('classroom_id'),
        };
        console.log(data);
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_SERVICE_URL}service/tests_by_date/`,
          data
        );

        // Map the data format correctly
        const formattedTests = response.data.data.upcoming_tests.map((test) => ({
          id: test[0],
          classroomId: test[1],
          name: test[2],
          description: test[3],
          maxMarks: test[4],
          scheduleTime: test[5].replace('T', ' '), // Replace "T" with a space for display
          createdAt: test[6],
        }));
        setTests(formattedTests);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to Get Dashboard!');
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewTest((prevState) => {
      if (name === 'schedule_time') {
        const [date, time] = value.split('T');
        const timeWithSeconds = time.split(':').slice(0, 2).join(':') + ':00'; // Add "00" as seconds
        return {
          ...prevState,
          [name]: `${date} ${timeWithSeconds}`, // Replace "T" with a space
        };
      }

      return {
        ...prevState,
        [name]: name === 'max_marks' ? parseInt(value, 10) : value,
      };
    });
  };

  // Handle form submission to create a new test
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...newTest,
        classroom_id: localStorage.getItem('classroom_id'),
        teacher_id: localStorage.getItem('teacher_id'),
      };
      console.log(data);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_SERVICE_URL}teacher/create_test/`,
        data
      );
      alert('Test created successfully!');
      setShowForm(false);

      // Update the test list with the new test
      const newTestFormatted = {
        id: response.data.data.id,
        classroomId: response.data.data.classroom_id,
        name: response.data.data.name,
        description: response.data.data.description,
        maxMarks: response.data.data.max_marks,
        scheduleTime: response.data.data.schedule_time.replace('T', ' '),
        createdAt: response.data.data.created_at,
      };
      setTests([...tests, newTestFormatted]);
    } catch (error) {
      console.error('Error creating test:', error);
      alert('Failed to create test!');
    }
  };

  const currentDateTime = new Date();

  // Filter tests
  const upcomingTests = tests.filter(
    (test) => new Date(test.scheduleTime) >= currentDateTime
  );
  const pastTests = tests.filter(
    (test) => new Date(test.scheduleTime) < currentDateTime
  );

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-gray-200 via-cyan-100 to-gray-200">
      <div className="w-screen px-12 pt-4">
        <Navbar />
      </div>

      {/* Tabs for Upcoming and Past Tests */}
      <div className="flex justify-center space-x-8 my-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'upcoming'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300 text-gray-700'
          }`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Tests
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'past'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300 text-gray-700'
          }`}
          onClick={() => setActiveTab('past')}
        >
          Past Tests
        </button>
      </div>

      {/* Test List */}
      <div>
        <div className="flex flex-wrap space-x-8 py-8 px-12 justify-center">
          {(activeTab === 'upcoming' ? upcomingTests : pastTests).map(
            (test, index) => (
              <div key={index} className="w-80">
                <Test
                  test_id={test.id}
                  name={test.name}
                  description={test.description}
                  maxMarks={test.maxMarks}
                  scheduledTime={test.scheduleTime}
                />
              </div>
            )
          )}
        </div>
      </div>

      {/* Floating Create Test Button */}
      <div className="flex fixed bottom-0 right-0 z-50 m-8 space-x-4">
        <div
          className="px-8 py-3 bg-purple-800 text-white rounded-2xl cursor-pointer hover:scale-105 hover:bg-purple-900"
          onClick={() => {navigate("/teacher/classroom/students/");}}
        >
          - View Students
        </div>
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
                  name="schedule_time"
                  value={newTest.schedule_time.replace(' ', 'T')} // Convert space to "T" for input
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
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-800 text-white rounded"
                >
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
