import { useCookies } from "react-cookie";
import { useRouteError } from "react-router-dom";


export default function ErrorPage() {
    
    const [, , removeCookie] = useCookies(["user"]);

    /* Utilizzo di typeguard per gestire l'elemento unknown */
    interface ErrorMessage {
        statusText: string;
        status: number;
    }
    /* Viene eseguito un controllo del type per verificare di non ritrovarci variabili undefined */
    function isErrorMessage(obj: unknown): obj is ErrorMessage {
        return (
            typeof obj === 'object' && obj !== null && 'statusText' in obj && 'status' in obj
        );
    }


    const error: unknown = useRouteError();

    if (isErrorMessage(error)) {
        console.log(isErrorMessage(error))
        return (
            <div id="error-page">
                <h1>Oops! Errore: {error.status}</h1>
                <p>Sorry, an unexpected error has occurred.</p>
                <p>
                    <i>{error.statusText}</i>
                </p>
            </div>
        );
    } else {

        return (
            <>
                <h2>Errore generico...</h2>
                <input type="submit" value="LogOut" onClick={() => removeCookie("user")} />
            </>
        )
    }




}