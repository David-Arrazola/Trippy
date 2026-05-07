const API = import.meta.env.VITE_API_URL;
import { useState } from "react";
import "./TripForm.css";

export default function TripForm() {
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    returnDate: "",
    departureAirport: "",
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
      <label className="formStyle">
        Destination:
        <input
          type="text"
          name="destination"
          value={formData.destination}
          onChange={updateForm}
        />
      </label>
      <label className="formStyle">
        Departure Date:
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={updateForm}
        />
      </label>
      <label className="formStyle">
        Return Date:
        <input
          type="date"
          name="returnDate"
          value={formData.returnDate}
          onChange={updateForm}
        />
      </label>
      <label className="formStyle">
        Departure Airport:
        <input
          type="text"
          name="departureAirport"
          value={formData.departureAirport}
          onChange={updateForm}
        />
      </label>
      <label className="formStyle">
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
