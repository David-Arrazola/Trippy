import { useState } from "react";
import "./DailyPlanViewer.css";

function DailyPlanViewer({ city }) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  if (!city) return null;

  const days = city.daily_itinerary || [];

  const safeDayIndex =
    days.length > 0 ? Math.min(selectedDayIndex, days.length - 1) : 0;

  const selectedDay = days[safeDayIndex];

  return (
    <div className="itineraryContainer">
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

      {/* ACTIVITIES */}
      {selectedDay && (
        <div className="activityGrid">
          <h3 className="dayTitle">
            {city.name} • Day {selectedDay.day}
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
