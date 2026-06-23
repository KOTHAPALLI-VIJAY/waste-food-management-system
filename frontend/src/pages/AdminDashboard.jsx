import Navbar from "../components/Navbar";
import "../styles/AdminDashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalNGOs: 0,
    totalDonations: 0,
    acceptedDonations: 0,
    pendingDonations: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/stats"
      );

      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="admin-dashboard">
        <h1>Admin Dashboard 👨‍💼</h1>

        <div className="admin-stats">

          <div className="admin-card">
            <h2>{stats.totalUsers}</h2>
            <p>Total Users</p>
          </div>

          <div className="admin-card">
            <h2>{stats.totalNGOs}</h2>
            <p>Total NGOs</p>
          </div>

          <div className="admin-card">
            <h2>{stats.totalDonations}</h2>
            <p>Total Donations</p>
          </div>

          <div className="admin-card">
            <h2>{stats.acceptedDonations}</h2>
            <p>Accepted Donations</p>
          </div>

          <div className="admin-card">
            <h2>{stats.pendingDonations}</h2>
            <p>Pending Donations</p>
          </div>

        </div>

        <div className="admin-actions">

          <button
            onClick={() =>
              navigate("/manage-users")
            }
          >
            Manage Users
          </button>

          <button
            onClick={() =>
              navigate("/history")
            }
          >
            View Donations
          </button>

        </div>

      </div>
    </>
  );
}

export default AdminDashboard;