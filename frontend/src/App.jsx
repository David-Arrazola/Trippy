import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import TripResults from "./pages/TripResults";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/trip-results" element={<TripResults />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
