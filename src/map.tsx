import { useMemo, useRef, useCallback, useState } from "react";
import { Circle, GoogleMap, InfoWindow, InfoWindowF, Marker, MarkerF } from "@react-google-maps/api";

import { FaAnchor } from "react-icons/fa";
import "./home.css";
import Places from "./places";


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

export default function Map() {
    const [office, setOffice] = useState<LatLngLiteral>();
    const [activeMarker, setActiveMarker] = useState<String>('');
    const mapRef = useRef<GoogleMap>();

    //Effettua il calcolo di center con dependency array di []
    const center = useMemo<LatLngLiteral>(() => ({ lat: 43, lng: 12.3 }), []);
    const options = useMemo<MapOption>(() => ({
        mapId: "c937efbfd83b24d7",
        disableDefaultUI: true,
        clickIcons: false, //non si possono cliccare icone
        //restriction: "it"
    }), []);

    //useCallback é simile alla useMemo peró invece di ritornare un value ritorna una funzione
    const onLoad = useCallback((map: any) => (mapRef.current = map), []);


    return (
        <div className="container">
            <div className="controls">
                <h2>Commute</h2>
                <Places setOffice={(position) => {
                    setOffice(position);
                    mapRef.current?.panTo(position);
                }}></Places>
            </div>

            <div className="map">
                <GoogleMap
                    zoom={10}
                    center={center}
                    mapContainerClassName="map-container"
                    options={options}
                    onLoad={onLoad}>
                    {office &&
                        <>
                            <MarkerF position={office} visible={true} key={'owo'}>
                                <InfoWindowF position={office} options={{ maxWidth: 320 }}>
                                    <div>
                                        <FaAnchor />
                                        <h3>InfoWindow</h3>
                                        <p>
                                            A tree needs to be your friend if you're going to paint him. The only
                                            prerequisite is that it makes you happy. If it makes you happy then
                                            it's good. I thought today we would do a happy little picture. This
                                            present moment is perfect simply due to the fact you're experiencing
                                            it. Work on one thing at a time. Don't get carried away - we have
                                            plenty of time. I really believe that if you practice enough you could
                                            paint the 'Mona Lisa' with a two-inch brush.
                                        </p>
                                    </div>
                                </InfoWindowF>

                            </MarkerF>

                            {/* <Circle center={office} radius={7000} /> */}
                        </>
                    }
                </GoogleMap>
            </div>
        </div>
    );
}

