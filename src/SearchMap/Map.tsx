import { useMemo, useRef, useCallback, useState } from "react";
import { GoogleMap, InfoWindowF, MarkerF } from "@react-google-maps/api";

import "./SearchMap.css";
import Places from "./component/Places";
import MyPosition from "./component/MyPosition";
import { useQuery } from "@tanstack/react-query";
import { BackEnd, GetFun } from "../misc/Http";
import { Link } from "react-router-dom";
import PlaceData from "../DetailedPlace/component/PlaceData";

import './SearchMap.css';


// /ttps://github.com/evolaric/rgm-example/blob/fd5ee514a6213c5df49d532de0d3892e4409886e/src/InfoWindowComponent.js
// https://codesandbox.io/s/react-google-mapsapi-multiple-markers-infowindow-h6vlq?file=/src/Map.js

/* By using a ref, you ensure that:

    You can store information between re-renders (unlike regular variables, which reset on every render).
    Changing it does not trigger a re-render (unlike state variables, which trigger a re-render).
    The information is local to each copy of your component (unlike the variables outside, which are shared).
*/

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOption = google.maps.MapOptions;

type MapProps = {
    position: LatLngLiteral;
};



export default function Map({ position }: MapProps) {


    // Salviamo la posizione in LatLng del posto che stiamo visualizzando
    const [placePosition, setPlacePosition] = useState<LatLngLiteral>();
    // Salviamo il place_id del posto selezionato (utile per far funzionare altri componenti)
    const [placeId, setPlaceId] = useState<string>();
    // Utile per capire il marker é stato selezionato dall'utente
    const [activeMarker, setActiveMarker] = useState<boolean>(false);
    // Una sorta di variabile immutabile
    const mapRef = useRef<GoogleMap>();

    // Query che restituisce i luoghi giá salvati dal DataBase
    const { data, isSuccess, isError, isLoading } = useQuery<BackEnd>(['places'], () => GetFun(`/places`));


    // Qui passiamo il props ricevuto dal componente SearchMap e facciamo in modo che center si aggiorna ogni volta che position cambia
    // useMemo mantiene in memoria la variabile finche il suo dependency array non cambia
    const center = useMemo<LatLngLiteral>(() => (position), [position]);
    const options = useMemo<MapOption>(() => ({
        mapId: "c937efbfd83b24d7",
        disableDefaultUI: true,
        clickIcons: false, //non si possono cliccare icone
        zoomControl: true,
        //restriction: "it"
    }), []);

    //useCallback é simile alla useMemo peró invece di ritornare un value ritorna una funzione memorizzata
    const onLoad = useCallback((map: any) => (mapRef.current = map), []);



    return (
        <div className="container">
            <div className="controls">
                {isLoading && <p>Caricamento luoghi in corso...</p>}
                {isError && <p>Errore caricamento luoghi</p>}

                <MyPosition setUserPosition={(position) => {
                    mapRef.current?.panTo(position);
                }}></MyPosition>

                <h2>Ristoranti e pizzerie</h2>
                <Places setRestaurant={(position) => {
                    setPlacePosition(position);
                    mapRef.current?.panTo(position);
                    setActiveMarker(true);
                }}
                    placeInfo={(a) => { setPlaceId(a) }}

                ></Places>
            </div>

            <div className="map">
                <GoogleMap
                    zoom={10}
                    center={center}
                    mapContainerClassName="map-container"
                    options={options}
                    onLoad={onLoad}
                    clickableIcons={false}
                >
                    {placePosition &&
                    // Qui viene descritto quello che succede quando si seleziona cliccando un marker 
                        <>
                            <MarkerF position={placePosition} visible={true} onClick={() => setActiveMarker(true)}>
                                {/* Serve per chiudere e riaprire la schermata di InfoWindowF */}
                                {activeMarker &&
                                    <InfoWindowF position={placePosition} options={{ maxWidth: 320 }} onCloseClick={() => { setActiveMarker(false); setPlacePosition(undefined) }}>
                                        {placeId ?
                                            <div>
                                                <PlaceData place_id={placeId} />
                                                <Link to={`/detailedplace/${placeId}`} className="link-detail">Ulteriori dettagli</Link>
                                            </div> : null}
                                    </InfoWindowF>
                                }
                            </MarkerF>
                            {/* <Circle center={office} radius={7000} /> */}
                        </>
                    }

                    {/* Qui i marker vengono disposti sulla mappa tramite un map */}
                    {((isSuccess && Array.isArray(data.place)) && data.place) &&
                        data.place.map((place: any, index: number) => (
                            <MarkerF key={index} position={{ lat: place.lat, lng: place.lng }} visible={true} 
                                onClick={() => { setActiveMarker(true); setPlacePosition({ lat: place.lat, lng: place.lng }); setPlaceId(place.place_id); }} />

                        ))}
                </GoogleMap>
            </div>
        </div>
    );
}
