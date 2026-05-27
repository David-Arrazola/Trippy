const API = import.meta.env.VITE_API_URL;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TripForm.css";

export default function TripForm() {
  const [userInput, setUserInput] = useState("");
  const [tripState, setTripState] = useState({});
  const [assistantMessage, setAssistantMessage] = useState(
    "Where do you want to go?",
  );

  const navigate = useNavigate();

  const updateMessage = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput,
          tripState,
        }),
      });

      const data = await response.json();

      console.log("SERVER RESPONSE:", data);

      // -------------------------
      // FOLLOW UP QUESTION
      // -------------------------
      if (data.action === "ASK_FOLLOWUP") {
        if (data.followUpMessage) {
          setAssistantMessage(data.followUpMessage);
        }

        if (data.tripData) {
          setTripState(data.tripData);
        }
      }

      // -------------------------
      // GENERATE TRIP → NAVIGATE
      // -------------------------
      if (data.action === "GENERATE_TRIP") {
        setAssistantMessage("Generating your itinerary...");

        console.log("FULL TRIP:", data.tripData);

        // 👉 NAVIGATE TO RESULTS PAGE
        navigate("/trip-results", {
          state: data.tripData,
        });
      }

      setUserInput("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <section>
        <h2>Assistant:</h2>
        <section id="assistantSection">{assistantMessage}</section>
      </section>

      <form onSubmit={handleSubmit}>
        <label className="formStyle">
          User Input:
          <textarea
            placeholder="Enter your response here!"
            value={userInput}
            onChange={updateMessage}
          />
        </label>

        <button type="submit">Send</button>
      </form>
    </>
  );
}
