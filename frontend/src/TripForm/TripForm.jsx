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
        Duration:
        <input
          type="number"
          name="tripLength"
          value={formData.tripLength}
          onChange={updateForm}
        />
      </label>
      <label className="formStyle">
        Budget:
        <select name="budget" onChange={updateForm}>
          <option></option>
          <option value="budget">Budget</option>
          <option value="balanced">Balanced</option>
          <option value="Luxury">Luxury</option>
        </select>
      </label>
      <button type="submit">Generate Trip</button>
    </form>
  );
}
