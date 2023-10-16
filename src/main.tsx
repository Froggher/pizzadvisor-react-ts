import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import App from './App.tsx'
import ErrorPage from './ErrorPage/ErrorPage.tsx';
import NavBar from './misc/NavBar.tsx';
import About from './About/About.tsx';
import TestDatabase from './TestDatabase/TestDatabase.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SearchMap from './SearchMap/SearchMap.tsx';
import Login from './User/Login.tsx';
//import './index.css'


/* Inizializzazione react query */
const queryClient = new QueryClient()

/* Inizializzazione react router */
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
        path: "map",
        element: <SearchMap />,
      },
      {
        path: "testdatabase",
        element: <TestDatabase />,
      },
      {
        path: "user",
        element: <Login />,
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
    <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ReactQueryDevtools position="bottom-right" />
    </QueryClientProvider>
  </React.StrictMode>,
)
