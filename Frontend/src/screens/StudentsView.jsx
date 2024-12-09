import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function StudentsView() {
  const [students, setStudents] = useState({ classroom_students: [], remaining_students: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [assignId, setAssignId] = useState('');

  useEffect(() => {
    const getStudentsData = async () => {
      try {
        const data = { classroom_id: localStorage.getItem('classroom_id') };
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_SERVICE_URL}service/classroom_students/`,
          data
        );

        if (response.data.success === 'true') {
          setStudents({
            classroom_students: response.data.data.classroom_students,
            remaining_students: response.data.data.remaining_students,
          });
        } else {
          setError('Failed to fetch students data');
        }
      } catch (err) {
        console.error('Error fetching students data:', err);
        setError('Failed to fetch students data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getStudentsData();
  }, []);

  const handleAssign = (studentId) => {
    setShowAssignForm(true);
    setSelectedStudentId(studentId);
  };

  const handleRemove = async (studentId) => {
    try {
      const classroomId = localStorage.getItem('classroom_id');
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_SERVICE_URL}teacher/deassign_classrooms/`, {
        classroom_id: classroomId,
        student_id: studentId,
      });

      if (response.data.success === 'true') {
        alert('Student removed successfully');
        // Update the list after removing the student
        setStudents(prevState => ({
          ...prevState,
          classroom_students: prevState.classroom_students.filter(student => student[0] !== studentId),
        }));
      } else {
        alert('Failed to remove student. Please try again.');
      }
    } catch (err) {
      console.error('Error removing student:', err);
      alert('Error occurred while removing student. Please try again later.');
    }
  };

  const handleAdd = async (studentId) => {
    try {
      const classroomId = localStorage.getItem('classroom_id');
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_SERVICE_URL}teacher/assign_classrooms/`, {
        classroom_id: classroomId,
        student_id: studentId,
      });

      if (response.data.success === 'true') {
        alert('Student added successfully');
        // Update the list after adding the student
        setStudents(prevState => ({
          ...prevState,
          remaining_students: prevState.remaining_students.filter(student => student[0] !== studentId),
          classroom_students: [
            ...prevState.classroom_students,
            prevState.remaining_students.find(student => student[0] === studentId)
          ],
        }));
      } else {
        alert('Failed to add student. Please try again.');
      }
    } catch (err) {
      console.error('Error adding student:', err);
      alert('Error occurred while adding student. Please try again later.');
    }
  };

  const handleSubmitAssign = async () => {
    if (assignId.trim() === '') {
      alert('Please enter a valid ID.');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_SERVICE_URL}teacher/assign_student_class_id/`, {
        student_id: selectedStudentId,
        student_class_id: assignId,
      });

      if (response.data.success === 'true') {
        alert('ID assigned successfully');
        setShowAssignForm(false);
        setAssignId('');
      } else {
        alert('Failed to assign ID. Please try again.');
      }
    } catch (err) {
      console.error('Error assigning ID:', err);
      alert('Error occurred while assigning ID. Please try again later.');
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading students...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const renderTable = (title, studentsData, type) => (
    <div className="my-6 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold text-gray-700 mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border-b border-gray-300">ID</th>
              <th className="p-3 border-b border-gray-300">Status</th>
              <th className="p-3 border-b border-gray-300">Name</th>
              <th className="p-3 border-b border-gray-300">Email</th>
              <th className="p-3 border-b border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {studentsData.map((student, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-3 border-b border-gray-200">{student[0]}</td>
                <td className="p-3 border-b border-gray-200">{student[1]}</td>
                <td className="p-3 border-b border-gray-200">{student[2]}</td>
                <td className="p-3 border-b border-gray-200">{student[3]}</td>
                <td className="p-3 border-b border-gray-200">
                  {type === 'classroom' ? (
                    <>
                      <button
                        onClick={() => handleAssign(student[0])}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => handleRemove(student[0])}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleAdd(student[0])}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Add
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 to-cyan-100 p-8">
      <h1 className="text-3xl font-semibold text-gray-700 mb-8">Classroom Students</h1>

      {/* Classroom Students */}
      {students.classroom_students.length > 0 ? (
        renderTable('Assigned Classroom Students', students.classroom_students, 'classroom')
      ) : (
        <p className="text-center text-gray-600">No students in the classroom yet.</p>
      )}

      {/* Remaining Students */}
      {students.remaining_students.length > 0 && (
        renderTable('Remaining Students', students.remaining_students, 'remaining')
      )}

      {/* Assign ID Modal */}
      {showAssignForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Assign Student ID</h2>
            <div className="mb-4">
              <label htmlFor="assignId" className="block text-gray-700 mb-2">
                Enter ID:
              </label>
              <input
                type="text"
                id="assignId"
                value={assignId}
                onChange={(e) => setAssignId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter student ID"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSubmitAssign}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
              >
                Submit
              </button>
              <button
                onClick={() => setShowAssignForm(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
