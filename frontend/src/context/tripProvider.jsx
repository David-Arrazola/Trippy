import { useState, useContext } from "react";
import { TripContext } from "./TripContext";

export function TripProvider({ children }) {
  const [trip, setTrip] = useState(null);

  return (
    <TripContext.Provider value={{ trip, setTrip }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  return useContext(TripContext);
}
