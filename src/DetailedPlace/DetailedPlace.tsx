import { useParams } from "react-router-dom";
import PlaceData from "./component/PlaceData";
import SendReview from "../SearchMap/component/sendReview";
import ViewReview from "../SearchMap/component/ViewReview";

export default function DetailedPlace() {
    const { place_id } = useParams();

    return (
        <div>
            {place_id &&
                <div>
                    <PlaceData place_id={place_id} more_details={true}/>
                    <ViewReview place_id={place_id} />
                    <SendReview place_id={place_id} />
                </div>
            }
        </div>
    )

}


