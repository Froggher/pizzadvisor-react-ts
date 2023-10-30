import { useMemo, useRef, useCallback, useState } from "react";
import { GoogleMap, InfoWindowF, MarkerF } from "@react-google-maps/api";

import { FaAnchor } from "react-icons/fa";
import "../SearchMap.css";
import Places from "./places";
import SendReview from "./sendReview";
import ViewReview from "./ViewReview";
import Locate from "./locate";
import { useQuery } from "@tanstack/react-query";
import { BackEnd, GetFun } from "../../misc/Http";

// /ttps://github.com/evolaric/rgm-example/blob/fd5ee514a6213c5df49d532de0d3892e4409886e/src/InfoWindowComponent.js
// Ispirazione per le infobox
// https://codesandbox.io/s/react-google-mapsapi-multiple-markers-infowindow-h6vlq?file=/src/Map.js

/* By using a ref, you ensure that:

    You can store information between re-renders (unlike regular variables, which reset on every render).
    Changing it does not trigger a re-render (unlike state variables, which trigger a re-render).
    The information is local to each copy of your component (unlike the variables outside, which are shared).
*/

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOption = google.maps.MapOptions;
//type PlaceInfo = google.maps.GeocoderResult;


export default function Map() {
    const [place, setPlace] = useState<LatLngLiteral>();
    const [placeId, setPlaceId] = useState<string>();
    const [name, setName] = useState<string>();


    const [activeMarker, setActiveMarker] = useState<boolean>(false);
    const mapRef = useRef<GoogleMap>();

    const { data, isSuccess, isError, isLoading } = useQuery<BackEnd>(['places'], () => GetFun(`/places`));


    //Effettua il calcolo di center con dependency array di []
    const center = useMemo<LatLngLiteral>(() => ({ lat: 43, lng: 12.3 }), []);
    const options = useMemo<MapOption>(() => ({
        mapId: "c937efbfd83b24d7",
        disableDefaultUI: true,
        clickIcons: false, //non si possono cliccare icone
        zoomControl: true,
        //restriction: "it"
    }), []);

    //useCallback é simile alla useMemo peró invece di ritornare un value ritorna una funzione
    const onLoad = useCallback((map: any) => (mapRef.current = map), []);


    return (
        <div className="container">
            <div className="controls">
                {isLoading && <p>Caricamento luoghi in corso...</p>}
                {isError && <p>Errore caricamento luoghi</p>}
                <Locate setUserPosition={(position) => {
                    mapRef.current?.panTo(position)
                }}></Locate>
                <h2>Commute</h2>
                <Places setRestaurant={(position) => {
                    setPlace(position);
                    mapRef.current?.panTo(position)
                }}
                    placeInfo={(a) => { setPlaceId(a.place_id) }}
                    placeName={(b) => { setName(b) }}
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
                    {place &&
                        <>
                            <MarkerF position={place} visible={true} key={'owo'} onClick={() => setActiveMarker(true)}>
                                {/* Serve per chiudere e riaprire la schermata di InfoWindowF */}
                                {activeMarker &&
                                    <InfoWindowF position={place} options={{ maxWidth: 320 }} onCloseClick={() => { setActiveMarker(false); setPlace(undefined) }}>
                                        <div>
                                            <FaAnchor />
                                            <h3>InfoWindow</h3>

                                            {placeId && name ?
                                                <div>
                                                    <ViewReview place_id={placeId} />
                                                    <SendReview place_id={placeId} placeName={name} placePosition={place} />
                                                </div> : null}

                                        </div>
                                    </InfoWindowF>
                                }
                            </MarkerF>
                            {/* <Circle center={office} radius={7000} /> */}
                        </>
                    }



                    {(isSuccess && Array.isArray(data.place)) &&
                        data.place.map((place, index) => (
                            <div key={index}>
                                <MarkerF position={{ lat: place.lat, lng: place.lng }} visible={true}
                                    onClick={() => { setActiveMarker(true); setPlace({ lat: place.lat, lng: place.lng }); setName(place.full_name); setPlaceId(place.place_id);}} />
                            </div>
                        ))}

                </GoogleMap>
            </div>
        </div>
    );
}
