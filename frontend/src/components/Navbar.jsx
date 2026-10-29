import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { 
  HeartHandshake, 
  Menu, 
  X, 
  LogOut, 
  User, 
  Clock, 
  LayoutDashboard, 
  PlusCircle, 
  ShoppingBag, 
  ShieldCheck,
  ChevronDown,
  Users
} from "lucide-react";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");
  const name = localStorage.getItem("name") || email?.split("@")[0] || "User";

  const [showMenu, setShowMenu] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
    setShowMenu(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (role === "donor") return "/donor";
    if (role === "ngo") return "/ngo";
    if (role === "admin") return "/admin";
    return "/";
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="app-navbar-wrapper">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <HeartHandshake size={22} color="#FFFFFF" />
          </div>
          <div className="brand-text">
            <span className="brand-title">
              ResQ<span className="brand-highlight">Food</span>
            </span>
            <span className="brand-subtitle">WASTE FOOD RESCUE</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="desktop-nav-links">
          <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
            Home
          </Link>
          <Link to="/about" className={`nav-link ${isActive("/about") ? "active" : ""}`}>
            About
          </Link>
          <Link to="/contact" className={`nav-link ${isActive("/contact") ? "active" : ""}`}>
            Contact
          </Link>

          {token && (
            <>
              <Link 
                to={getDashboardPath()} 
                className={`nav-link ${isActive(getDashboardPath()) ? "active" : ""}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/history" 
                className={`nav-link ${isActive("/history") || isActive("/transactions") ? "active" : ""}`}
              >
                Transactions
              </Link>
              {role === "admin" && (
                <Link 
                  to="/manage-users" 
                  className={`nav-link ${isActive("/manage-users") ? "active" : ""}`}
                >
                  Users
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Action Buttons & Profile */}
        <div className="navbar-actions">
          {!token ? (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/login" className="btn btn-primary btn-sm nav-donate-cta">
                <PlusCircle size={15} /> Donate Food
              </Link>
            </div>
          ) : (
            <div className="authenticated-actions">
              {role === "donor" && (
                <Link to="/donor" className="btn btn-primary btn-sm action-cta-btn">
                  <PlusCircle size={15} /> Donate Food
                </Link>
              )}
              {role === "ngo" && (
                <Link to="/ngo" className="btn btn-primary btn-sm action-cta-btn">
                  <ShoppingBag size={15} /> Available Food
                </Link>
              )}
              {role === "admin" && (
                <Link to="/admin" className="btn btn-primary btn-sm action-cta-btn">
                  <ShieldCheck size={15} /> Admin Console
                </Link>
              )}

              {/* User Dropdown */}
              <div className="user-profile-menu" ref={dropdownRef}>
                <button
                  className="user-profile-trigger"
                  onClick={() => setShowMenu(!showMenu)}
                  aria-expanded={showMenu}
                >
                  <div className={`user-avatar-circle role-${role}`}>
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-details-preview">
                    <span className="user-name-label">{name}</span>
                    <span className={`role-pill role-${role}`}>{role?.toUpperCase()}</span>
                  </div>
                  <ChevronDown size={14} className={`chevron-icon ${showMenu ? "rotate" : ""}`} />
                </button>

                {showMenu && (
                  <div className="user-dropdown-panel animate-fade-in">
                    <div className="dropdown-user-header">
                      <p className="header-name">{name}</p>
                      <p className="header-email">{email}</p>
                      <span className={`header-role-badge role-${role}`}>
                        {role === "donor" ? "Verified Food Donor" : role === "ngo" ? "NGO Partner Relief" : "System Administrator"}
                      </span>
                    </div>

                    <div className="dropdown-divider"></div>

                    <div className="dropdown-links">
                      <Link to={getDashboardPath()} className="dropdown-item">
                        <LayoutDashboard size={15} /> My Dashboard
                      </Link>
                      <Link to="/history" className="dropdown-item">
                        <Clock size={15} /> Transactions & Tracking
                      </Link>
                      {role === "admin" && (
                        <Link to="/manage-users" className="dropdown-item">
                          <Users size={15} /> Manage Users Directory
                        </Link>
                      )}
                    </div>

                    <div className="dropdown-divider"></div>

                    <button className="dropdown-logout-btn" onClick={handleLogout}>
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button 
            className="mobile-hamburger-btn" 
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="mobile-drawer animate-fade-in">
          <div className="mobile-drawer-links">
            <Link to="/" className={`mobile-nav-link ${isActive("/") ? "active" : ""}`}>
              Home
            </Link>
            <Link to="/about" className={`mobile-nav-link ${isActive("/about") ? "active" : ""}`}>
              About Mission
            </Link>
            <Link to="/contact" className={`mobile-nav-link ${isActive("/contact") ? "active" : ""}`}>
              Contact Us
            </Link>

            {token ? (
              <>
                <Link to={getDashboardPath()} className="mobile-nav-link">
                  Dashboard ({role?.toUpperCase()})
                </Link>
                <Link to="/history" className="mobile-nav-link">
                  Transactions & Fulfillment
                </Link>
                {role === "admin" && (
                  <Link to="/manage-users" className="mobile-nav-link">
                    Manage User Accounts
                  </Link>
                )}
                <button className="btn btn-secondary mobile-logout-btn" onClick={handleLogout}>
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            ) : (
              <div className="mobile-auth-actions">
                <Link to="/login" className="btn btn-secondary w-full">
                  Sign In
                </Link>
                <Link to="/login" className="btn btn-primary w-full">
                  <PlusCircle size={15} /> Donate Food
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
