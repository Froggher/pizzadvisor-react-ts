import usePlacesAutocomplete from "use-places-autocomplete";
import Combobox from "react-widgets/Combobox";

type PlacesProps = {
    setOffice: (position: google.maps.LatLngLiteral) => void;
};


export default function Places({ setOffice }: PlacesProps) {
    const {
        ready,//Pronto per essere usato?
        value,//Valore che l'utente immette
        setValue,//Cambio valore che immette l'utente
        suggestions: { status, data },//Lo status se viene ricevuto o no qualche dato e infine i dati dei suggerimenti
        clearSuggestions,//Quando viene selezionato uno gli altri vanno via
    } = usePlacesAutocomplete();

    return (
        <div>
            <Combobox
                value={value}
                onChange={(value) => setValue(value)}
                className="combobox-input"
                placeholder="Inserisci indirizzo"
                disabled={ready}
                onSelect={() => { }}/>
            
        </div>
    )


}

