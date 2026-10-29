import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import Navbar from "../components/Navbar";
import { 
  ShieldCheck, 
  Users, 
  Building, 
  Utensils, 
  Leaf, 
  Clock, 
  TrendingUp, 
  UserCog, 
  History,
  Activity,
  CheckCircle2
} from "lucide-react";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const adminName = localStorage.getItem("name") || "Platform Admin";

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonors: 0,
    totalNGOs: 0,
    totalDonations: 0,
    acceptedDonations: 0,
    pendingDonations: 0,
    claimedDonations: 0,
    mealsSaved: 0,
    co2SavedKg: 0,
  });

  const [recentListings, setRecentListings] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecent();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await apiClient.get("/admin/stats");
      setStats(res.data);
    } catch (error) {
      console.log("Error fetching admin stats:", error);
    }
  };

  const fetchRecent = async () => {
    try {
      const res = await apiClient.get("/donations");
      if (Array.isArray(res.data)) {
        setRecentListings(res.data.slice(0, 5));
      }
    } catch (error) {
      console.log("Error fetching recent donations:", error);
    }
  };

  return (
    <div className="admin-dashboard-page">
      <Navbar />

      <div className="app-container admin-main-content">
        {/* Header Card */}
        <div className="admin-header-card card-surface">
          <div>
            <div className="admin-pill-badge">
              <ShieldCheck size={14} /> System Command Center
            </div>
            <h1>Platform Administration 👨‍💼</h1>
            <p>Real-time analytics, user access verification, and auditable food rescue metrics.</p>
          </div>

          <div className="admin-top-actions">
            <button className="btn btn-secondary" onClick={() => navigate("/history")}>
              <History size={16} /> Audit All Transactions
            </button>
            <button className="btn btn-primary" onClick={() => navigate("/manage-users")}>
              <UserCog size={16} /> Manage User Directory
            </button>
          </div>
        </div>

        {/* KPI Metrics Grid */}
        <div className="admin-stats-grid">
          <div className="admin-metric-card card-surface">
            <div className="metric-icon-wrap purple">
              <Users size={24} />
            </div>
            <div>
              <span className="metric-val">{stats.totalUsers}</span>
              <span className="metric-name">Total Registered Users</span>
            </div>
          </div>

          <div className="admin-metric-card card-surface">
            <div className="metric-icon-wrap green">
              <Utensils size={24} />
            </div>
            <div>
              <span className="metric-val">{stats.totalDonors || 0}</span>
              <span className="metric-name">Verified Food Donors</span>
            </div>
          </div>

          <div className="admin-metric-card card-surface">
            <div className="metric-icon-wrap blue">
              <Building size={24} />
            </div>
            <div>
              <span className="metric-val">{stats.totalNGOs || 0}</span>
              <span className="metric-name">Certified Charity NGOs</span>
            </div>
          </div>

          <div className="admin-metric-card card-surface">
            <div className="metric-icon-wrap emerald">
              <Leaf size={24} />
            </div>
            <div>
              <span className="metric-val">{(stats.co2SavedKg || 0).toLocaleString()} kg</span>
              <span className="metric-name">CO2 Emissions Prevented</span>
            </div>
          </div>
        </div>

        {/* Live System Activity Feed */}
        <div className="admin-activity-section card-surface">
          <div className="activity-section-header">
            <div className="header-title-wrap">
              <Activity size={20} color="#059669" />
              <div>
                <h2>Live Transaction Stream</h2>
                <p>Latest surplus food postings and distribution status updates</p>
              </div>
            </div>

            <button className="btn btn-outline btn-sm" onClick={() => navigate("/history")}>
              View All Transactions
            </button>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Food Item</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Donor</th>
                  <th>NGO Partner</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentListings.map((item) => (
                  <tr key={item._id || item.id}>
                    <td>
                      <span className="table-txn-badge">{item.transactionId || `TXN-WFM-${item._id?.slice(-4) || '8041'}`}</span>
                    </td>
                    <td><strong>{item.foodName}</strong></td>
                    <td>{item.category || "Cooked Meals"}</td>
                    <td>{item.quantity}</td>
                    <td>{item.donorName || "Donor"}</td>
                    <td>{item.claimedByNgoName || "Awaiting Claim"}</td>
                    <td>
                      <span className={`badge badge-${(item.status || "Pending").toLowerCase()}`}>
                        {item.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;