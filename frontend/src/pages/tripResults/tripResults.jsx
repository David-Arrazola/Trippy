import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "../../context/tripContext.jsx";
import HotelViewer from "../../components/HotelViewer/HotelViewer.jsx";
import "./TripResults.css";

import {
  GoogleMap,
  MarkerF,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import FlightViewer from "../../components/FlightViewer/FlightViewer.jsx";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

//TODO In map make it so line colors switch per city and identify which city comes first, then second, then third
//TODO FIX BUDGETING SPLIT for hotels/flights/city days(I feel like something might be off with budgetting)
//TODO Make it so website asks for your location so that way user doens't have to specify which airport they want to leave from (They still can specifiy tho)
//TODO PASS in hotels and flights into a openai prompt so that chat can decide which is best hotels and flights based on budget but location of hotel to hotspots and length of flight
//TODO ASK openAI to actually make an itinerary for user's per the days they are in each city. As in what to do per each day at city-X

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

        <section className="card">
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

          {hotels?.length > 0 && <HotelViewer hotels={hotels} />}

          {/* FLIGHTS */}

          {flights?.length > 0 && <FlightViewer flights={flights} />}
        </div>
      </div>
    </div>
  );
}
