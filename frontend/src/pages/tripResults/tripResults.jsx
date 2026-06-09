import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "../../context/tripContext.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import TripDisplay from "../../components/TripDisplay/TripDisplay.jsx";
import SaveTripPanel from "../../components/SaveTripPanel/SaveTripPanel.jsx";
import "./TripResults.css";

export default function TripResults() {
  const { tripState } = useTrip();
  const navigate = useNavigate();

  useEffect(() => {
    if (!tripState) navigate("/");
  }, [tripState, navigate]);

  if (!tripState) return null;

  return (
    <>
      <Navbar />
      <TripDisplay
        tripState={tripState}
        headerExtra={<SaveTripPanel tripState={tripState} />}
      />
    </>
  );
}
