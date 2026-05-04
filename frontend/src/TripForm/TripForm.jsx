import { useState } from "react";
import "./TripForm.css";

export default function TripForm() {
  const [formData, setFormData] = useState({
    destination: "",
    tripLengthL: "",
    budget: "",
  });

  const updateForm = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...TripForm,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("PRINTING");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Primary Destination:
        <input
          type="text"
          name="destination"
          value={formData.destination}
          onChange={() => updateForm}
        />
      </label>
      <label>
        Trip Length:
        <input
          type="number"
          name="tripLength"
          value={formData.tripLength}
          onChange={() => updateForm}
        />
      </label>
      <label>
        Budget:
        <input
          type="number"
          name="budget"
          value={formData.budget}
          onChange={() => updateForm}
        />
      </label>
      <button type="submit">Create Iternary</button>
    </form>
  );
}
