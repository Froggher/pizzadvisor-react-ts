import { useMutation } from "@tanstack/react-query";
import { BackEnd, PostFun } from "../misc/Http";

import { useCookies } from "react-cookie";
export default function Login() {
    const [, setCookie, removeCookie] = useCookies<'user', BackEnd>(["user"]);
    
    //Creiamo la data per mettere quando scade il token
    const currentDate = new Date();
    // Impostiamo dal giorno di oggi e aggiungiamo 30 giorni
    currentDate.setDate(currentDate.getDate() + 30);

    
    interface UserLogin {
        email: string
        psw: string
    }

    const loginMutation = useMutation<BackEnd, unknown, UserLogin>({
        mutationFn: (form) => PostFun('/login', form),
        onSuccess: (data) => {
            setCookie("user", data.user, { expires: currentDate });
        }
    });


    // Se i dati di login vengono salavati nel cookie
    if (loginMutation.isSuccess) {
        console.log('ciao')


    }

    //La variabile e corrisponde ai valori event contenuti nel <form>
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
            email: target.email.value,
            psw: target.password.value,
        };

        loginMutation.mutate(form);
    };



    return (
        <>
            <form
                //ref={formRef}
                onSubmit={handleSubmit}
            >
                <div>
                    <label>
                        Email:
                        <input type="email" name="email" maxLength={32} minLength={4} required={true} />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input type="password" name="password" maxLength={32} minLength={8} required={true} />
                    </label>
                </div>
                <div>
                    <input type="submit" value="Login" disabled={loginMutation.isLoading} />
                </div>
            </form>
            <div>
                {loginMutation.isLoading && <h3>Caricamento risposta...</h3>}
                {loginMutation.error instanceof Error && <div>An error occurred: {loginMutation.error.message} ErrorName: {loginMutation.error.name}</div>}
                <h2>{loginMutation.data?.message}</h2>
                <h2>{loginMutation.data?.data}</h2>
                {/* <h2>{Cookies.get('token')}</h2> */}
                <div>
                    <input type="submit" value="LogOut" onClick={() => removeCookie("user")} />
                </div>
            </div>
        </>
    )
}
