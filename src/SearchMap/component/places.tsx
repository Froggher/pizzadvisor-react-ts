import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import usePlacesAutocomplete, { getGeocode, getLatLng, getDetails } from "use-places-autocomplete";
import { BackEnd, GetFun, PostFun } from "../../misc/Http";
import { useState } from "react";
//import Combobox from "react-widgets/Combobox";

type PlacesProps = {
    // SetRestaraunt é un parametro perche quando gli passiamo il valore é { lat: 51.522993, lng: -0.1189555 }
    setRestaurant: (position: google.maps.LatLngLiteral) => void;
    // PlaceName é sempre un parametro ma perché gli passiamo val che é il parametro della funzione handleSelect

    placeInfo: (info: string) => void;
};


export default function Places({ setRestaurant, placeInfo }: PlacesProps) {
    const [placeId, setPlaceId] = useState<string>('');
    console.log(placeId)
    const queryClient = useQueryClient();
  
        const { data:check } = useQuery<BackEnd>(['placecheck', placeId], () => GetFun(`/place/check/${placeId}`),
        {
            enabled: placeId !== '',
        });
   



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
    
    
    /* Restituisce le cordinate dei posti selezionati */
    const handleSelect = async (val: string) => {
        
        // nome Localitá selezionata
        
        clearSuggestions();
        //Qui prendo i valori che vengono passati quando si seleziona un suggerimento
        const results = await getGeocode({ address: val });
        setPlaceId(results[0].place_id)
        const { lat, lng } = getLatLng(results[0]);
        
        if (check?.is_present) {
            console.log(check)
            // Evitiamo di effettuare la getDetails e fare meno chiamate api
            const detResults = await getDetails({ placeId: results[0].place_id })
            console.log("check")
            if (typeof detResults !== 'string') {
                console.log(detResults.formatted_address);
                console.log('detResults.opening_hours?.isOpen');
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
                sendPlaceMutation.mutate(placeDetails);
            }
            console.log(detResults)
        }

        placeInfo(results[0].place_id)
        setRestaurant({ lat, lng });

    }




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
                        e.types.includes('restaurant') &&
                        <li key={e.place_id} onClick={() => handleSelect(e.description)}>{e.description}</li>))
                }
            </ul>
        </div>
    )


}

