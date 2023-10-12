import { NavLink, NavigateFunction, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";


export default function NavBar() {
  /* Andrebbe messo un typeguard */
  const navigate: NavigateFunction = useNavigate();
  let location = useLocation();
  
  /* Serve per riportare l'utente sulla home page in caso andasse sulla root */
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('app');
    }
  }, [location]);


  return (
    <div>
      <header>
        <nav>
          <NavLink to="app">Home</NavLink>
          <br></br>
          <NavLink to="app">App</NavLink>
          <br></br>
          <NavLink to="about">About</NavLink>
          <br></br>
          <NavLink to="testdatabase">Testdata</NavLink>
          <br></br>
        </nav>
      </header>
      <div>
        <Outlet />
      </div>

    </div>
  )
}
