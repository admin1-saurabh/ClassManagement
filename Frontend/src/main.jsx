import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './screens/Home';
import Login from './screens/Login';
import Register from './screens/Register';
import Teacherdashboard from './screens/Teacherdashboard';
import Studentdashboard from './screens/Studentdashboard';
import ClassroomDashboard from './screens/Classroomdashboard';
import TestView from './screens/TestView';
import StudentsView from './screens/StudentsView';
import ClassroomDashboardStudent from './screens/ClassroomDashboardStudent';
import TestViewStudent from './screens/TestViewStudent';

import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";

import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/home/" />
  },
  {
    path: "/home/",
    element: <Home/>,
  },
  {
    path: "/login/",
    element: <Login/>,
  },
  {
    path: "/register/",
    element: <Register/>,
  },
  {
    path: "/teacher/dashboard/",
    element: <Teacherdashboard/>,
  },
  {
    path: "/teacher/classroom/",
    element: <ClassroomDashboard/>,
  },
  {
    path: "/student/classroom/",
    element: <ClassroomDashboardStudent/>,
  },
  {
    path: "/teacher/classroom/test/",
    element: <TestView/>,
  },
  {
    path: "/student/classroom/test/",
    element: <TestViewStudent/>,
  },
  {
    path: "/teacher/classroom/students/",
    element: <StudentsView/>,
  },
  {
    path: "/student/dashboard/",
    element: <Studentdashboard/>,
  },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
