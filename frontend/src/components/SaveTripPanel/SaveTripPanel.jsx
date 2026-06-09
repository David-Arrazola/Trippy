import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext.jsx";
import { itineraryApi } from "../../utils/api.js";
import "./SaveTripPanel.css";

export default function SaveTripPanel({ tripState }) {
  const { isAuthenticated } = useAuth();
  const [savedItinerary, setSavedItinerary] = useState(null);
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const destination =
    tripState?.itinerary?.trip_summary?.destination || "My Trip";

  async function handleSave() {
    setLoading(true);
    setMessage("");

    try {
      const data = await itineraryApi.create({
        title: title.trim() || `${destination} Trip`,
        tripData: tripState,
        isPublic,
      });

      setSavedItinerary(data.itinerary);
      setIsPublic(data.itinerary.isPublic);
      setMessage("Trip saved to your profile!");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleShareToggle() {
    if (!savedItinerary) return;

    const nextPublic = !isPublic;
    setLoading(true);
    setMessage("");

    try {
      const data = await itineraryApi.update(savedItinerary._id, {
        isPublic: nextPublic,
      });

      setSavedItinerary(data.itinerary);
      setIsPublic(nextPublic);
      setMessage(nextPublic ? "Trip is now shareable!" : "Trip is private again.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function copyShareLink() {
    if (!savedItinerary?.shareId) return;

    const url = `${window.location.origin}/share/${savedItinerary.shareId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!isAuthenticated) {
    return (
      <div className="saveTripPanel">
        <Link to="/login" className="saveTripButton">
          Log in to save this trip
        </Link>
      </div>
    );
  }

  return (
    <div className="saveTripPanel">
      {!savedItinerary ? (
        <>
          <input
            type="text"
            placeholder={`${destination} Trip`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="saveTripInput"
          />
          <label className="saveTripCheckbox">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Make shareable after saving
          </label>
          <button
            type="button"
            className="saveTripButton"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save trip"}
          </button>
        </>
      ) : (
        <>
          <span className="saveTripSaved">Saved</span>
          <button
            type="button"
            className="saveTripButton secondary"
            onClick={handleShareToggle}
            disabled={loading}
          >
            {isPublic ? "Make private" : "Share with friends"}
          </button>
          {isPublic && (
            <button
              type="button"
              className="saveTripButton"
              onClick={copyShareLink}
            >
              {copied ? "Link copied!" : "Copy share link"}
            </button>
          )}
        </>
      )}

      {message && <p className="saveTripMessage">{message}</p>}
    </div>
  );
}
