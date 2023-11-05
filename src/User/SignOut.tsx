import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";


export default function SignOut() {
    /* Chiamao l'hook dei cookies */
    const [cookies, , removeCookie] = useCookies(["user"]);
    
    /* Se l'utente é autenticato visulizzerá questi contenuti */
    if (cookies.user) {
        return (
            <>
                <h2>Vuoi effettuare il Logout {cookies.user.first_name}?</h2>
                <input type="submit" value="LogOut" onClick={() => removeCookie("user")} />
            </>
        )
    /* Se l'utente non é autenticato visulizzerá questi contenuti */
    } else {
        return (
            <>
                <h2>Logout effettuato...</h2>
                <Link to="/signin">Esegui il login nuovamente</Link>

            </>
        )

    }
}