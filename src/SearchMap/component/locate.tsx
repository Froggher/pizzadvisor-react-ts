
type LocateProps = {
    // una funzioe che accetta un oggetto e che non returna niente
    setUserPosition: (position: google.maps.LatLngLiteral) => void;
  };

export default function Locate({ setUserPosition }: LocateProps) {
    return (
        <div>
            <button onClick={() => {
                navigator.geolocation.getCurrentPosition((position) => {
                    console.log(position)
                    setUserPosition({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });



                }, () => null)
            }}>Trova la mia posizione</button>
        </div>
    )
}
