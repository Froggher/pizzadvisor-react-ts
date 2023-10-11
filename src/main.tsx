import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './ErrorPage/ErrorPage.tsx';
import NavBar from './misc/NavBar.tsx';
import About from './About/About.tsx';
//import './index.css'






const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "app",
        element: <App />,
      },
      {
        path: "about",
        element: <About />,
      },
    ],
  },
]);





ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
