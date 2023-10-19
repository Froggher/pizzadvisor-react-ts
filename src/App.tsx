import { RouterProvider, createBrowserRouter } from "react-router-dom";
import NavBar from "./misc/NavBar";
import ErrorPage from "./ErrorPage/ErrorPage";
import SearchMap from "./SearchMap/SearchMap";
import TestDatabase from "./TestDatabase/TestDatabase";
import SignUp from "./User/SignUp";
import About from "./About/About";
import Login from "./User/Login";


function App() {


/* Inizializzazione react router */
const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    errorElement: <ErrorPage />,
    children: [
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
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "about",
        element: <About />,
      },
    ],
  },
]);


  return (
    <>
      <RouterProvider router={router} />
      <h2>Questa é la homepage</h2>
    </>
  )
}

export default App
