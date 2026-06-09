import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import { itineraryApi } from "../../utils/api.js";
import "../auth.css";
import "./MyTrips.css";

export default function MyTripsPage() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const navigate = useNavigate();

  async function loadTrips() {
    setLoading(true);
    setError("");

    try {
      const data = await itineraryApi.list();
      setItineraries(data.itineraries);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTrips();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this saved trip?")) return;

    try {
      await itineraryApi.remove(id);
      setItineraries((prev) => prev.filter((trip) => trip._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleShareToggle(trip) {
    try {
      const data = await itineraryApi.update(trip._id, {
        isPublic: !trip.isPublic,
      });

      setItineraries((prev) =>
        prev.map((item) => (item._id === trip._id ? data.itinerary : item)),
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function copyShareLink(trip) {
    const url = `${window.location.origin}/share/${trip.shareId}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(trip._id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="myTripsPage">
      <Navbar />

      <main className="myTripsMain">
        <div className="myTripsHeader">
          <div>
            <h1>My Trips</h1>
            <p>View, manage, and share your saved itineraries.</p>
          </div>
          <Link to="/" className="myTripsNewButton">
            Plan a new trip
          </Link>
        </div>

        {loading && <p className="myTripsStatus">Loading your trips...</p>}
        {error && <p className="myTripsError">{error}</p>}

        {!loading && itineraries.length === 0 && (
          <div className="myTripsEmpty">
            <p>No saved trips yet.</p>
            <Link to="/">Start planning your first adventure</Link>
          </div>
        )}

        <div className="myTripsGrid">
          {itineraries.map((trip) => (
            <article key={trip._id} className="myTripsCard">
              <h2>{trip.title}</h2>
              <p className="myTripsMeta">
                Updated {new Date(trip.updatedAt).toLocaleDateString()}
              </p>
              <p className="myTripsMeta">
                {trip.isPublic ? "Shared with link" : "Private"}
              </p>

              <div className="myTripsActions">
                <button
                  type="button"
                  onClick={() => navigate(`/my-trips/${trip._id}`)}
                >
                  View
                </button>
                <button type="button" onClick={() => handleShareToggle(trip)}>
                  {trip.isPublic ? "Make private" : "Share"}
                </button>
                {trip.isPublic && (
                  <button type="button" onClick={() => copyShareLink(trip)}>
                    {copiedId === trip._id ? "Copied!" : "Copy link"}
                  </button>
                )}
                <button
                  type="button"
                  className="danger"
                  onClick={() => handleDelete(trip._id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
