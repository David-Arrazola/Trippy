import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { TripProvider } from "./context/tripContext.jsx";

createRoot(document.getElementById("root")).render(
  <TripProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </TripProvider>,
);
