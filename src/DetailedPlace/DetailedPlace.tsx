import { useParams } from "react-router-dom";
import ViewPlaceDetails from "./component/ViewPlaceDetails";
import SendReview from "../SearchMap/component/SendReview";
import ViewReview from "../SearchMap/component/ViewReview";
import UpdateDetails from "./component/UpdateDetails";
import { useCookies } from "react-cookie";
import { BackEnd } from "../misc/Http";

export default function DetailedPlace() {
    const { place_id } = useParams();
    const [cookies] = useCookies<'user', BackEnd>(["user"]);

    return (
        <div>
            {place_id &&
                <div>
                    <ViewPlaceDetails place_id={place_id} more_details={true}/>
                    {cookies.user?.is_mod ? <UpdateDetails place_id={place_id}/> : null}
                    <ViewReview place_id={place_id} />
                    <SendReview place_id={place_id} />
                </div>
            }
        </div>
    )

}


