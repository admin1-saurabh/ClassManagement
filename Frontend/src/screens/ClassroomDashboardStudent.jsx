import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Test from '../components/Test';

export default function ClassroomDashboardStudent() {
  const [tests, setTests] = useState([]);
  const [studentClassId, setStudentClassId] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentClassId = async () => {
      try {
        const studentId = localStorage.getItem('student_id');
        const data = { student_id: studentId };
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_SERVICE_URL}student/get_student_class_id/`,
          data
        );

        // Parse response to extract class ID
        const classId = response.data.data[0][0];
        setStudentClassId(classId !== 'unassigned' ? classId : 'Unassigned');
      } catch (error) {
        console.error('Error fetching student class ID:', error);
        setStudentClassId('Error fetching class ID');
      }
    };

    fetchStudentClassId();
  }, []);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const classroomId = localStorage.getItem('classroom_id');
        const data = { classroom_id: classroomId };
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_SERVICE_URL}service/tests_by_date/`,
          data
        );

        const formattedTests = response.data.data.upcoming_tests.map((test) => ({
          id: test[0],
          classroomId: test[1],
          name: test[2],
          description: test[3],
          maxMarks: test[4],
          scheduleTime: test[5].replace('T', ' '),
          createdAt: test[6],
        }));
        setTests(formattedTests);
      } catch (error) {
        console.error('Error fetching tests:', error);
        alert('Failed to Get Dashboard!');
      }
    };

    fetchTests();
  }, []);

  const currentDateTime = new Date();
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

      {/* Student Class ID Section */}
      <div className="text-center my-4">
        {studentClassId ? (
          <p className="text-xl font-semibold">
            Class ID: {studentClassId}
          </p>
        ) : (
          <p className="text-xl font-semibold">Loading class information...</p>
        )}
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
    </div>
  );
}
