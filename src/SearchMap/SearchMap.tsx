import Map from "./Map";
import { useLocation } from "react-router-dom";




export default function SearchMap() {

  /* Prendiamo i props che vengono da useNavigate */
  const location = useLocation();
  const propsRicevute: google.maps.LatLngLiteral = location.state;

  
  /* Valore di default per la posizione iniziale */
  if (!propsRicevute) {
    return (
      <div>
        {/* Il valore di default corrisponde a Perugia */}
        <Map position={{ lat: 43, lng: 12.3 }} />
      </div>
    );
  }
  return (
    <div>
      <Map position={propsRicevute} />
    </div>
  );
}


