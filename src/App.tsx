import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import NavBar from "./misc/NavBar";
import ErrorPage from "./ErrorPage/ErrorPage";
import SearchMap from "./SearchMap/SearchMap";
import TestDatabase from "./TestDatabase/TestDatabase";
import SignUp from "./User/SignUp";
import About from "./About/About";
import SignIn from "./User/SignIn";


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
          path: "signin",
          element: <SignIn />,
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
      <CookiesProvider>
        <RouterProvider router={router} />
      </CookiesProvider>
      <h2>Questa é la homepage</h2>
    </>
  )
}

export default App
