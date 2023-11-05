import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BackEnd, DeleteFun, GetFun, PostFun } from "../../misc/Http";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";


type FollowProps = {
    place_id: string;
    more_details?: boolean;
};


export default function Follow({ place_id }: FollowProps) {
    const [cookies] = useCookies<'user', BackEnd>(["user"]);
    const queryClient = useQueryClient();

    // Get che si occupa di vederre lo stato del follow dato il place id
    const { data, error, isLoading, isSuccess } = useQuery<BackEnd>(['checkfollow', place_id],
        () => GetFun(`/follow/check/${place_id}`, cookies.user?.token),
        {
            enabled: cookies.user?.token !== undefined,
        });


    interface Follow {
        place_id: string
    }

    // Aggiunge il follow relativo al place id
    const addFollowMutation = useMutation<BackEnd, unknown, Follow>({
        mutationFn: (form) => PostFun('/follow/post', form, cookies.user?.token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['checkfollow'] });
            queryClient.invalidateQueries({ queryKey: ['showfollows'] });
        }
    });
    // Rimuove il follow relativo al place id
    const deleteFollowMutation = useMutation<BackEnd, unknown, Follow>({
        mutationFn: (form) => DeleteFun('/follow/delete', cookies.user?.token, form),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['checkfollow'] });
            queryClient.invalidateQueries({ queryKey: ['showfollows'] });
        }
    });



    const handleAddFollow = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const body = {
            place_id: place_id,
        };
        addFollowMutation.mutate(body);
    }


    const handleDeleteFollow = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const body = {
            place_id: place_id,
        };
        deleteFollowMutation.mutate(body);
    }


    if (!cookies.user?.token) {
        return <Link className="website-link" to={`/signin`}>Aggiungi a preferiti</Link>
    }

    if (isLoading) {
        return <p>Caricamento preferito...</p>
    }

    if ((error) instanceof Error) {
        return <div>An error occurred: {error.message} ErrorName: {error.name}</div>
    }



    if (isSuccess && (data.is_present)) {
        return (
            <div>
                <input type="submit" value="Rimuovi da preferiti" onClick={handleDeleteFollow} disabled={deleteFollowMutation.isLoading} />
                
            </div>
        )
    }


    return (

        <div>
            <input type="submit" value="Aggiungi a preferiti" onClick={handleAddFollow} disabled={addFollowMutation.isLoading} />
        </div>
    )
}
