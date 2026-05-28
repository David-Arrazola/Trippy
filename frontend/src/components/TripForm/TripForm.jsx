const API = import.meta.env.VITE_API_URL;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "../../context/tripContext.jsx";
import "./TripForm.css";

export default function TripForm() {
  const [userInput, setUserInput] = useState("");
  const { tripState, setTripState } = useTrip();

  // 👇 CHAT HISTORY (this is the big change)
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Where do you want to go?" },
  ]);

  const navigate = useNavigate();

  // STREAMING FUNCTION
  const streamMessage = (message) => {
    let index = 0;

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const interval = setInterval(() => {
      index++;

      setMessages((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];

        copy[copy.length - 1] = {
          ...last,
          content: message.slice(0, index),
        };

        return copy;
      });

      if (index >= message.length) {
        clearInterval(interval);
      }
    }, 15);
  };

  const updateMessage = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userInput.trim()) return;

    // 1. Add user message to chat
    const userMessage = userInput;

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    setUserInput("");

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput: userMessage,
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

          setTimeout(() => {
            navigate("/trip-results");
          }, 1000);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* CHAT WINDOW */}
      <section className="chatBox">
        {messages.map((msg, index) => (
          <div key={index} className={`chatMessage ${msg.role}`}>
            <strong>{msg.role === "user" ? "Me" : "Red"}:</strong> {msg.content}
          </div>
        ))}
      </section>

      {/* INPUT */}
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter your response..."
          value={userInput}
          onChange={updateMessage}
        />

        <button type="submit">Send</button>
      </form>
    </>
  );
}
