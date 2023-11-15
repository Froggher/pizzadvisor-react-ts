import { useMutation, useQueryClient } from "@tanstack/react-query";
import usePlacesAutocomplete, { getGeocode, getLatLng, getDetails } from "use-places-autocomplete";
import { BackEnd, PostFun, getCheck } from "../../misc/Http";
//import Combobox from "react-widgets/Combobox";
import '../SearchMap.css'

type PlacesProps = {
    // SetRestaraunt é un parametro perche quando gli passiamo il valore é { lat: 51.522993, lng: -0.1189555 }
    setRestaurant: (position: google.maps.LatLngLiteral) => void;
    placeInfo: (info: string) => void;
};


export default function Places({ setRestaurant, placeInfo }: PlacesProps) {
    // Richiamo il context della use querry
    const queryClient = useQueryClient();

    // In caso viene selezionato un posto non salvato nel database con questa mutation verra aggiunto
    const sendPlaceMutation = useMutation<BackEnd, unknown, object>({
        mutationFn: (placeDetails) => PostFun(`/place/post`, placeDetails),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['places'] });
        },

    });

    /* Questi sono i dati suggeriti che vengono presi da usePlacesAutocomplete */
    const {
        ready,//Pronto per essere usato?
        value,//Valore che l'utente immette
        setValue,//Cambio valore che immette l'utente
        suggestions: { data },//Lo status se viene ricevuto o no qualche dato e infine i dati dei suggerimenti
        clearSuggestions,//Quando viene selezionato uno gli altri vanno via
    } = usePlacesAutocomplete();


    /* Si occupa di gestire un luogo selezionato */
    const handleSelect = async (val: string) => {
        clearSuggestions();
        // Try catch perché ci sono funzioni con promesse
        try {
            // Ottiene dati principali della location
            const results = await getGeocode({ address: val });
            // Otteniamo oggetto contente lat e lng
            const { lat, lng } = getLatLng(results[0]);

            /* Qui mandiamo una semplice fetch al database per capire se il luogo selezionato
            é giá stato salvato o no dal database */
            const fetchCheck = await getCheck(results[0].place_id)

            if (!fetchCheck?.is_present) {
                // Dato che non é salvato otteniamo ulteriori dati del luogo selezionato
                const detResults = await getDetails({ placeId: results[0].place_id })
                if (typeof detResults !== 'string') {
                    const placeDetails = {
                        place_id: detResults.place_id,
                        full_name: val,
                        lat: lat,
                        lng: lng,
                        only_name: detResults.name,
                        formatted_address: detResults.formatted_address,
                        opening_hours: detResults.opening_hours?.weekday_text,
                        formatted_phone_number: detResults.formatted_phone_number,
                        website: detResults.website,
                        price_level: detResults.price_level,
                        google_rating: detResults.rating,
                    };
                    // La mutate per salvare i nuovi dettagli del place
                    sendPlaceMutation.mutate(placeDetails);
                }
            }
            // Effettuiamo il return di due props
            placeInfo(results[0].place_id)
            setRestaurant({ lat, lng });
        } catch (error) {
            console.log(error);

        }

    }


    return (

        <div>

            <input
                type="text"
                disabled={!ready}
                className="combobox-input" // Aggiungi la classe CSS qui
                placeholder="Inserisci indirizzo"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <ul>
                {
                    data.map(e => (
                        e.types.includes('restaurant') &&
                        <li
                            key={e.place_id}
                            onClick={() => handleSelect(e.description)}
                            className="suggestion-item"
                        >
                            {e.description}
                        </li>
                    ))
                }
            </ul>
        </div>
    )


}

