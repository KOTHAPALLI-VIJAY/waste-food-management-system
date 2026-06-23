import Navbar from "../components/Navbar";
import "../styles/Register.css";
import registerBg from "../assets/register.jpg";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
        }
      );

      alert(res.data.message);

      navigate("/login");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Registration Failed"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div
        className="register-page"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${registerBg})`,
        }}
      >
        <div className="register-container">
          <div className="register-card">
            <h1>Register</h1>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
            />

            <select
              name="role"
              onChange={handleChange}
            >
              <option value="">
                Select Role
              </option>

              <option value="donor">
                Donor
              </option>

              <option value="ngo">
                NGO
              </option>
            </select>

            <button onClick={handleSubmit}>
              Register
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;