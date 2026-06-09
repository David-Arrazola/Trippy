import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { TripProvider } from "./context/tripContext.jsx";
import { AuthProvider } from "./context/authContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <TripProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </TripProvider>
  </AuthProvider>,
);
