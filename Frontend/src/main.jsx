import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './screens/Home';
import Login from './screens/Login';
import Register from './screens/Register';
import Teacherdashboard from './screens/Teacherdashboard';
import Studentdashboard from './screens/Studentdashboard';

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
    path: "/student/dashboard/",
    element: <Studentdashboard/>,
  },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
