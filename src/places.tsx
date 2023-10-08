import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import Combobox from "react-widgets/Combobox";

type PlacesProps = {
    setOffice: (position: google.maps.LatLngLiteral) => void;
};


export default function Places({ setOffice }: PlacesProps) {

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
        console.log(value)
        setValue(val, false);
        clearSuggestions();
        //Qui prendo i valori che vengono passati quando si seleziona un suggerimento
        const results = await getGeocode({ address: val });
        console.log(results[0])
        const { lat, lng } = getLatLng(results[0])
        setOffice({ lat, lng })

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

