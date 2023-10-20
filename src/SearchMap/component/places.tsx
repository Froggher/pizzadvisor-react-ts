import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
//import Combobox from "react-widgets/Combobox";

type PlacesProps = {
    // SetRestaraunt é un parametro perche quando gli passiamo il valore é { lat: 51.522993, lng: -0.1189555 }
    setRestaurant: (position: google.maps.LatLngLiteral) => void;
    // PlaceName é sempre un parametro ma perché gli passiamo val che é il parametro della funzione handleSelect
    placeName: ( name: string ) => void;
    // plceInfo stesso discorso di setRestaurant, é un oggetto complesso
    placeInfo: ( info: google.maps.GeocoderResult ) => void;
};


export default function Places({ setRestaurant: setRestaurant, placeName, placeInfo}: PlacesProps) {

    /* Questi sono i dati suggeriti che vengono presi da usePlacesAutocomplete */
    const {
        ready,//Pronto per essere usato?
        value,//Valore che l'utente immette
        setValue,//Cambio valore che immette l'utente
        suggestions: { status, data },//Lo status se viene ricevuto o no qualche dato e infine i dati dei suggerimenti
        clearSuggestions,//Quando viene selezionato uno gli altri vanno via
    } = usePlacesAutocomplete();

    console.log({ status, data })
    //console.log(typeof data)

    /* Restituisce le cordinate dei posti selezionati */
    const handleSelect = async (val: string) => {
        console.log(value);
        setValue(val, false);
        // nome Localitá selezionata
        console.log(val);
        clearSuggestions();
        //Qui prendo i valori che vengono passati quando si seleziona un suggerimento
        const results = await getGeocode({ address: val });
        // Codice globale che verrá usato come id nel db
        console.log(results[0].plus_code?.global_code);
        console.log(results[0]);
        const { lat, lng } = getLatLng(results[0]);
        console.log(getLatLng(results[0]));
        placeName(val);
        // placeCode(results[0].plus_code?.global_code)
        placeInfo(results[0])
        setRestaurant({ lat, lng });

    }
    console.log(data.map(e => (e.description)))
    return (
        /* Qui é necessario cambiare la libreria per questo combobox */
        <div>

            {/* <Combobox
                value={value}
                onChange={(value) => setValue(value)}
                className="combobox-input"
                placeholder="Inserisci indirizzo"
                disabled={!ready}
                data={data.map(e => (e.description))}
                onSelect={handleSelect} /> */}

            <input type="text"
                disabled={!ready}
                className="combobox-input"
                placeholder="Inserisci indirizzo"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <ul>
                {
                    data.map(e => (
                        <li key={e.place_id} onClick={() => handleSelect(e.description)}>{e.description}</li>))
                }
            </ul>
        </div>
    )


}

