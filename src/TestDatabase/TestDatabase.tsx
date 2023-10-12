import { useQuery } from "@tanstack/react-query"

//https://tkdodo.eu/blog/react-query-and-type-script

export default function TestDatabase() {
  /* I type della risposta */
  interface Test {
    msg: String
  }
  /* Type Inference */
  async function TestDatabase(): Promise<Test> {
    const response = await fetch("http://localhost:5445");
    const dataTest = await response.json();
    console.log(dataTest);
    return dataTest
  }

  /* data ha il type dell'interfaccia mentre isLoading ha unknown */
  
  const { data, error, isLoading } = useQuery({
    queryKey: ['test'],
    queryFn: TestDatabase,

  })


  
  if (isLoading) {
    return <h2>Caricamento in corso...</h2>
  }

  if (error instanceof Error) {

    return <div>An error occurred: {error.message} ErrorName: {error.name}</div>

  }


  return (
    <>

      <p>Test database</p>
      <h2>{data?.msg}</h2>

    </>
  )


}