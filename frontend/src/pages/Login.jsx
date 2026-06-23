import Navbar from "../components/Navbar";
import "../styles/Login.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import loginBg from "../assets/login.png";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      console.log(res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("email", res.data.user.email);
      localStorage.setItem("name", res.data.user.name);

      alert("Login Successful");

      if (res.data.user.role === "donor") {
        navigate("/donor");
      } else if (res.data.user.role === "ngo") {
        navigate("/ngo");
      } else {
        navigate("/admin");
      }
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div
        className="login-page"
        style={{
          backgroundImage: `linear-gradient(
            rgba(0,0,0,0.4),
            rgba(0,0,0,0.4)
          ), url(${loginBg})`,
        }}
      >
        <div className="login-container">
          <div className="login-card">
            <h1>Login</h1>

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
            />

            <button onClick={handleSubmit}>
              Login
            </button>

            <p>
              Don't have an account?{" "}
              <Link to="/register">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;