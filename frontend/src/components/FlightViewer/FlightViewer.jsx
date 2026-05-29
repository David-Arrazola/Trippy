import { useState } from "react";
import "./FlightViewer.css";

function FlightViewer({ flights }) {
  // -----------------------------------
  // CURRENT SELECTED FLIGHT
  // -----------------------------------

  const [currentFlightIndex, setCurrentFlightIndex] = useState(0);
  const [browseMode, setBrowseMode] = useState(false);

  // -----------------------------------
  // AI RECOMMENDED FLIGHT
  // -----------------------------------

  const recommendedFlight = flights[0];

  // -----------------------------------
  // CURRENT DISPLAYED FLIGHT
  // -----------------------------------

  const displayedFlight = browseMode
    ? flights[currentFlightIndex]
    : recommendedFlight;

  if (!displayedFlight) return null;

  // -----------------------------------
  // NEXT FLIGHT
  // -----------------------------------

  const nextFlight = () => {
    setCurrentFlightIndex((prev) => (prev + 1) % flights.length);
  };

  // -----------------------------------
  // PREVIOUS FLIGHT
  // -----------------------------------

  const prevFlight = () => {
    setCurrentFlightIndex(
      (prev) => (prev - 1 + flights.length) % flights.length,
    );
  };

  return (
    <section className="card">
      {/* HEADER */}

      <div className="flightTop">
        <h2>Flights</h2>

        <button
          className="browseButton"
          onClick={() => setBrowseMode(!browseMode)}
        >
          {browseMode ? "Show AI Pick" : "Browse Flights"}
        </button>
      </div>

      {/* BADGE */}

      {!browseMode && <p className="recommendBadge">✈️ AI Recommended</p>}

      {/* FLIGHT CARD */}

      <div className="flightCard">
        {/* HEADER */}

        <div className="flightHeader">
          <img
            src={displayedFlight.airline_logo}
            alt="airline logo"
            width="42"
          />

          <div>
            <h3>{displayedFlight.flights?.[0]?.airline}</h3>

            <p className="flightPrice">${displayedFlight.price}</p>
          </div>
        </div>

        {/* FLIGHT INFO */}

        <div className="flightInfo">
          <p>
            {Math.floor(displayedFlight.total_duration / 60)}h{" "}
            {displayedFlight.total_duration % 60}m
          </p>

          <p>{displayedFlight.layovers?.length || 0} stops</p>
        </div>

        {/* SEGMENTS */}

        <div className="segments">
          {displayedFlight.flights.map((segment, index) => (
            <div key={index} className="segment">
              <p>
                {segment.departure_airport.id} → {segment.arrival_airport.id}
              </p>

              <p>
                {segment.airline} • {segment.airplane}
              </p>
            </div>
          ))}
        </div>

        {/* BOOKING LINK */}

        {displayedFlight.booking_token && (
          <a
            href="https://www.google.com/travel/flights"
            target="_blank"
            rel="noreferrer"
            className="flightLink"
          >
            View Flight
          </a>
        )}

        {/* CAROUSEL */}

        {browseMode && flights.length > 1 && (
          <div className="carouselButtons">
            <button onClick={prevFlight}>←</button>

            <span>
              {currentFlightIndex + 1} / {flights.length}
            </span>

            <button onClick={nextFlight}>→</button>
          </div>
        )}
      </div>
    </section>
  );
}

export default FlightViewer;
