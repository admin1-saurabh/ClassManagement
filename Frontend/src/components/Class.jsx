import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Class({ classroom_id, title, description, classcode }) {

  const navigate = useNavigate(); 
  const classroomdirect = () => {
    localStorage.setItem('classroom_id', classroom_id); 
    navigate("/teacher/classroom/"); 
  }

  return (
    <div className="max-w-xs h-fit bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden my-8">
      <a href="#">
        <img
          className="rounded-t-lg w-full h-32 object-cover"
          src="https://i0.wp.com/guitarandlace.com/wp-content/uploads/2024/02/Google-Classroom-free-blue-app-icons.jpg?ssl=1"
          alt="Class Image"
        />
      </a>
      <div className="p-3">
        <a href="#">
          <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900">
            {title}
          </h5>
          <h3 className="mb-2 text-lg font-bold tracking-tight text-cyan-700">
            {classcode}
          </h3>
        </a>
        <p className="mb-3 text-sm text-gray-700">{description}</p>
        <Link
          onClick={classroomdirect}
          className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
          Open
          <svg
            className="rtl:rotate-180 w-3 h-3 ms-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
