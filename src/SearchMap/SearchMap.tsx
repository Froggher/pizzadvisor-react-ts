import { Libraries, useLoadScript } from "@react-google-maps/api";
import Map from "./component/map";


const libraries: Libraries = ['places']
export default function SearchMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API,
    libraries: libraries,
    //language: "IT",
  });

  if (!isLoaded) return <div>Caricamento mappa...</div>;
  return <Map />;
}


