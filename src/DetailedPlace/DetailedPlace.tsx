import { useParams } from "react-router-dom";
import { BackEnd, GetFun, Weather, getWeatherData, latlng } from "../misc/Http";
import { useQuery } from "@tanstack/react-query";
import ViewReview from "../SearchMap/component/ViewReview";
import SendReview from "../SearchMap/component/sendReview";

export default function DetailedPlace() {
    const { place_id } = useParams();

    const { data, error, isLoading } = useQuery<BackEnd>(['detailedplace', place_id], () => GetFun(`/place/detailed/${place_id}`));



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
    // https://api.open-meteo.com/v1/forecast?latitude=43.2065&longitude=12.0747&current_weather=true&timezone=Europe%2FBerlin
    //https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m

    if (data && data.det_place) {
        // Serve per controllare se i dati arrivano sottoforma di array o di oggetto singolo
        // Questo serve perché map si puó usare solo con gli array
        // values: Returns an array of values of the enumerable properties of an object
        //const reviews = Array.isArray(data.review) ? data.review : Object.values(data.review);
        console.log(JSON.parse(data.det_place.opening_hours))
        const json_data = JSON.parse(data.det_place.opening_hours)
        console.log(weather)
        return (

            <div>
                <div>
                    <p>{data.det_place.full_name}</p>
                    <p>{json_data[1]}</p>
                    <p>{weather?.current.temperature_2m}</p>
                    <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${data.det_place.lat},${data.det_place.lng}
                    &zoom=13&size=600x300&maptype=roadmap&markers=color:red%7Clabel:A%7C${data.det_place.lat},${data.det_place.lng}
                    &key=AIzaSyCn9mYgIlyQnarKoG0GEDUZeL0jxgg_g8Q`} />
                    <ViewReview place_id={data.det_place.place_id} />
                    <SendReview place_id={data.det_place.place_id} />
                </div>
            </div>
        )
    }


}