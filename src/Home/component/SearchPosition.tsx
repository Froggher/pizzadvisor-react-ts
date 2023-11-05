import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { useState } from 'react';
import '../Home.css'


type PlacesProps = {
    // SetRestaraunt é un parametro perche quando gli passiamo il valore é { lat: 51.522993, lng: -0.1189555 }
    setPosition: (position: google.maps.LatLngLiteral) => void;
    
};


export default function SearchPosition({ setPosition }: PlacesProps) {
    // Serve per salvare il suggerimento ottentuto dalla use complete
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
        <div className="input-container">
          <input
            type="text"
            disabled={!ready}
            placeholder="Inserisci indirizzo"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setIsSelected(false);
            }}
            className="input-text"
          />
          {!isSelected && (
            <ul className="suggestion-list">
              {data.map((e) => (
                <li
                  key={e.place_id}
                  onClick={() => handleSelect(e.description)}
                  className="suggestion-item"
                >
                  {e.description}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    };




