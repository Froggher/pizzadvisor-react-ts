// Interfaccia per specificare i type estratti da queryKey della mutation
export type latlng = {
    lat: number,
    lng: number,
};
/* I type della risposta dal nostro backend*/
export interface BackEnd {
    message: string,
    is_present?: boolean,
    name?: number,
    data?: string,
    user?: {
        email: string,
        token: string,
        first_name: string,
        last_name: string,
        follows: string,
    },
    review?: {
        first_name: string,
        last_name: string,
        review_object: string,
        review_body: string,
        created: Date,
        modified: boolean,
    },
    place?: {
        place_id: string,
        full_name: string,
        lat: number,
        lng: number,
    }
    det_place?: {
        place_id: string,
        full_name: string,
        lat: number,
        lng: number,
        only_name: string,
        formatted_address: string,
        opening_hours: string,
        formatted_phone_number: string,
        website: string,
        price_level: number,
        google_rating: number,
    }
    
}

/* I type della risposta dall'api del meteo*/
export interface Weather {
    current: {
        time: Date,
        temperature_2m: number,
        relativehumidity_2m: number,
        weathercode: number,
        windspeed_10m: number,
    },
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



export async function DeleteFun(url: string, token?: string, body?: object) {
    if (typeof (token) === 'undefined') {
        token = 'not provided'
    }
    const host = "http://localhost:5445"
    const response = await fetch(host.concat(url),
        {
            method: 'DELETE',
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



// Una fetch specifica per i effettuare get all'api del meteo
export async function getWeatherData(lat: number, lng: number) {
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m`);
    if (response.status !== 200) {
        /* In caso di errore verrà mostrato quello che mandato express */
        const resJson = await response.json()
        throw new Error(resJson.message) // Così estraiamo il messaggio preciso
    }
    return await response.json();
}


// Una fetch specifica per i effettuare get all'api del meteo
export async function getCheck(id_place: string) {
    const response = await fetch(
        `http://localhost:5445/place/check/${id_place}`);
    if (response.status !== 200) {
        /* In caso di errore verrà mostrato quello che mandato express */
        const resJson = await response.json()
        throw new Error(resJson.message) // Così estraiamo il messaggio preciso
    }
    return await response.json();
}