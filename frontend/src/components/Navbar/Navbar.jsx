import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext.jsx";
import "./Navbar.css";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbarBrand">
        Trippy
      </Link>

      <div className="navbarLinks">
        {isAuthenticated ? (
          <>
            <Link to="/my-trips">My Trips</Link>
            <span className="navbarUser">Hi, {user.name}</span>
            <button type="button" className="navbarButton" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register" className="navbarButton">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
