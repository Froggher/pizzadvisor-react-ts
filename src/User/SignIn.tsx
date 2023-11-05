import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BackEnd, PostFun } from "../misc/Http";

import { useCookies } from "react-cookie";
import './user.css'


export default function SignIn() {

    const queryClient = useQueryClient();


    /* Importo l'hook dei cookie */
    const [, setCookie] = useCookies<'user', BackEnd>(["user"]);

    // Creiamo una costante data
    const currentDate = new Date();
    // Impostiamo dal giorno di oggi e aggiungiamo 30 giorni
    currentDate.setDate(currentDate.getDate() + 30);

    /* Utile per definire il type dell'argomento della mutationfn */
    interface UserLogin {
        email: string
        psw: string
    }

    const loginMutation = useMutation<BackEnd, unknown, UserLogin>({
        mutationFn: (form) => PostFun('/login', form),
        onSuccess: (data) => {
            setCookie("user", data.user, { expires: currentDate });
            queryClient.clear();
        }
    });



    //Il parametro 'e' corrisponde ai valori event contenuti nel <form>
    const handleSubmit = (e: React.SyntheticEvent) => {
        //Evitiamo di far ricaricare la pagina
        e.preventDefault();
        // Qui specifichiamo a typescript che e.target ha il type elencato qui sotto
        const target = e.target as typeof e.target & {
            email: { value: string };
            password: { value: string };
        };
        //Creaiamo l'object che verrá mandato come body della post (deve corrispondere a UserLogin)
        const form = {
            email: target.email.value,
            psw: target.password.value,
        };
        // Eseguiamo la mutate
        loginMutation.mutate(form);
    };



    return (
        <div className="login-form">
            <h1>Effettua il login</h1>
            <form onSubmit={handleSubmit}>
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
                {loginMutation.error instanceof Error && <h2>{loginMutation.error.message}</h2>}
                <h2>{loginMutation.data?.message}</h2>
                <h2>{loginMutation.data?.data}</h2>
            </div>
        </div>
    );

}
