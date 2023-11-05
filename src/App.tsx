import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import NavBar from "./misc/NavBar";
import ErrorPage from "./ErrorPage/ErrorPage";
import SearchMap from "./SearchMap/SearchMap";
import TestDatabase from "./TestDatabase/TestDatabase";
import SignUp from "./User/SignUp";
import About from "./About/About";
import SignIn from "./User/SignIn";
import DetailedPlace from "./DetailedPlace/DetailedPlace";
import Home from "./Home/Home";
import { Libraries, useLoadScript } from "@react-google-maps/api";
import SignOut from "./User/SignOut";


const libraries: Libraries = ['places']

/* Qui vengono subito caricati i dati dell'api per la gestione delle mappe e autocomplete */
function App() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API,
    libraries: libraries,
    //language: "IT",
  });

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
        {
          path: "home",
          element: <Home />,
        },
        {
          path: "signout",
          element: <SignOut />,
        },
        {
          path: "detailedplace/:place_id",
          element: <DetailedPlace />,
        },
      ],
    },
  ]);
/* Diamo il tempo mostrando il caricamento delle librerie api */
  if (!isLoaded) return <div>Caricamento librerie api...</div>;
  return (
    <>
      <CookiesProvider>
        <RouterProvider router={router} />
      </CookiesProvider>
    </>
  )
}

export default App
