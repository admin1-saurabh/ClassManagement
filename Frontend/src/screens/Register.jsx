import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Teacher'); // Default role
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    data = {
        email: email, 
        password: password
    }

    if(role == 'Teacher'){
        try {
            const response = await axios.post(`${process.env.BACKEND_SERVICE_URL}teacher/register/`, data);
        } catch (error) {
            console.error('Error submitting data:', error);
            alert("Failed to Login!"); 
        }
    } 

    if(role == 'Student'){
        try {
            const response = await axios.post(`${process.env.BACKEND_SERVICE_URL}student/register/`, data);
        } catch (error) {
            console.error('Error submitting data:', error);
            alert("Failed to Login!"); 
        }
    }

    };

  return (
    <div>
      <div className="flex h-1/2 w-screen">
        <div className="w-1/2">
          <img
            className="w-full h-full"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1Kzugrx-dKgopDTusdp3uUVGNa-Ubn0ESiYX9x23wn44cRsEoswckeojkImajrlpx05c&usqp=CAU"
            alt="Left Image"
          />
        </div>
        <div className="w-1/2">
          <img
            className="w-full h-full"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL55bPque_C2iNiKW-M54C2S2wd8vNOCC924hAvcNFu-S-R19ZczlVu_iul9AHHZ0eSFU&usqp=CAU"
            alt="Right Image"
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center bg-gray-100 p-12">
        <div className="w-3/4 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Register for Meril Classroom</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Role Field */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <select
                id="role"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
              </select>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-cyan-700 text-white p-2 rounded-lg shadow-md hover:bg-indigo-700"
            >
              Register
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-600 text-center">
            Already have an account?{' '}
            <Link to="/login/" className="text-cyan-700 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}