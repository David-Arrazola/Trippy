import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "../../context/tripContext.jsx";

import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";

// import "./TripResults.css";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export default function TripResults() {
  const { tripState } = useTrip();
  const navigate = useNavigate();

  // redirect if no trip exists
  useEffect(() => {
    if (!tripState) {
      navigate("/");
    }
  }, [tripState, navigate]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  if (!tripState) return null;

  const itinerary = tripState.itinerary;
  const cities = itinerary?.cities || [];

  const hotels = tripState.hotels || [];
  const flights = tripState.flights || {};

  const defaultCenter =
    cities.length > 0
      ? { lat: cities[0].lat, lng: cities[0].lng }
      : { lat: 39.8283, lng: -98.5795 }; // fallback center (USA)

  const pathCoordinates = cities
    .filter((c) => c.lat && c.lng)
    .map((c) => ({
      lat: c.lat,
      lng: c.lng,
    }));

  return (
    <div className="tripResultsContainer">
      <header>
        <h1>Your Trip To {itinerary?.trip_summary?.destination}</h1>
        <p>{itinerary?.trip_summary?.trip_length} days</p>
      </header>

      <div className="tripLayout">
        {/* MAP SECTION */}
        <section className="mapSection">
          <h2>Trip Map</h2>

          <div className="mapWrapper">
            {isLoaded && (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={defaultCenter}
                zoom={4}
              >
                {cities.map((city, index) => (
                  <Marker
                    key={index}
                    position={{
                      lat: city.lat,
                      lng: city.lng,
                    }}
                    title={city.name}
                  />
                ))}

                {pathCoordinates.length > 1 && (
                  <Polyline
                    path={pathCoordinates}
                    options={{
                      strokeColor: "#38bdf8",
                      strokeOpacity: 1,
                      strokeWeight: 3,
                    }}
                  />
                )}
              </GoogleMap>
            )}
          </div>
        </section>

        {/* SIDE PANEL */}
        <aside className="sidePanel">
          {/* CITIES */}
          <div className="card">
            <h2>Cities</h2>
            {cities.map((city, i) => (
              <div key={i}>
                <h3>{city.name}</h3>
                <p>{city.days} days</p>
              </div>
            ))}
          </div>

          {/* HOTELS */}
          <div className="card">
            <h2>Hotels</h2>
            {hotels.map((group, i) => (
              <div key={i}>
                <h3>{group.city}</h3>

                {group.hotels.map((hotel, j) => (
                  <div key={j}>
                    <p>{hotel.name}</p>
                    <p>${hotel.rate_per_night?.lowest || "N/A"}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* FLIGHTS */}
          {flights?.bestFlights?.length > 0 && (
            <div className="card">
              <h2>Flights</h2>

              {flights.bestFlights.slice(0, 2).map((flight, i) => (
                <div key={i}>
                  <p>${flight.price}</p>
                  <p>
                    {Math.floor(flight.total_duration / 60)}h{" "}
                    {flight.total_duration % 60}m
                  </p>
                  <p>{flight.layovers?.length || 0} stops</p>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
