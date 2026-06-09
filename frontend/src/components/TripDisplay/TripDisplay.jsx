import { useState } from "react";
import HotelViewer from "../HotelViewer/HotelViewer.jsx";
import FlightViewer from "../FlightViewer/FlightViewer.jsx";
import DailyPlanViewer from "../DailyPlanViewer/DailyPlanViewer.jsx";
import {
  GoogleMap,
  MarkerF,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

export default function TripDisplay({ tripState, headerExtra = null }) {
  const [selectedCityIndex, setSelectedCityIndex] = useState(0);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  if (!tripState) return null;

  const itinerary = tripState.itinerary || {};
  const cities = itinerary?.cities || [];
  const hotels = tripState.hotels || [];
  const flights = tripState.flights || [];
  const selectedCity = cities[selectedCityIndex];

  const selectedCityHotels =
    hotels.find(
      (hotelGroup) =>
        hotelGroup.city?.toLowerCase() === selectedCity?.name?.toLowerCase(),
    ) || null;

  const validCities = cities.filter((c) => c.lat && c.lng);

  const pathCoordinates = validCities.map((c) => ({
    lat: Number(c.lat),
    lng: Number(c.lng),
  }));

  const defaultCenter =
    validCities.length > 0
      ? {
          lat: Number(validCities[0].lat),
          lng: Number(validCities[0].lng),
        }
      : { lat: 39.8283, lng: -98.5795 };

  if (loadError) {
    return <h1>Google Maps failed to load.</h1>;
  }

  return (
    <div className="tripResultsContainer">
      <header>
        <div className="tripHeaderMain">
          <div>
            <h1>{itinerary?.trip_summary?.destination}</h1>
            <p>{itinerary?.trip_summary?.trip_length} days</p>
          </div>
          {headerExtra}
        </div>
      </header>

      <div className="tripContent">
        <div className="leftColumn">
          <section className="card">
            <h2>Trip Map</h2>

            {isLoaded && (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={defaultCenter}
                zoom={4}
              >
                {validCities.map((city, i) => (
                  <MarkerF
                    key={i}
                    position={{
                      lat: Number(city.lat),
                      lng: Number(city.lng),
                    }}
                  />
                ))}

                <Polyline
                  path={pathCoordinates}
                  options={{
                    strokeColor: "#fb16ff",
                    strokeWeight: 5,
                  }}
                />
              </GoogleMap>
            )}
          </section>

          {flights?.length > 0 && (
            <section>
              <FlightViewer flights={flights} />
            </section>
          )}
        </div>

        <div className="rightColumn">
          <section className="card">
            <h2>Cities</h2>

            <div className="cityTabs">
              {cities.map((city, i) => (
                <button
                  key={i}
                  className={`cityTab ${i === selectedCityIndex ? "active" : ""}`}
                  onClick={() => setSelectedCityIndex(i)}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </section>

          <section className="card">
            <h2>Daily Itinerary</h2>
            <DailyPlanViewer city={selectedCity} />
          </section>

          {selectedCityHotels && (
            <section>
              <HotelViewer hotels={[selectedCityHotels]} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
