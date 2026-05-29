import { useState } from "react";
import "./HotelViewer.css";

function HotelViewer({ hotels }) {
  // -----------------------------------
  // STORE CURRENT HOTEL INDEX PER CITY
  // -----------------------------------

  const [selectedHotels, setSelectedHotels] = useState({});

  const [browseMode, setBrowseMode] = useState({});

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

  // -----------------------------------
  // TOGGLE MODE
  // -----------------------------------

  const toggleBrowseMode = (city) => {
    setBrowseMode((prev) => ({
      ...prev,

      [city]: !prev[city],
    }));
  };

  return (
    <section className="card">
      <h2>Hotels</h2>

      {hotels.map((group, i) => {
        const city = group.city;

        const currentIndex = selectedHotels[city] || 0;

        const browsing = browseMode[city];

        const currentHotel = browsing
          ? group.hotels[currentIndex]
          : group.recommended;

        if (!currentHotel) return null;

        return (
          <div key={i} className="hotelCityGroup">
            {/* CITY TITLE */}

            <div className="hotelHeader">
              <h3>{city}</h3>

              <button
                className="browseButton"
                onClick={() => toggleBrowseMode(city)}
              >
                {browsing ? "Show AI Pick" : "Browse Hotels"}
              </button>
            </div>

            {/* RECOMMENDATION LABEL */}

            {!browsing && <p className="recommendBadge">✨ AI Recommended</p>}

            {/* HOTEL CARD */}

            <div className="hotelCard">
              <p className="hotelName">{currentHotel.name}</p>

              <p className="hotelPrice">
                ${currentHotel.rate_per_night?.lowest || "N/A"}/ night
              </p>

              {currentHotel.overall_rating && (
                <p>⭐ {currentHotel.overall_rating}</p>
              )}

              {/* BOOKING LINK */}

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

              {/* CAROUSEL CONTROLS */}

              {browsing && group.hotels.length > 1 && (
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
