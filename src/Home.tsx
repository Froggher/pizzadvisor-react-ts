import { Libraries, useLoadScript } from "@react-google-maps/api";
import Map from "./map";


const libraries: Libraries = ['places']
export default function Home() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API,
    libraries: libraries,
  });

  if (!isLoaded) return <div>Caricamento mappa...</div>;
  return <Map />;
}


