
type MyPositionProps = {
    // una funzioe che accetta un oggetto e che non returna niente
    setUserPosition: (position: google.maps.LatLngLiteral) => void;
  };

export default function MyPosition({ setUserPosition }: MyPositionProps) {
    return (
        <div>
            <button onClick={() => {
                navigator.geolocation.getCurrentPosition((position) => {
                    setUserPosition({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });



                }, () => null)
            }}>Trova la mia posizione</button>
        </div>
    )
}
