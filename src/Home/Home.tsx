import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { BackEnd, GetFun } from "../misc/Http";
import Follow from "../DetailedPlace/component/follow";
import SearchPosition from "./component/SearchPosition";



//https://tkdodo.eu/blog/react-query-and-type-script

export default function Home() {

    const propsDaPassare = { lat: 43, lng: 42.3 };
    const [placePosition, setPlacePosition] = useState<google.maps.LatLngLiteral>();



    const [cookies] = useCookies<'user', BackEnd>(["user"]);

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


    console.log(data)

    if (isSuccess && data.is_present && data.place) {
        const followed_place = Array.isArray(data.place) ? data.place : Object.values(data.place);
        console.log(followed_place)
        return (
            <>
                {followed_place.map((map, index) => (
                    <div key={index}>

                        <h2>{map.only_name}<Follow place_id={map.place_id} /></h2>
                        <h3>{map.formatted_address}</h3>
                        {/* <h3>{map.lat}</h3>
                        <h3>{map.lng}</h3> */}
                        {/* <h3>{map.place_id}</h3> */}
                        <Link to={`/detailedplace/${map.place_id}`}>Ulteriori dettagli</Link>

                    </div>

                ))}
            </>
        )
    }


    return (
        <>

            <SearchPosition setPosition={(a) => { setPlacePosition(a) }} />

            <Link to="/map" state={placePosition}>Cerca su Map</Link>
            <h2>Non hai nessun ristorante preferito</h2>
            {!cookies.user?.token && <Link className="website-link" to={`/signin`}>Effettua login per salvare i preferiti</Link>}
        </>
    )


}