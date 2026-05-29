import "./FlightViewer.css";

function FlightViewer({ flights }) {
  return (
    <section className="card">
      <h2>Flights</h2>

      {flights.map((currFlight, i) => (
        <div key={i} className="flightCard">
          <div className="flightHeader">
            <img src={currFlight.airline_logo} alt="airline logo" width="42" />

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
                  {segment.departure_airport.id} → {segment.arrival_airport.id}
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
  );
}

export default FlightViewer;
