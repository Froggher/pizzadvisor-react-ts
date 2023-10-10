import { useRouteError } from "react-router-dom";



export default function ErrorPage() {


    /* Utilizzo di typeguard per gestire l'elemento unknown */
    interface ErrorMessage {
        statusText: string;
        status: number;
    }
    function isErrorMessage(obj: unknown): obj is ErrorMessage {
        return (
            typeof obj === 'object' && obj !== null  && 'statusText' in obj && 'status' in obj
        );
    }

    
    //const isErrorMessage = (value: unknown): value is error => !!value && typeof value === 'object' && 'message' in value && typeof (value as Object) === 'string'

    const error: unknown = useRouteError();
    //console.error(error);



    if (isErrorMessage(error)) {
        console.log(isErrorMessage(error))
        return (
            <div id="error-page">
                <h1>Oops! errore {error.status}</h1>
                <p>Sorry, an unexpected error has occurred.</p>
                <p>
                    <i>{error.statusText}</i>
                </p>
            </div>
        );
    } else {
        console.log(error)
        throw new Error('Errore generico')
    }




}