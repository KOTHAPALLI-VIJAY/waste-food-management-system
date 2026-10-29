import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../api/apiClient";
import Navbar from "../components/Navbar";
import { 
  HeartHandshake, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle
} from "lucide-react";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errorMsg) setErrorMsg("");
  };

  const executeLogin = async (email, password) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiClient.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("email", res.data.user.email);
      localStorage.setItem("name", res.data.user.name);
      localStorage.setItem("userId", res.data.user._id || res.data.user.id);

      if (res.data.user.role === "donor") {
        navigate("/donor");
      } else if (res.data.user.role === "ngo") {
        navigate("/ngo");
      } else if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMsg(
        error.response?.data?.message || "Invalid credentials. Please verify your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    executeLogin(formData.email, formData.password);
  };

  return (
    <div className="auth-page-container">
      <Navbar />

      <div className="auth-split-wrapper">
        {/* Left Side: Brand Story */}
        <div className="auth-brand-side">
          <div className="auth-brand-content">
            <div className="brand-logo-inline">
              <HeartHandshake size={32} color="#10b981" />
              <span>ResQFood Platform</span>
            </div>

            <h2>Empowering Communities Through Smart Redistribution</h2>
            <p>
              Log in to list surplus food, track active collections in real time, or manage verified distribution networks.
            </p>

            <div className="auth-feature-list">
              <div className="feature-item">
                <CheckCircle2 size={18} color="#34d399" />
                <span>Instant dispatch alerts to 60+ verified NGOs</span>
              </div>
              <div className="feature-item">
                <CheckCircle2 size={18} color="#34d399" />
                <span>Secure 4-digit Handover OTP verification</span>
              </div>
              <div className="feature-item">
                <CheckCircle2 size={18} color="#34d399" />
                <span>Downloadable 80G tax exemption certificates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="auth-form-side">
          <div className="auth-card card-surface">
            <div className="auth-header">
              <h1>Welcome Back</h1>
              <p>Sign in to your ResQFood account</p>
            </div>

            {errorMsg && (
              <div className="auth-error-banner animate-fade-in">
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} className="field-icon" />
                  <input
                    type="email"
                    name="email"
                    className="form-input has-icon"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="field-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-input has-icon"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In to Account"}
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="auth-footer-prompt">
              <p>
                Don't have an account yet?{" "}
                <Link to="/register" className="auth-link">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;