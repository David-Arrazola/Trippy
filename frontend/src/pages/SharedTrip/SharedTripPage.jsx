import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import TripDisplay from "../../components/TripDisplay/TripDisplay.jsx";
import { itineraryApi } from "../../utils/api.js";
import "../auth.css";
import "../tripResults/TripResults.css";
import "../MyTrips/MyTrips.css";

export default function SharedTripPage() {
  const { shareId } = useParams();
  const [tripData, setTripData] = useState(null);
  const [ownerName, setOwnerName] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSharedTrip() {
      try {
        const data = await itineraryApi.getShared(shareId);
        setTripData(data.itinerary.tripData);
        setTitle(data.itinerary.title);
        setOwnerName(data.itinerary.user?.name || "A Trippy user");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (shareId) {
      loadSharedTrip();
    } else {
      setError("Invalid share link");
      setLoading(false);
    }
  }, [shareId]);

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
          <p className="myTripsError">{error || "Shared trip not found"}</p>
          <Link to="/">Plan your own trip</Link>
        </main>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <TripDisplay
        tripState={tripData}
        headerExtra={
          <div className="sharedTripBadge">
            <strong>{title}</strong>
            <span>Shared by {ownerName}</span>
          </div>
        }
      />
    </>
  );
}
