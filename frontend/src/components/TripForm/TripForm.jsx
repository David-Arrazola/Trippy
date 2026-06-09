import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "../../context/tripContext.jsx";
import { tripApi } from "../../utils/api.js";
import "./TripForm.css";

export default function TripForm() {
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { tripState, setTripState } = useTrip();
  const [userLocation, setUserLocation] = useState(null);

  // 👇 CHAT HISTORY (this is the big change)
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Where do you want to go?" },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Location access denied:", error);
      },
    );
  }, []);

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
    setIsLoading(true);

    try {
      const data = await tripApi.plan({
        userInput: userMessage,
        tripState,
        userLocation,
        clientDate: new Date().toLocaleDateString("en-CA"),
      });

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
      streamMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
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

        {isLoading && (
          <div className="chatMessage assistant loadingMessage">
            <strong>Red:</strong>
            <span className="typingIndicator" aria-label="Red is thinking">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
        )}
      </section>

      {/* INPUT */}
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter your response..."
          value={userInput}
          onChange={updateMessage}
          disabled={isLoading}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Thinking..." : "Send"}
        </button>
      </form>
    </>
  );
}
