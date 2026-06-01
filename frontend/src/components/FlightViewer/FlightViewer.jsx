import { useState } from "react";
import "./FlightViewer.css";

function FlightViewer({ flights }) {
  // -----------------------------------
  // CURRENT SELECTED FLIGHT
  // -----------------------------------

  const [currentFlightIndex, setCurrentFlightIndex] = useState(0);

  if (!flights?.length) return null;

  const displayedFlight = flights[currentFlightIndex];

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
      <h2>Flights</h2>

      {/* AI PICK */}

      {currentFlightIndex === 0 && (
        <p className="recommendBadge">✈️ AI Recommendation</p>
      )}

      <div className={`flightCard ${currentFlightIndex === 0 ? "aiPick" : ""}`}>
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

        {/* FLIGHT STATS */}

        <div className="flightInfo">
          <p>
            ⏱️ {Math.floor(displayedFlight.total_duration / 60)}h{" "}
            {displayedFlight.total_duration % 60}m
          </p>

          <p>🛑 {displayedFlight.layovers?.length || 0} stops</p>
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

        {/* BOOKING */}

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

        {flights.length > 1 && (
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
