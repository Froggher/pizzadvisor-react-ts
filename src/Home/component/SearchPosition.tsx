import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { useState } from 'react';
//import Combobox from "react-widgets/Combobox";


type PlacesProps = {
    // SetRestaraunt é un parametro perche quando gli passiamo il valore é { lat: 51.522993, lng: -0.1189555 }
    setPosition: (position: google.maps.LatLngLiteral) => void;
    // PlaceName é sempre un parametro ma perché gli passiamo val che é il parametro della funzione handleSelect


};


export default function SearchPosition({ setPosition }: PlacesProps) {

    const [isSelected, setIsSelected] = useState<boolean>(false);

    /* Questi sono i dati suggeriti che vengono presi da usePlacesAutocomplete */
    const {
        ready,//Pronto per essere usato?
        value,//Valore che l'utente immette
        setValue,//Cambio valore che immette l'utente
        suggestions: { data },//Lo status se viene ricevuto o no qualche dato e infine i dati dei suggerimenti
        clearSuggestions,//Quando viene selezionato uno gli altri vanno via
    } = usePlacesAutocomplete();


    /* Restituisce le cordinate dei posti selezionati */
    const handleSelect = async (val: string) => {

        // nome Localitá selezionata
        clearSuggestions();
        //Qui prendo i valori che vengono passati quando si seleziona un suggerimento
        const results = await getGeocode({ address: val });
        const { lat, lng } = getLatLng(results[0]);
        setValue(val);
        setPosition({ lat, lng });
        setIsSelected(true);
    }


    return (
        /* Qui é necessario cambiare la libreria per questo combobox */
        <div>

            <input
                type="text"
                disabled={!ready}
                placeholder="Inserisci indirizzo"
                value={value}
                onChange={(e) => {setValue(e.target.value);
                setIsSelected(false);}}
            />
            {!isSelected &&
            <ul>
                {
                    data.map(e => (
                        <li
                            key={e.place_id}
                            onClick={() => handleSelect(e.description)}

                        >
                            {e.description}
                        </li>
                    ))
                }
            </ul>
            }
        </div>
    )


}

