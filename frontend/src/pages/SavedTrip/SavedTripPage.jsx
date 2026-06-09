import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import TripDisplay from "../../components/TripDisplay/TripDisplay.jsx";
import { itineraryApi } from "../../utils/api.js";
import { useTrip } from "../../context/tripContext.jsx";
import "../auth.css";
import "../MyTrips/MyTrips.css";
import "../tripResults/TripResults.css";

export default function SavedTripPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setTripState } = useTrip();
  const [tripData, setTripData] = useState(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrip() {
      try {
        const data = await itineraryApi.get(id);
        setTripData(data.itinerary.tripData);
        setTitle(data.itinerary.title);
        setTripState(data.itinerary.tripData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTrip();
  }, [id, setTripState]);

  if (loading) {
    return (
      <div className="pageLoader">
        <div className="typingIndicator" aria-label="Loading">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }

  if (error || !tripData) {
    return (
      <div className="myTripsPage">
        <Navbar />
        <main className="myTripsMain">
          <p className="myTripsError">{error || "Trip not found"}</p>
          <button type="button" onClick={() => navigate("/my-trips")}>
            Back to My Trips
          </button>
        </main>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <TripDisplay
        tripState={tripData}
        headerExtra={<span className="saveTripSaved">{title}</span>}
      />
    </>
  );
}
