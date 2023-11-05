import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { BackEnd, GetFun } from "../misc/Http";
import Follow from "../DetailedPlace/component/follow";
import SearchPosition from "./component/SearchPosition";
import './Home.css'


//https://tkdodo.eu/blog/react-query-and-type-script

export default function Home() {
    // Utile per salvare i dati da mandare successivamente al componente Map
    const [placePosition, setPlacePosition] = useState<google.maps.LatLngLiteral>();

    const [cookies] = useCookies<'user', BackEnd>(["user"]);

    // Questa query mostrerá tutti i follows dell'utente utilizzando il token
    const { data, error, isLoading, isSuccess, isStale } = useQuery<BackEnd>(['showfollows'],
        () => GetFun('/follow/get', cookies.user?.token),
        {
            enabled: cookies.user?.token !== undefined,
        });


    /* Ho dovuto mettere isStale perché anche se c'é enabled rimane in stato di caricamento */
    if (isLoading && !(isStale)) {
        return <h2>Caricamento in corso...</h2>
    }

    if ((error) instanceof Error) {
        return <div>An error occurred: {error.message}</div>
    }

    /* Visualizzato se l'utente ha salvato qualche follow ed ha effettuato l'atenticazione*/
    if (isSuccess && data.is_present && data.place) {
        // Dato che map accetta solo array di oggetti 
        const followed_place = Array.isArray(data.place) ? data.place : Object.values(data.place);
        console.log(followed_place)
        return (
            <div className="left">
                <h1>PizzAdvisor</h1>
                <SearchPosition setPosition={(a) => { setPlacePosition(a) }} />
                <Link className="button-link" to="/map" state={placePosition}>Cerca su Map</Link>
                <div className="followed-places">
                    {followed_place.map((map, index) => (
                        <div key={index} className="followed-place">
                            <h2>{map.only_name}</h2>
                            <h3>{map.formatted_address}</h3>
                            <Follow place_id={map.place_id} />
                            <Link to={`/detailedplace/${map.place_id}`} className="detail-link">Ulteriori dettagli</Link>
                        </div>
                    ))}
                </div>
            </div>
        )
    }


    return (
        <div className="left">
            <h1>PizzAdvisor</h1>
            <SearchPosition setPosition={(a) => { setPlacePosition(a) }} />
            <Link className="button-link" to="/map" state={placePosition}>Cerca su Map</Link>
            <h2>Non hai nessun ristorante preferito</h2>
            {!cookies.user?.token && <Link className="website-link" to={`/signin`}>Effettua login per salvare i preferiti</Link>}
        </div>
    )


}