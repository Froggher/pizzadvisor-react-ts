import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BackEnd, DeleteFun, GetFun } from "../../misc/Http";
import { useCookies } from "react-cookie";

import './review.css'

type ViewReviewProps = {
  place_id: string;
};

export default function ViewReview({ place_id }: ViewReviewProps) {
  const [cookies] = useCookies<'user', BackEnd>(["user"]);
  const queryClient = useQueryClient();

  // Query per la visualizzazione delle recensioni relative al luogo dato da place_id
  const { data, error, isLoading } = useQuery<BackEnd>(['review', place_id], () => GetFun(`/review/get/${place_id}`));

  // Type dei dati che vengono inviati per effettuare il delete della review
  interface DelReview {
    review_id: string
  }

  const deleteReviewMutation = useMutation<BackEnd, unknown, DelReview>({
    mutationFn: (form) => DeleteFun('/review/delete', cookies.user?.token, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review'] });
    }
  });

  // Quando si seleziona di eliminare la review
  const handleDeleteReview = (review_id: string, e: React.SyntheticEvent) => {
    e.preventDefault();
    deleteReviewMutation.mutate({ review_id: review_id });
  }

  if (isLoading) {
    return <h2>Caricamento review in corso...</h2>
  }

  if ((error) instanceof Error) {

    return <div>An error occurred: {error.message} ErrorName: {error.name}</div>

  }

  // Se ci sono delle review vengono mostrate qui
  if (data && data.review) {
    // Serve per controllare se i dati arrivano sottoforma di array o di oggetto singolo
    // Questo serve perché map si puó usare solo con gli array
    // values: Returns an array of values of the enumerable properties of an object
    const reviews = Array.isArray(data.review) ? data.review : Object.values(data.review);
    return (
      <div className="review-list">
        <h2>Recensioni:</h2>
        {reviews.map((review, index) => (
          <div key={index} className="review-item">
            <h3>Recensione #{index + 1}</h3>
            <p>{review.first_name} {review.last_name}</p>
            <p><textarea className="fixed-textarea" readOnly>{review.review_object}</textarea></p>
            <p><textarea className="fixed-textarea" readOnly>{review.review_body}</textarea></p>
            <p>Review_id: {review.review_id}</p>
            <p>Data di creazione: {new Date(review.created).toLocaleString()}</p>
            {/* Se l'utente è moderatore può rimuovere la review */}
            {cookies.user?.is_mod ? (
              <input
                type="submit"
                value="Rimuovi recensione"
                onClick={(e) => handleDeleteReview(review.review_id, e)}
                disabled={deleteReviewMutation.isLoading}
                className="delete-button"
              />
            ) : null}
            {(deleteReviewMutation.error) instanceof Error && <p>{deleteReviewMutation.error.message}</p>}
          </div>
        ))}
      </div>
    );
            }
  return <div>Nessuna recensione trovata per questo posto.</div>;
}
