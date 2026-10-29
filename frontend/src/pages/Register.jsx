import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../api/apiClient";
import Navbar from "../components/Navbar";
import { 
  HeartHandshake, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Building, 
  Utensils, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "donor",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setErrorMsg("Please complete all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await apiClient.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });

      setSuccessMsg("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMsg(
        error.response?.data?.message || "Registration failed. Please check details or try another email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <Navbar />

      <div className="register-wrapper">
        <div className="register-card card-surface">
          <div className="auth-header text-center">
            <h1>Join the ResQFood Network</h1>
            <p>Select your organization type and get started in 2 minutes</p>
          </div>

          {/* Role Selection Tabs */}
          <div className="role-selector-tabs">
            <button
              type="button"
              className={`role-tab ${formData.role === "donor" ? "active" : ""}`}
              onClick={() => setFormData({ ...formData, role: "donor" })}
            >
              <Utensils size={20} />
              <div>
                <strong>Food Donor</strong>
                <span>Restaurant, Hotel, Caterer, Household</span>
              </div>
            </button>

            <button
              type="button"
              className={`role-tab ${formData.role === "ngo" ? "active" : ""}`}
              onClick={() => setFormData({ ...formData, role: "ngo" })}
            >
              <Building size={20} />
              <div>
                <strong>NGO / Food Charity</strong>
                <span>Shelter, Relief Bank, Community Kitchen</span>
              </div>
            </button>
          </div>

          {errorMsg && (
            <div className="auth-error-banner animate-fade-in">
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="auth-success-banner animate-fade-in">
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label className="form-label">
                {formData.role === "donor" ? "Donor / Organization Name" : "NGO / Charity Name"}
              </label>
              <div className="input-with-icon">
                <User size={18} className="field-icon" />
                <input
                  type="text"
                  name="name"
                  className="form-input has-icon"
                  placeholder={formData.role === "donor" ? "e.g. Grand Feast Hotel / Rajesh Sharma" : "e.g. Feeding Hope Foundation"}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Official Email</label>
                <div className="input-with-icon">
                  <Mail size={18} className="field-icon" />
                  <input
                    type="email"
                    name="email"
                    className="form-input has-icon"
                    placeholder="contact@organization.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="input-with-icon">
                  <Phone size={18} className="field-icon" />
                  <input
                    type="tel"
                    name="phone"
                    className="form-input has-icon"
                    placeholder="+91 98765 00000"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="field-icon" />
                  <input
                    type="password"
                    name="password"
                    className="form-input has-icon"
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="field-icon" />
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-input has-icon"
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Create Verified Account"}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-footer-prompt text-center">
            <p>
              Already registered?{" "}
              <Link to="/login" className="auth-link">
                Sign In here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;