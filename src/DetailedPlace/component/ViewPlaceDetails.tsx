import { useQuery } from "@tanstack/react-query";
import { BackEnd, GetFun, Weather, getWeatherData, latlng } from "../../misc/Http";
import Follow from "./Follow";
import '../DetailedPlace.css'

type ViewPlaceProps = {
    place_id: string;
    more_details?: boolean;
};


export default function ViewPlaceDetails({ place_id, more_details }: ViewPlaceProps) {


    let cost: Array<string> = ["super-economico", 'economico', "moderato", "costoso", "molto costoso"];

    // Query per mostrare tutti i dettagli del luogo (dettagli provenienti dal database)
    const { data, error, isLoading } = useQuery<BackEnd>(['detailedplace', place_id], () => GetFun(`/place/detailed/${place_id}`));


    // Query che si occupa di effettuare una get all'api del meteo
    const { data: weather } = useQuery<Weather>(['weather', { lat: data?.det_place?.lat, lng: data?.det_place?.lng }],
        (key) => {
            const latlng = key.queryKey[1] as latlng; // Estrarre il tipo latlng dall'array
            return getWeatherData(latlng.lat, latlng.lng);
        },
        {
            enabled: data?.det_place !== undefined,
        }
    );


    if (isLoading) {
        return <h2>Caricamento places in corso...</h2>
    }

    if ((error) instanceof Error) {

        return <div>An error occurred: {error.message} ErrorName: {error.name}</div>

    }

    // Se i dati sono arrivati...
    if (data && data.det_place) {
        // Serve per controllare se i dati arrivano sottoforma di array o di oggetto singolo
        // Questo serve perché map si puó usare solo con gli array
        // values: Returns an array of values of the enumerable properties of an object
        const json_open_hours = parseCheck(data.det_place.opening_hours)
        /* Return con piú dettagli del place */
        if (more_details) {
            return (

             
                    <div className="PlaceData">
                        <div className="text-container">
                        <h1>{data.det_place.only_name}</h1>
                        <h2>{data.det_place.formatted_address}</h2>
                        <p>Aggiornata al {new Date(data.det_place.updated_at).toLocaleString()}</p>
                        {data.det_place.price_level ? <p className="price-level">Fascia di prezzo: {cost[data.det_place.price_level]}</p> : <p>Fascia di prezzo: non disponibile</p>}

                        {data.det_place.formatted_phone_number ? <p className="phone-number">Numero di telefono: {data.det_place.formatted_phone_number}</p> :
                            <p>Numero di telefono: non disponibile</p>}

                        {data.det_place.website && <a href={data.det_place.website} target="_blank" rel="noopener noreferrer" className="website-link">
                            {data.det_place.website}
                        </a>}

                        {json_open_hours ? (
                            <div className="opening-hours">
                                <p>Orario:</p>
                                <ul>
                                    {json_open_hours.map((element: string, index: number) => (
                                        <li key={index}>{element}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p>Orario: non disponibile</p>
                        )}

                        {data.det_place.google_rating ? <h3 className="google-rating">Rating di Google: {data.det_place.google_rating}</h3> : <h3>Rating di Google: non disponibile</h3>}
                        <Follow place_id={data.det_place.place_id} />
                        {weather ? <p className="current-temperature">{weather?.current.temperature_2m} Cº</p> : <p>⏳</p>}
                         <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${data.det_place.lat},${data.det_place.lng}
                        &zoom=13&size=600x300&maptype=roadmap&markers=color:red%7Clabel:A%7C${data.det_place.lat},${data.det_place.lng}
                        &key=${import.meta.env.VITE_MAPS_API}`} alt="Mappa del luogo"
                            className="map-image" />
                        </div>

                    </div>
                
            )
            /* Return con meno dettagli del place */
        } else {
            return (

                <div>
                    <h2>{data.det_place.only_name}</h2>
                    <p>{data.det_place.formatted_address}</p>

                    {data.det_place.price_level ? <p>Fascia di prezzo: {cost[data.det_place.price_level]}</p> :
                        <p>Fascia di prezzo: non disponibile</p>}

                    {json_open_hours ? <p>Orario: {json_open_hours[new Date().getDay() - 1]}</p> :
                        <p>Orario non disponibile</p>}

                    {weather ? <p>{weather?.current.temperature_2m} Cº</p> :
                        <p>⏳</p>}

                </div>
            )
        }
    }
}


function parseCheck(auth: string) {
    try {
        return JSON.parse(auth);
    } catch (error) {
        // Gestisci l'errore di parsing, ad esempio mostrando un messaggio di errore

        return null;
    }
}