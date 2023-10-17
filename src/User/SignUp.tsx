import { useMutation } from "@tanstack/react-query";
import { BackEnd, PostFun } from "../misc/Http";
import { useEffect, useState } from "react";

export default function SignUp() {
    //UseState per controllo password corrispondenti
    const [formCheck, setFormCheck] = useState({
        disabled: true,
        display_message: '',
    });

    //Questo useState corrisponde ai valori input 
    const [form, setForm] = useState({
        email: "",
        psw: "",
        psw_check: "",
        first_name: "",
        last_name: "",
    });


    // Interfaccia per la useMutation che specifica i type dei parametri funzione per mutationFn
    interface UserSignUp {
        email: string
        psw: string
        first_name: string
        last_name: string
    }
    // La useMutation per far partire la query post con i dati del nuovo utente
    const loginMutation = useMutation<BackEnd, unknown, UserSignUp>({
        mutationFn: (form) => PostFun('/user/signup', form)
    })


    // La handle si occupa di aggiornare i valori di profile ad ogni input dell'utente
    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setForm((prevProfile) => (
            {
                ...prevProfile,
                [name]: value
            }));
    };

    // Controllo che le due password corrispondono
    useEffect(() => {
        if (form.psw === form.psw_check) {
            setFormCheck({
                display_message: '',
                disabled: false
            })
        } else {
            setFormCheck({
                display_message: 'Le due password devono corrispondere',
                disabled: true
            })
        }

    }, [form.psw, form.psw_check])



    //La variabile e corrisponde ai valori event contenuti nel <form>
    const handleSubmit = (e: React.SyntheticEvent) => {
        //Evitiamo di far ricaricare la pagina
        e.preventDefault();
        
        //In caso il controllo non viene superato non viene effettua la mutate
        if (!formCheck.disabled) {
            const { psw_check, ...prevForm } = form
            loginMutation.mutate(prevForm);
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
                        <input type="text" name="first_name" value={form.first_name} maxLength={32} minLength={2} required={true} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Cognome:
                        <input type="text" name="last_name" value={form.last_name} maxLength={32} minLength={2} required={true} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Email:
                        <input type="email" name="email" value={form.email} maxLength={32} minLength={4} required={true} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input type="password" name="psw" value={form.psw} maxLength={32} minLength={8} required={true} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Ripeti password:
                        <input type="password" name="psw_check" value={form.psw_check} maxLength={32} minLength={8} required={true} onChange={handleChange} />
                    </label>
                </div>
                {formCheck.disabled && <h2>{formCheck.display_message}</h2>}
                <div>
                    <input type="submit" value="Login" disabled={loginMutation.isLoading}/>
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
