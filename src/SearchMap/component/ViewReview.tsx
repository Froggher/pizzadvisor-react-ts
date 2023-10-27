import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BackEnd, GetFun } from "../../misc/Http";

type ViewReviewProps = {
    place_id: string;
  };

export default function ViewReview({ place_id }: ViewReviewProps) {


    const { data, error, isLoading } = useQuery<BackEnd>(['review', place_id], () => GetFun(`/review/get/${place_id}`));


    if (isLoading) {
        return <h2>Caricamento review in corso...</h2>
      }
    
      if ((error) instanceof Error) {
    
        return <div>An error occurred: {error.message} ErrorName: {error.name}</div>
    
      }
    

      if (data && data.review) {
        // Serve per controllare se i dati arrivano sottoforma di array o di oggetto singolo
        // Questo serve perché map si puó usare solo con gli array
        // values: Returns an array of values of the enumerable properties of an object
        const reviews = Array.isArray(data.review) ? data.review : Object.values(data.review);
        return (
          <div>
            <h2>Recensioni:</h2>
            {reviews.map((review, index) => (
              <div key={index}>
                <h3>Recensione #{index + 1}</h3>
                <p>Nome: {review.first_name}</p>
                <p>Cognome: {review.last_name}</p>
                <p>Oggetto: {review.review_object}</p>
                <p>Corpo: {review.review_body}</p>
                <p>Data di creazione: {new Date(review.created).toLocaleString()}</p>
                <p>Modificato: {review.modified ? 'Sì' : 'No'}</p>
              </div>
            ))}
          </div>
        );
      }
    
      return <div>Nessuna recensione trovata per questo posto.</div>;
}
