// TODO ADD like a info box in the landing page that explains to users that transportation between cities is not accounted for. Only getting and leaving is
// TODO Add a feature that lets user's edit their prompt AFTER submitting so they can edit their budget or add more details
// TODO if flight or hotel is not appearing, let  user's know that they need to increase their budget
// todo make site look cleaner overall

import { useEffect, useState } from "react";
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

  const [selectedCityIndex, setSelectedCityIndex] = useState(0);

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
        <h1>{itinerary?.trip_summary?.destination}</h1>
        <p>{itinerary?.trip_summary?.trip_length} days</p>
      </header>

      <div className="tripContent">
        {/* LEFT COLUMN */}
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

        {/* RIGHT COLUMN */}
        <div className="rightColumn">
          <section className="card">
            <h2>Cities</h2>

            <div className="cityTabs">
              {cities.map((city, i) => (
                <button
                  key={i}
                  className={`cityTab ${
                    i === selectedCityIndex ? "active" : ""
                  }`}
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
