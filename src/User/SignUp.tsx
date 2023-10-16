import { useMutation } from "@tanstack/react-query";
import { BackEnd, PostFun } from "../misc/Http";
import { useState } from "react";

export default function SignUp() {
    const [formCheck, setFormCheck] = useState({
        isDisabled: true,
        displayError: '',
    });

    interface UserSignUp {
        email: string
        psw: string
        first_name: string
        last_name: string
    }

    const loginMutation = useMutation<BackEnd, unknown, UserSignUp>({
        mutationFn: (form) => PostFun('/user/registration', form)
    })

    //La variabile e corrisponde ai valori event contenuti nel <form>
    const handleSubmit = (e: React.SyntheticEvent) => {
        //Evitiamo di far ricaricare la pagina
        e.preventDefault();
        // Qui specifichiamo a typescript che e.target ha il type elencato qui sotto
        const target = e.target as typeof e.target & {
            email: { value: string };
            password: { value: string };
            passwordcheck: { value: string };
            first_name: { value: string };
            last_name: { value: string };
        };
        // Controllo che le due password corrispondono
            if (target.password.value === target.passwordcheck.value) {
                setFormCheck({
                    isDisabled: false,
                    displayError: ""
                })
            } else {
                setFormCheck({
                    isDisabled: true,
                    displayError: "Le due password devono corrispondere"
                })
            }

        //Creaiamo l'object che verrá mandato come body della post
        const form = {
            email: target.email.value,
            psw: target.password.value,
            first_name: target.email.value,
            last_name: target.password.value,
        };

        //In caso il controllo non viene superato non viene effettua la mutate
        if (!formCheck.isDisabled) {
            loginMutation.mutate(form);
        }
    };


    return (
        <>
            <form
                //ref={formRef}
                onSubmit={handleSubmit}
            >
                <div>
                    <label>
                        Primo nome:
                        <input type="text" name="nome" maxLength={32} minLength={2} required={true}/>
                    </label>
                </div>
                <div>
                    <label>
                        Cognome:
                        <input type="text" name="cognome" maxLength={32} minLength={2} required={true}/>
                    </label>
                </div>
                <div>
                    <label>
                        Email:
                        <input type="email" name="email" maxLength={32} minLength={4} required={true}/>
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input type="password" name="password" maxLength={32} minLength={8} required={true}/>
                    </label>
                </div>
                <div>
                    <label>
                        Ripeti password:
                        <input type="password" name="passwordcheck" maxLength={32} minLength={8} required={true}/>
                    </label>
                </div>
                {formCheck.isDisabled && <h2>{formCheck.displayError}</h2>}
                <div>
                    <input type="submit" value="Login" />
                </div>
            </form>
            <div>
                {loginMutation.isLoading && <h3>Caricamento risposta...</h3>}
                {loginMutation.error instanceof Error && <div>An error occurred: {loginMutation.error.message} ErrorName: {loginMutation.error.name}</div>}
                <h2>{loginMutation.data?.message}</h2>
                <h2>{loginMutation.data?.data}</h2>

            </div>
        </>
    )
}
