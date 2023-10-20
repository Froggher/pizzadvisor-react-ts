import { useMutation } from "@tanstack/react-query";
import { BackEnd, PostFun } from "../../misc/Http";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

type SendReviewProps = {
  placeInfo: google.maps.GeocoderResult;
  placeName: string;
};

export default function SendReview({ placeInfo, placeName }: SendReviewProps) {
  const [cookies] = useCookies<'user', BackEnd>(["user"]);
  interface Review {
    object: string
    body: string
  }

  const sendReviewMutation = useMutation<BackEnd, unknown, Review>({
    mutationFn: (form) => PostFun('/sendreview', form, cookies.user?.token),

  });


  const handleSubmit = (e: React.SyntheticEvent) => {
    //Evitiamo di far ricaricare la pagina
    e.preventDefault();
    // Qui specifichiamo a typescript che e.target ha il type elencato qui sotto
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    //Creaiamo l'object che verrá mandato come body della post
    const form = {
      object: target.email.value,
      body: target.password.value,
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
    <form onSubmit={handleSubmit}>
      <div>
        <label>Oggetto{placeInfo.place_id}
          <textarea
            name="object"
            placeholder="Oggetto..."
            maxLength={64}
            rows={1}
            required={true}
          />
        </label>
      </div>
      <div>
        <label>Corpo{placeName}
          <textarea id="bodyTextArea"
            name="body"
            placeholder="Messaggio..."
            rows={9}
            required={true}
          />
        </label>
      </div>
      <div>
        <input type="submit" value="Invia recensione" />
      </div>
    </form>
  );
};

