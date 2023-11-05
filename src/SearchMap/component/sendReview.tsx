import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BackEnd, PostFun } from "../../misc/Http";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

type SendReviewProps = {
  place_id: string;
};

export default function SendReview({ place_id }: SendReviewProps) {
  
  const [cookies] = useCookies<'user', BackEnd>(["user"]);

  const queryClient = useQueryClient();

  // Mutation che manda i dati per postare la nuova review
  const sendReviewMutation = useMutation<BackEnd, unknown, object>({
    mutationFn: (form) => PostFun(`/review/post/${place_id}`, form, cookies.user?.token),
    // Invalidiamo la query delle review in modo da aggiornarle con la nostra nuova recensione
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review'] });
      queryClient.invalidateQueries({ queryKey: ['places'] });
    }
  });


  const handleSubmit = (e: React.SyntheticEvent) => {
    //Evitiamo di far ricaricare la pagina
    e.preventDefault();
    // Qui specifichiamo a typescript che e.target ha il type elencato qui sotto
    const target = e.target as typeof e.target & {
      review_object: { value: string };
      review_body: { value: string };
    };
    //Creaiamo l'review_object che verrá mandato come review_body della post
    const form = {
      review_object: target.review_object.value,
      review_body: target.review_body.value,

    };

    sendReviewMutation.mutate(form);
  };
  // Controlla se l'utente ha effettuato l'accesso. In caso contrario potrá usare il link
  if (!cookies.user?.email) {
    return (
      <div>
        <h3>Login necessario...</h3>
        <Link to="/signin">Effettua il login.</Link>
      </div>
    )
  }

  return (
    <div className="review-form">
      {cookies.user ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label className="review-label">Oggetto</label>
            <textarea
              className="review-textarea"
              name="review_object"
              placeholder="Oggetto..."
              maxLength={64}
              rows={1}
              required={true}
            />
          </div>
          <div>
            <label className="review-label">Corpo</label>
            <textarea
              className="review-textarea"
              name="review_body"
              placeholder="Messaggio..."
              rows={9}
              required={true}
            />
          </div>
          <div>
            <input
              type="submit"
              value="Invia recensione"
              disabled={sendReviewMutation.isLoading}
              className="submit-button"
            />
          </div>
        </form>
      ) : (
        <div>
          <h3>Login necessario...</h3>
          <Link to="/signin">Effettua il login.</Link>
        </div>
      )}
    </div>
  );
};

