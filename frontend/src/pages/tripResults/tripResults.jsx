import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "../../context/tripContext.jsx";

import HotelViewer from "../../components/HotelViewer/HotelViewer.jsx";
import FlightViewer from "../../components/FlightViewer/FlightViewer.jsx";
import DailyPlanViewer from "../../components/DailyPlanViewer/DailyPlanViewer.jsx";

import "./TripResults.css";

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

export default function TripResults() {
  const { tripState } = useTrip();
  const navigate = useNavigate();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  useEffect(() => {
    if (!tripState) navigate("/");
  }, [tripState, navigate]);

  if (!tripState) return null;

  const itinerary = tripState.itinerary || {};
  const cities = itinerary?.cities || [];
  const hotels = tripState.hotels || [];
  const flights = tripState.flights || [];

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

  if (loadError) return <h1>Google Maps failed to load.</h1>;

  return (
    <div className="tripResultsContainer">
      <header>
        <h1>{itinerary?.trip_summary?.destination}</h1>
        <p>{itinerary?.trip_summary?.trip_length} days</p>
      </header>

      <div className="tripContent">
        {/* MAP */}
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

        {/* CITIES */}
        <section className="card">
          <h2>Cities</h2>

          <div className="citiesGrid">
            {cities.map((city, i) => (
              <div key={i} className="cityItem">
                <h3>{city.name}</h3>
                <p>{city.days} days</p>
                <p>${city.allocated_budget}</p>
              </div>
            ))}
          </div>
        </section>

        {/* DAILY ITINERARY */}
        <section className="card">
          <h2>Daily Itinerary</h2>

          <DailyPlanViewer cities={cities} />
        </section>

        {/* HOTELS + FLIGHTS */}
        <div className="resultsGrid">
          {hotels?.length > 0 && <HotelViewer hotels={hotels} />}
          {flights?.length > 0 && <FlightViewer flights={flights} />}
        </div>
      </div>
    </div>
  );
}
