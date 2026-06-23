import Navbar from "../components/Navbar";
import "../styles/DonorDashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function DonorDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalDonations: 0,
    pendingDonations: 0,
    acceptedDonations: 0,
  });

  const [donations, setDonations] = useState([]);

  const [formData, setFormData] = useState({
    foodName: "",
    quantity: "",
    expiryDate: "",
    location: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    fetchStats();
    fetchDonations();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/donations/stats"
      );

      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDonations = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/donations"
      );

      setDonations(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      console.log(formData);

      await axios.post(
        "http://localhost:5000/api/donations",
        formData
      );

      alert("Donation Added Successfully");

      setFormData({
        foodName: "",
        quantity: "",
        expiryDate: "",
        location: "",
        latitude: formData.latitude,
        longitude: formData.longitude,
      });

      fetchStats();
      fetchDonations();
    } catch (error) {
      console.log(error);
      alert("Error adding donation");
    }
  };

  return (
    <>
      <Navbar />

      <div className="dashboard">
        <h1>Welcome Donor 👋</h1>

        <div className="dashboard-actions">
  <button
    className="history-btn"
    onClick={() => navigate("/history")}
  >
    📋 View Donation History
  </button>
</div>

        <div className="stats">
          <div className="stat-card">
            <h2>{stats.totalDonations}</h2>
            <p>Total Donations</p>
          </div>

          <div className="stat-card">
            <h2>{stats.pendingDonations}</h2>
            <p>Pending</p>
          </div>

          <div className="stat-card">
            <h2>{stats.acceptedDonations}</h2>
            <p>Accepted</p>
          </div>
        </div>

        <div className="donation-form">
          <h2>Add Donation</h2>

          <input
            type="text"
            name="foodName"
            placeholder="Food Name"
            value={formData.foodName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
          />

          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
          />

          <button onClick={handleSubmit}>
            Submit Donation
          </button>
        </div>

        <div className="donation-table">
          <h2>Recent Donations</h2>

          <table>
            <thead>
              <tr>
                <th>Food</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {donations.map((donation) => (
                <tr key={donation._id}>
                  <td>{donation.foodName}</td>
                  <td>{donation.quantity}</td>
                  <td>{donation.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default DonorDashboard;