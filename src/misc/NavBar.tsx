import { NavLink, NavigateFunction, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
// import Cookies from "js-cookie";
import { useCookies } from "react-cookie";
import { BackEnd } from "./Http";
export default function NavBar() {
  /* Andrebbe messo un typeguard */
  const navigate: NavigateFunction = useNavigate();
  let location = useLocation();

  /* Serve per riportare l'utente sulla home page in caso andasse sulla root */
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('map');
    }
  }, [location]);
  const [cookies] = useCookies<'user', BackEnd>(["user"]);
  return (
    <div>
      <header>
        <nav>
          <NavLink to="map">Map</NavLink>
          <br></br>
          <NavLink to="about">About</NavLink>
          <br></br>
          <NavLink to="signin">SignIn</NavLink>
          <br></br>
          <NavLink to="signup">SignUp</NavLink>
          <br></br>
          <NavLink to="testdatabase">Testdata</NavLink>
          <br></br>
        </nav>
      </header>
      <div>
        {cookies.user?.first_name}
        <Outlet />
      </div>

    </div>
  )
}
