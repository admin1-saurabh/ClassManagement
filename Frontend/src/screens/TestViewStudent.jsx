import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestViewStudent = () => {
  const [testDetails, setTestDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAttempting, setIsAttempting] = useState(false);
  const [answer, setAnswer] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState('');

  // Fetching test details from backend API
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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchTestData();
  }, []);

  // Submit answer to backend API
  const submitAnswer = async () => {
    try {
      const data = {
        test_id: localStorage.getItem('test_id'),
        student_id: localStorage.getItem('student_id'), 
        answer: answer,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_SERVICE_URL}student/test_attempt/`,
        data
      );
      console.log('Answer submitted successfully:', response);
      setSubmissionStatus('Answer submitted successfully!');
      setIsAttempting(false); // Close the form
    } catch (error) {
      console.error('Error submitting answer:', error);
      setSubmissionStatus('Failed to submit answer. Please try again.');
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
        {!isAttempting && (
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setIsAttempting(true)}
          >
            Attempt Test
          </button>
        )}
      </div>

      {/* Attempt Test Form */}
      {isAttempting && (
        <div className="attempt-form bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter Your Answer</h2>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="border rounded w-full p-2 mb-4"
            rows="6"
            placeholder="Write your answer here..."
            required
          />
          <div className="flex space-x-4">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={submitAnswer}
            >
              Submit Answer
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => setIsAttempting(false)}
            >
              Cancel
            </button>
          </div>
          {submissionStatus && (
            <p className="mt-4 text-sm text-gray-600">{submissionStatus}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TestViewStudent;
