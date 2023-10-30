import { useQuery } from "@tanstack/react-query";
import { BackEnd, GetFun } from "../../misc/Http";


export default function getPlaces() {


  const { data, error, isLoading } = useQuery<BackEnd>(['placeaaaas'], () => GetFun(`/places`));


  if (isLoading) {
    return <h2>Caricamento places in corso...</h2>
  }

  if ((error) instanceof Error) {

    return <div>An error occurred: {error.message} ErrorName: {error.name}</div>

  }


  if (data && data.place) {
    // Serve per controllare se i dati arrivano sottoforma di array o di oggetto singolo
    // Questo serve perché map si puó usare solo con gli array
    // values: Returns an array of values of the enumerable properties of an object
    const reviews = Array.isArray(data.place) ? data.place : Object.values(data.place);
    return reviews;

  }
}
