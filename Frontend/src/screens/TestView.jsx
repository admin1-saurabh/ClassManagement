import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestView = () => {
  const [testDetails, setTestDetails] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [marks, setMarks] = useState('');

  // Fetching data from backend API
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const data = {
          test_id: localStorage.getItem('test_id'),
        };
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_SERVICE_URL}service/fetch_test/`,
          data
        );
        console.log(response);
        setTestDetails(response.data.data.test_details);
        setStudentDetails(response.data.data.student_details);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchTestData();
  }, []);

  // Assign Marks API call
  const assignMarks = async (studentId) => {
    try {
      const data = {
        test_id: localStorage.getItem('test_id'),
        student_id: studentId,
        marks: marks,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_SERVICE_URL}teacher/assign_marks/`,
        data
      );
      console.log('Marks assigned successfully:', response);
      // Refresh student details after updating marks
      setStudentDetails((prevDetails) =>
        prevDetails.map((student) =>
          student[0] === studentId ? { ...student, 4: marks } : student
        )
      );
      setEditingStudentId(null); // Close the form
    } catch (error) {
      console.error('Error assigning marks:', error);
    }
  };

  // Loading state
  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 via-cyan-100 to-gray-200 p-6">
      {/* Test Details Section */}
      <div className="test-details bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{testDetails[0][2]}</h2>
        <p className="text-gray-600 mb-2"><strong>Description:</strong> {testDetails[0][3]}</p>
        <p className="text-gray-600 mb-2"><strong>Total Marks:</strong> {testDetails[0][4]}</p>
        <p className="text-gray-600"><strong>Test Date:</strong> {new Date(testDetails[0][5]).toLocaleString()}</p>
      </div>

      {/* Student Responses Section */}
      <div className="student-details space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Student Responses</h2>
        {studentDetails.map((student, index) => (
          <div
            key={index}
            className="student-card bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500"
          >
            <h3 className="text-xl font-medium text-gray-800">{student[7]}</h3>
            <p className="text-gray-600 mb-2"><strong>Email:</strong> {student[8]}</p>
            <p className="text-gray-600 mb-2">
              <strong>Score:</strong> {student[4] >= 0 ? student[4] : 'Not Graded'}
            </p>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Answer:</h4>
              <p className="text-gray-700">{student[3]}</p>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Submitted on: {new Date(student[5]).toLocaleString()}
              </p>
            </div>
            {/* Assign Marks Button */}
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setEditingStudentId(student[0])}
            >
              {student[4] >= 0 ? 'Change Marks' : 'Assign Marks'}
            </button>
            {editingStudentId === student[0] && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  assignMarks(student[0]);
                }}
                className="mt-4 space-y-4"
              >
                <input
                  type="number"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  className="border rounded w-full p-2"
                  placeholder="Enter marks"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => setEditingStudentId(null)}
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestView;
