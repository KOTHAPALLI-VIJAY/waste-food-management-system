import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <h2>Waste Food Management</h2>

      <div className="nav-links">

        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>

        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <div
            className="user-menu"
            onClick={() => setShowMenu(!showMenu)}
          >
            👤 User ▼

            {showMenu && (
              <div className="dropdown">
                <p>{email}</p>

                <button onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;