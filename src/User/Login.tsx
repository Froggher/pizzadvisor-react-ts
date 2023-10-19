import { useMutation } from "@tanstack/react-query";
import { BackEnd, PostFun } from "../misc/Http";
import Cookies from "js-cookie";
export default function Login() {


    interface UserLogin {
        email: string
        psw: string
    }

    const loginMutation = useMutation<BackEnd, unknown, UserLogin>({
        mutationFn: (form) => PostFun('/login', form)
    })

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

    // Se i dati di login vengono salavati nel cookie
    if (loginMutation.isSuccess) {
        Cookies.set('token', loginMutation.data.data, { expires: 7 })

        //Cookies.remove('token')
    }

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
                <h2>{Cookies.get('token')}</h2>
                <div>
                    <input type="submit" value="LogOut" onClick={() => Cookies.remove('token')} />
                </div>
            </div>
        </>
    )
}
