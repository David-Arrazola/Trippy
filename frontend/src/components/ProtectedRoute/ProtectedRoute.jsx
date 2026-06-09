import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="pageLoader">
        <div className="typingIndicator" aria-label="Loading">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
