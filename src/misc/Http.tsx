/* I type della risposta */
export interface Test {
    message: String
    name: number
}
/* Funzione get che ha come parametro optionale il token */
export async function TestDatabaseFun(token?: string) {
    
    if (typeof (token) === 'undefined') {
        token = ''
    }
    const response = await fetch("http://localhost:5445/",
       {
            method: 'GET',
            headers:
           {
                'Content-Type': 'application/json',
               'token': token
           },

        }
        );
    if (response.status <= 199 || response.status >= 300) {
        /* In caso di errore verrà mostrato quello che mandato express */
        const resJson = await response.json()
        console.log(resJson)
        throw new Error(resJson.message)
    }
    console.log(token)
    return await response.json();
}
