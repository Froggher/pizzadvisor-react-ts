import { useQuery } from "@tanstack/react-query"
import { GetFun, BackEnd } from "../misc/Http"

//https://tkdodo.eu/blog/react-query-and-type-script

export default function TestDatabase() {

  /* data ha il type dell'interfaccia mentre isLoading ha unknown */

  const { data, error, isLoading } = useQuery<BackEnd>(['test'], () => GetFun('/'));
  const { data:datadb, error:errordb, isLoading: isLoadingdb } = useQuery<BackEnd>(['dbtest'], () => GetFun('/db'));


  if (isLoading || isLoadingdb) {
    return <h2>Caricamento in corso...</h2>
  }

  if ((error) instanceof Error) {

    return <div>An error occurred: {error.message} ErrorName: {error.name}</div>

  }

  if ((errordb) instanceof Error) {

    return <div>un errore del test database: {errordb.message} ErrorName: {errordb.name}</div>

  }


  return (
    <>

      <p>Test database</p>
      <h2>{data?.message}</h2>
      <h2>{datadb?.message}</h2>

    </>
  )


}