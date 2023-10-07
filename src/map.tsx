import { useMemo, useRef, useCallback, useState } from "react";
import { Circle, GoogleMap, Marker } from "@react-google-maps/api";

import "./home.css";
import Places from "./places";

/* By using a ref, you ensure that:

    You can store information between re-renders (unlike regular variables, which reset on every render).
    Changing it does not trigger a re-render (unlike state variables, which trigger a re-render).
    The information is local to each copy of your component (unlike the variables outside, which are shared).
*/

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOption = google.maps.MapOptions;

export default function Map() {
    const [office, setOffice] = useState<LatLngLiteral>();
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
                            <Marker position={office} /*icon="https://s3.gsxtr.com/i/p/marker-grog-cutter-15-xfp-29824-480-1.jpg"*/ />
                            <Circle center={office} radius={7000} />
                        </>
                    }
                </GoogleMap>
            </div>
        </div>
    );
}