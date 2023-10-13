import { useQuery } from "@tanstack/react-query"
import { TestDatabaseFun, Test } from "../misc/Http"

//https://tkdodo.eu/blog/react-query-and-type-script

export default function TestDatabase() {

  /* data ha il type dell'interfaccia mentre isLoading ha unknown */

  const { data, error, isLoading } = useQuery<Test>(['test'], () => TestDatabaseFun('localhost:5173'));



  if (isLoading) {
    return <h2>Caricamento in corso...</h2>
  }

  if (error instanceof Error) {

    return <div>An error occurred: {error.message} ErrorName: {error.name}</div>

  }


  return (
    <>

      <p>Test database</p>
      <h2>{data?.message}</h2>

    </>
  )


}