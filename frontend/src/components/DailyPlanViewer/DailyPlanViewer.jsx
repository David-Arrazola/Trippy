import { useState } from "react";
import "./DailyPlanViewer.css";

function DailyPlanViewer({ cities }) {
  const [selectedCityIndex, setSelectedCityIndex] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const selectedCity = cities?.[selectedCityIndex];

  if (!selectedCity) return null;

  const days = selectedCity.daily_itinerary || [];

  const safeDayIndex =
    days.length > 0 ? Math.min(selectedDayIndex, days.length - 1) : 0;

  const selectedDay = days[safeDayIndex];

  return (
    <div className="itineraryContainer">
      {/* CITY TABS */}

      <div className="cityTabs">
        {cities.map((city, index) => (
          <button
            key={index}
            className={`cityTab ${index === selectedCityIndex ? "active" : ""}`}
            onClick={() => {
              setSelectedCityIndex(index);
              setSelectedDayIndex(0);
            }}
          >
            {city.name}
          </button>
        ))}
      </div>

      {/* DAY TABS */}

      <div className="dayTabs">
        {days.map((day, index) => (
          <button
            key={index}
            className={`dayTab ${index === safeDayIndex ? "active" : ""}`}
            onClick={() => setSelectedDayIndex(index)}
          >
            Day {day.day}
          </button>
        ))}
      </div>

      {/* SELECTED DAY */}

      {selectedDay && (
        <div className="activityGrid">
          <h3 className="dayTitle">
            {selectedCity.name} • Day {selectedDay.day}
          </h3>

          <div className="activityRow">
            {selectedDay.activities?.map((activity, index) => (
              <div key={index} className="activityCard">
                {activity}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyPlanViewer;
