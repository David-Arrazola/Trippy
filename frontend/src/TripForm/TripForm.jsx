const API = import.meta.env.VITE_API_URL;
import { useState } from "react";
import "./TripForm.css";

export default function TripForm() {
  const [formData, setFormData] = useState({
    destination: "",
    tripLength: "",
    budget: "",
  });

  const updateForm = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Destination:
        <input
          type="text"
          name="destination"
          value={formData.destination}
          onChange={updateForm}
        />
      </label>
      <label>
        Duration:
        <input
          type="number"
          name="tripLength"
          value={formData.tripLength}
          onChange={updateForm}
        />
      </label>
      <label>
        Budget:
        <input
          type="number"
          name="budget"
          value={formData.budget}
          onChange={updateForm}
        />
      </label>
      <button type="submit">Generate Trip</button>
    </form>
  );
}
