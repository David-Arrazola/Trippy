const API = import.meta.env.VITE_API_URL;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "../../context/tripContext.jsx";
import "./TripForm.css";

export default function TripForm() {
  const [userInput, setUserInput] = useState("");
  const { tripState, setTripState } = useTrip();

  const [assistantMessage, setAssistantMessage] = useState(
    "Where do you want to go?",
  );

  const navigate = useNavigate();

  const streamMessage = (message) => {
    let index = 0;

    setAssistantMessage("");

    const interval = setInterval(() => {
      setAssistantMessage(message.slice(0, index));

      index++;

      if (index > message.length) {
        clearInterval(interval);
      }
    }, 15);
  };

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

      // -------------------------
      // FOLLOW UP
      // -------------------------
      if (data.action === "ASK_FOLLOWUP") {
        if (data.followUpMessage) {
          streamMessage(data.followUpMessage);
        }

        if (data.trip) {
          setTripState(data.trip);
        }
      }

      // -------------------------
      // GENERATE TRIP
      // -------------------------
      if (data.action === "GENERATE_TRIP") {
        streamMessage("Generating your itinerary...");

        if (data.trip) {
          setTripState(data.trip);

          // Navigating to results page
          navigate("/trip-results");
        }
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
