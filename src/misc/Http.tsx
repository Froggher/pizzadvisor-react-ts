/* I type della risposta */
export interface BackEnd {
    message: string
    name: number
    data: string
    auth: boolean
}
/* Funzione get che ha come parametro optionale il token */
export async function GetFun(url: string, token?: string) {
    if (typeof (token) === 'undefined') {
        token = 'not provided'
    }
    const host = "http://localhost:5445"
    const response = await fetch(host.concat(url),
        {
            method: 'GET',
            headers:
            {
                'Origin': 'http://localhost:5173',
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


export async function PostFun(url: string, body: object, token?: string) {
    if (typeof (token) === 'undefined') {
        token = 'not provided'
    }
    const host = "http://localhost:5445"
    const response = await fetch(host.concat(url),
        {
            method: 'POST',
            headers:
            {
                'Origin': 'http://localhost:5173',
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify(body),
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