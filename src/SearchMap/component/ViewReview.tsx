import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BackEnd, DeleteFun, GetFun } from "../../misc/Http";
import { useCookies } from "react-cookie";

type ViewReviewProps = {
  place_id: string;
};

export default function ViewReview({ place_id }: ViewReviewProps) {
  const [cookies] = useCookies<'user', BackEnd>(["user"]);
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<BackEnd>(['review', place_id], () => GetFun(`/review/get/${place_id}`));


  interface DelReview {
    review_id: string
  }

  const deleteReviewMutation = useMutation<BackEnd, unknown, DelReview>({
    mutationFn: (form) => DeleteFun('/review/delete', cookies.user?.token, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review'] });
    }
  });

  const handleDeleteReview = (review_id: string, e: React.SyntheticEvent) => {
    e.preventDefault();
    const body = { review_id: review_id }
    deleteReviewMutation.mutate(body);
  }

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
            <p>Review_id: {review.review_id}</p>
            <p>Data di creazione: {new Date(review.created).toLocaleString()}</p>
            {cookies.user?.is_mod ?
              <input type="submit" value="Rimuovi recensione" 
              onClick={(e) => handleDeleteReview(review.review_id, e)} disabled={deleteReviewMutation.isLoading}/> : null}
            {(deleteReviewMutation.error) instanceof Error && <p>{deleteReviewMutation.error.message}</p>}
          </div>
        ))}
      </div>
    );
  }

  return <div>Nessuna recensione trovata per questo posto.</div>;
}
