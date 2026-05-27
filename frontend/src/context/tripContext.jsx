import { createContext, useContext, useState } from "react";

const TripContext = createContext();

export function TripProvider({ children }) {
  const [trip, setTrip] = useState(null);

  return (
    <TripContext.Provider value={{ trip, setTrip }}>
      {children}
    </TripContext.Provider>
  );
}

// hook is NOT a component, but it's fine
// eslint-disable-next-line react-refresh/only-export-components
export function useTrip() {
  return useContext(TripContext);
}
