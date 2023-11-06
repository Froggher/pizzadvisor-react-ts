import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getDetails } from "use-places-autocomplete";
import { BackEnd, PostPatch } from "../../misc/Http";


type UpdateDetailsProps = {
    place_id: string;
};


export default function UpdateDetails({ place_id }: UpdateDetailsProps) {

  

    // Richiamo il context della use querry
    const queryClient = useQueryClient();

    // Effettua l'aggiornamento dei dati del place
    const patchPlaceMutation = useMutation<BackEnd, unknown, object>({
        mutationFn: (placeDetails) => PostPatch(`/place/patch`, placeDetails),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['places'] });
            queryClient.invalidateQueries({ queryKey: ['detailedplace'] });
        },
    });



    /* Si occupa di gestire un luogo selezionato */
    const handleSelect = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        try {
            // Aggiorniamo i valori rieffettuando una getDetails
            const detResults = await getDetails({ placeId: place_id })

            console.log(detResults)
            if (typeof detResults !== 'string' && detResults.name && detResults.vicinity) {

                // Qui creiamo la stringa per generare il nome intero
                const full_name = detResults.name.concat(", ", detResults.vicinity);

                console.log(detResults.geometry?.location?.lat())
                const placeDetails = {
                    place_id: detResults.place_id,
                    full_name: full_name,
                    lat: detResults.geometry?.location?.lat(),
                    lng: detResults.geometry?.location?.lng(),
                    only_name: detResults.name,
                    formatted_address: detResults.formatted_address,
                    opening_hours: detResults.opening_hours?.weekday_text,
                    formatted_phone_number: detResults.formatted_phone_number,
                    website: detResults.website,
                    price_level: detResults.price_level,
                    google_rating: detResults.rating,
                };
                // La mutate per salvare i nuovi dettagli del place
                patchPlaceMutation.mutate(placeDetails);
            }


        } catch (error) {
            console.log(error);

        }

    }


    return (
                <form onSubmit={handleSelect}>
                    <button>
                        Aggiorna informazioni
                    </button>
                    {patchPlaceMutation.isSuccess && <h3>L'aggiornamento ha avuto successo</h3>}
                    {patchPlaceMutation.isLoading && <h3>Aggiornamento in corso</h3>}
                    {patchPlaceMutation.isError && <h3>L'aggiornamento ha avuto un errore</h3>}
                </form>
    )


}

