import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "../../context/tripContext.jsx";

import {
  GoogleMap,
  MarkerF,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";

import "./TripResults.css";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

export default function TripResults() {
  const { tripState } = useTrip();
  const navigate = useNavigate();

  // -----------------------------------
  // GOOGLE MAPS LOADER
  // -----------------------------------

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  // -----------------------------------
  // REDIRECT IF NO TRIP
  // -----------------------------------

  useEffect(() => {
    if (!tripState) {
      navigate("/");
    }
  }, [tripState, navigate]);

  if (!tripState) return null;

  // -----------------------------------
  // DATA
  // -----------------------------------

  const itinerary = tripState.itinerary || {};
  const cities = itinerary?.cities || [];

  const hotels = tripState.hotels || [];
  const flights = tripState.flights || {};

  // -----------------------------------
  // MAP CENTER
  // -----------------------------------

  const validCities = cities.filter(
    (city) =>
      city.lat !== undefined &&
      city.lng !== undefined &&
      city.lat !== null &&
      city.lng !== null,
  );

  const defaultCenter =
    validCities.length > 0
      ? {
          lat: Number(validCities[0].lat),
          lng: Number(validCities[0].lng),
        }
      : {
          lat: 39.8283,
          lng: -98.5795,
        };

  // -----------------------------------
  // POLYLINE PATH
  // -----------------------------------

  const pathCoordinates = validCities.map((city) => ({
    lat: Number(city.lat),
    lng: Number(city.lng),
  }));

  // -----------------------------------
  // DEBUG LOGS
  // -----------------------------------

  console.log("TRIP STATE:", tripState);
  // -----------------------------------
  // LOAD ERROR
  // -----------------------------------

  if (loadError) {
    return <h1>Google Maps failed to load.</h1>;
  }

  return (
    <div className="tripResultsContainer">
      {/* HEADER */}

      <header>
        <h1>
          Your Trip To{" "}
          {itinerary?.trip_summary?.destination || "Your Destination"}
        </h1>

        <p>{itinerary?.trip_summary?.trip_length || 0} days</p>
      </header>

      <div className="tripLayout">
        {/* ================================= */}
        {/* MAP */}
        {/* ================================= */}

        <section className="mapSection">
          <h2>Trip Map</h2>

          {!isLoaded ? (
            <p>Loading map...</p>
          ) : (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={defaultCenter}
              zoom={4}
            >
              {/* MARKERS */}

              {validCities.map((city, index) => (
                <MarkerF
                  key={index}
                  position={{
                    lat: Number(city.lat),
                    lng: Number(city.lng),
                  }}
                  title={city.name}
                />
              ))}

              {/* POLYLINE */}

              {pathCoordinates.length > 1 && (
                <Polyline
                  path={pathCoordinates}
                  options={{
                    strokeColor: "#fb16ff",
                    strokeOpacity: 1,
                    strokeWeight: 7,
                  }}
                />
              )}
            </GoogleMap>
          )}
        </section>

        {/* ================================= */}
        {/* SIDE PANEL */}
        {/* ================================= */}

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

                {group.hotels?.map((hotel, j) => (
                  <div key={j}>
                    <p>{hotel.name}</p>
                    <p>${hotel.rate_per_night?.lowest || "N/A"}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* FLIGHTS */}

          {flights?.length > 0 && (
            <div className="card">
              <h2>Flights</h2>

              {flights.map((currFlight, i) => (
                <div key={i} className="flightCard">
                  {/* airline */}
                  <div>
                    <img
                      src={currFlight.airline_logo}
                      alt="airline logo"
                      width="50"
                    />

                    <p>{currFlight.flights?.[0]?.airline}</p>
                  </div>

                  {/* price */}
                  <p>
                    <strong>${currFlight.price}</strong>
                  </p>

                  {/* duration */}
                  <p>
                    {Math.floor(currFlight.total_duration / 60)}h{" "}
                    {currFlight.total_duration % 60}m
                  </p>

                  {/* stops */}
                  <p>{currFlight.layovers?.length || 0} stops</p>

                  {/* currFlight path */}
                  <div>
                    {currFlight.flights.map((segment, index) => (
                      <div key={index}>
                        <p>
                          {segment.departure_airport.id} →{" "}
                          {segment.arrival_airport.id}
                        </p>

                        <p>
                          {segment.airline} • {segment.airplane}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
