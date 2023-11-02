import { NavLink, NavigateFunction, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
// import Cookies from "js-cookie";
import { useCookies } from "react-cookie";
import { BackEnd } from "./Http";

import './misc.css'

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
        <nav className="NavBar">
          <div>
            <NavLink to="map" id="site-title">PizzAdvisor</NavLink>
          </div>
          <div >
            <NavLink to="map" >Map</NavLink>
            <NavLink to="testdatabase">Testdata</NavLink>
            <NavLink to="about">About</NavLink>
            <NavLink to="signin">SignIn</NavLink>
            <NavLink to="signup">SignUp</NavLink>
            <NavLink to="signup">{cookies.user?.first_name}</NavLink>
          </div>
        </nav>
      </header>
      <div>
        <Outlet />
      </div>
    </div>
  )
}
