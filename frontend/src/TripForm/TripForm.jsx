const API = import.meta.env.VITE_API_URL;
import { useState } from "react";
import "./TripForm.css";

export default function TripForm() {
  const [message, setMessage] = useState("");

  const updateMessage = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="formStyle">
        <textarea
          placeholder="Where do you want to go?"
          name="destination"
          value={message}
          onChange={updateMessage}
        />
      </label>
      <button type="submit">Generate Trip</button>
    </form>
  );
}
