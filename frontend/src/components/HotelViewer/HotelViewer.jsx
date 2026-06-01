import { useState } from "react";
import "./HotelViewer.css";

function HotelViewer({ hotels }) {
  // -----------------------------------
  // CURRENT HOTEL INDEX PER CITY
  // -----------------------------------
  const [selectedHotels, setSelectedHotels] = useState({});

  // -----------------------------------
  // NEXT HOTEL
  // -----------------------------------
  const nextHotel = (city, hotelCount) => {
    setSelectedHotels((prev) => ({
      ...prev,
      [city]: ((prev[city] || 0) + 1) % hotelCount,
    }));
  };

  // -----------------------------------
  // PREVIOUS HOTEL
  // -----------------------------------
  const prevHotel = (city, hotelCount) => {
    setSelectedHotels((prev) => ({
      ...prev,
      [city]: ((prev[city] || 0) - 1 + hotelCount) % hotelCount,
    }));
  };

  return (
    <section className="card">
      <h2>Hotels</h2>

      {hotels.map((group, i) => {
        const city = group.city;

        const currentIndex = selectedHotels[city] || 0;

        const currentHotel = group.hotels?.[currentIndex];

        if (!currentHotel) return null;

        const isAIPick = currentIndex === 0;

        return (
          <div key={i} className="hotelCityGroup">
            {/* CITY HEADER */}
            <div className="hotelHeader">
              <h3>{city}</h3>
            </div>

            {/* AI LABEL */}
            {isAIPick && <p className="recommendBadge">✨ AI Recommendation</p>}

            {/* HOTEL CARD */}
            <div className={`hotelCard ${isAIPick ? "aiPick" : ""}`}>
              {/* NAME */}
              <p className="hotelName">{currentHotel.name}</p>

              {/* PRICE */}
              <p className="hotelPrice">
                💲 $
                {currentHotel.rate_per_night?.lowest ||
                  currentHotel.total_rate?.lowest ||
                  "N/A"}
                /night
              </p>

              {/* RATING */}
              {currentHotel.overall_rating && (
                <p className="hotelStat">⭐ {currentHotel.overall_rating}</p>
              )}

              {/* DISTANCE (FIXED FIELD NAME) */}
              {currentHotel.distance_to_hotspots_km != null && (
                <p className="hotelStat">
                  📍 {currentHotel.distance_to_hotspots_km.toFixed(1)} km from
                  major attractions
                </p>
              )}

              {/* SCORE */}
              {currentHotel.score != null && (
                <p className="hotelScore">
                  Final Score: {currentHotel.score.toFixed(1)}
                </p>
              )}

              {/* BOOKING */}
              {currentHotel.link && (
                <a
                  href={currentHotel.link}
                  target="_blank"
                  rel="noreferrer"
                  className="hotelLink"
                >
                  View Hotel
                </a>
              )}

              {/* CAROUSEL */}
              {group.hotels.length > 1 && (
                <div className="carouselButtons">
                  <button onClick={() => prevHotel(city, group.hotels.length)}>
                    ←
                  </button>

                  <span>
                    {currentIndex + 1} / {group.hotels.length}
                  </span>

                  <button onClick={() => nextHotel(city, group.hotels.length)}>
                    →
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default HotelViewer;
