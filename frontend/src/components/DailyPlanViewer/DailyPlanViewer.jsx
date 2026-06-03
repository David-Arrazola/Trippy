import "./DailyPlanViewer.css";

function DailyPlanViewer({ cities }) {
  if (!cities?.length) return null;

  return (
    <section className="card dailyPlanCard">
      <h2>Daily Itinerary</h2>

      {cities.map((city, cityIndex) => (
        <div key={cityIndex} className="cityItinerary">
          <h3>{city.name}</h3>

          {city.daily_itinerary?.map((dayPlan, dayIndex) => (
            <div key={dayIndex} className="dayCard">
              <h4>Day {dayPlan.day}</h4>

              {/* MORNING */}
              <div className="timeBlock">
                <h5>🌅 Morning</h5>
                <ul>
                  {dayPlan.morning?.map((activity, i) => (
                    <li key={i}>{activity}</li>
                  ))}
                </ul>
              </div>

              {/* AFTERNOON */}
              <div className="timeBlock">
                <h5>☀️ Afternoon</h5>
                <ul>
                  {dayPlan.afternoon?.map((activity, i) => (
                    <li key={i}>{activity}</li>
                  ))}
                </ul>
              </div>

              {/* EVENING */}
              <div className="timeBlock">
                <h5>🌙 Evening</h5>
                <ul>
                  {dayPlan.evening?.map((activity, i) => (
                    <li key={i}>{activity}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}

export default DailyPlanViewer;
