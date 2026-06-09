import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/landingPage.jsx";
import TripResults from "./pages/tripResults/tripResults.jsx";
import LoginPage from "./pages/Login/LoginPage.jsx";
import RegisterPage from "./pages/Register/RegisterPage.jsx";
import MyTripsPage from "./pages/MyTrips/MyTripsPage.jsx";
import SavedTripPage from "./pages/SavedTrip/SavedTripPage.jsx";
import SharedTripPage from "./pages/SharedTrip/SharedTripPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/trip-results" element={<TripResults />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/share/:shareId" element={<SharedTripPage />} />
        <Route
          path="/my-trips"
          element={
            <ProtectedRoute>
              <MyTripsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-trips/:id"
          element={
            <ProtectedRoute>
              <SavedTripPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
