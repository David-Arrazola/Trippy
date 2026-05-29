import "./HotelViewer.css";

function HotelViewer({ hotels }) {
  return (
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
  );
}

export default HotelViewer;
