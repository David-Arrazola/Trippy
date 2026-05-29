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

//TODO separate areas like "Hotels" and "Flights" into components in different pages and export them
//TODO add a feature where user can carosell through hotels and flights so they can choose BUT also include RECOMMEND section where it displays what  the AI recommends. OR they can change to they choose from selection of switch via carosell
//TODO In map make it so line colors switch per city and identify which city comes first, then second, then third

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

      <div className="tripContent">
        {/* MAP */}

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

        {/* CITIES */}

        <section className="card citiesCard">
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

        {/* HOTEL + FLIGHT GRID */}

        <div className="resultsGrid">
          {/* HOTELS */}

          {hotels?.length > 0 && (
            <section className="card">
              <h2>Hotels</h2>

              {hotels.map((group, i) => (
                <div key={i}>
                  <h3>{group.city}</h3>

                  {group.hotels?.map((hotel, j) => (
                    <div key={j} className="hotelCard">
                      <p>{hotel.name}</p>

                      <p>${hotel.rate_per_night?.lowest || "N/A"} / night</p>

                      {/* future booking link */}
                      {hotel.link && (
                        <a href={hotel.link} target="_blank" rel="noreferrer">
                          View Hotel
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </section>
          )}

          {/* FLIGHTS */}

          {flights?.length > 0 && (
            <section className="card">
              <h2>Flights</h2>

              {flights.map((currFlight, i) => (
                <div key={i} className="flightCard">
                  <div className="flightHeader">
                    <img
                      src={currFlight.airline_logo}
                      alt="airline logo"
                      width="42"
                    />

                    <div>
                      <h3>{currFlight.flights?.[0]?.airline}</h3>

                      <p className="flightPrice">${currFlight.price}</p>
                    </div>
                  </div>

                  <p>
                    {Math.floor(currFlight.total_duration / 60)}h{" "}
                    {currFlight.total_duration % 60}m
                  </p>

                  <p>{currFlight.layovers?.length || 0} stops</p>

                  <div className="segments">
                    {currFlight.flights.map((segment, index) => (
                      <div key={index} className="segment">
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
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
