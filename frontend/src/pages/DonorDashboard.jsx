import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import Navbar from "../components/Navbar";
import DonationReceiptModal from "../components/DonationReceiptModal";
import { 
  PlusCircle, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Leaf, 
  Printer, 
  Key, 
  Utensils, 
  Locate,
  History,
  TrendingUp,
  Truck,
  ShieldCheck,
  Package
} from "lucide-react";
import "../styles/DonorDashboard.css";

function DonorDashboard() {
  const navigate = useNavigate();
  const donorName = localStorage.getItem("name") || "Food Donor";
  const donorEmail = localStorage.getItem("email") || "";
  const donorPhone = localStorage.getItem("phone") || "";
  const donorId = localStorage.getItem("userId") || "1";

  const [stats, setStats] = useState({
    totalDonations: 0,
    pendingDonations: 0,
    acceptedDonations: 0,
    mealsSaved: 0,
    co2SavedKg: 0,
  });

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [locationDetecting, setLocationDetecting] = useState(false);

  const [formData, setFormData] = useState({
    foodName: "",
    category: "Cooked Meals",
    dietaryType: "Veg",
    quantity: "",
    mealCount: "",
    expiryDate: "",
    pickupWindow: "Ready now - collect within 3 hours",
    location: localStorage.getItem("location") || "",
    latitude: null,
    longitude: null,
    donorPhone: donorPhone,
    notes: "",
  });

  useEffect(() => {
    fetchStats();
    fetchDonations();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await apiClient.get("/donations/stats");
      setStats({
        totalDonations: res.data.totalDonations || 0,
        pendingDonations: res.data.pendingDonations || 0,
        acceptedDonations: res.data.acceptedDonations || 0,
        mealsSaved: res.data.mealsSaved || 0,
        co2SavedKg: res.data.co2SavedKg || 0,
      });
    } catch (error) {
      console.log("Error fetching stats:", error);
    }
  };

  const fetchDonations = async () => {
    try {
      const res = await apiClient.get("/donations");
      setDonations(res.data);
    } catch (error) {
      console.log("Error fetching donations:", error);
    }
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      setLocationDetecting(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            location: `GPS: Lat ${position.coords.latitude.toFixed(4)}, Long ${position.coords.longitude.toFixed(4)}`,
          }));
          setLocationDetecting(false);
        },
        (error) => {
          console.log("Geolocation error:", error);
          setLocationDetecting(false);
          alert("Could not detect GPS location. Please enter your address manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.foodName || !formData.quantity) {
      alert("Please provide the food item name and quantity.");
      return;
    }

    setLoading(true);
    try {
      await apiClient.post("/donations", {
        ...formData,
        donorName,
        donorPhone: donorPhone || formData.donorPhone || "+91 98765 00000",
        donorId,
        mealCount: Number(formData.mealCount) || parseInt(formData.quantity) || 10,
      });

      alert("Food donation listed successfully! Partner NGOs have been alerted.");

      setFormData({
        foodName: "",
        category: "Cooked Meals",
        dietaryType: "Veg",
        quantity: "",
        mealCount: "",
        expiryDate: "",
        pickupWindow: "Ready now - collect within 3 hours",
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        notes: "",
      });

      fetchStats();
      fetchDonations();
    } catch (error) {
      console.error("Error creating donation:", error);
      alert("Error adding donation. Please verify server connection.");
    } finally {
      setLoading(false);
    }
  };

  const filteredDonations = donations.filter((d) => {
    if (activeTab === "pending") return d.status === "Pending";
    if (activeTab === "claimed") return d.status === "Claimed";
    if (activeTab === "accepted") return d.status === "Accepted";
    return true;
  });

  const estimatedMeals = Number(formData.mealCount) || parseInt(formData.quantity) || 0;
  const estimatedCo2 = (estimatedMeals * 1.8).toFixed(1);

  return (
    <div className="donor-dashboard-page">
      <Navbar />

      <div className="app-container dashboard-main-content">
        {/* Welcome Header */}
        <div className="dashboard-header-card card-surface">
          <div className="header-user-info">
            <span className="role-badge">Verified Food Donor</span>
            <h1>Welcome, {donorName}</h1>
            <p>List surplus edible food, view live collection progress, and share Handover OTPs with NGO drivers.</p>
          </div>
          <div className="header-quick-actions">
            <button className="btn btn-secondary" onClick={() => navigate("/history")}>
              <History size={16} /> View All Transactions
            </button>
          </div>
        </div>

        {/* Stats KPI Cards */}
        <div className="donor-stats-grid">
          <div className="stat-metric-card card-surface">
            <div className="stat-icon-wrapper green">
              <TrendingUp size={22} />
            </div>
            <div>
              <span className="metric-number">{stats.totalDonations}</span>
              <span className="metric-title">Total Donations</span>
            </div>
          </div>

          <div className="stat-metric-card card-surface">
            <div className="stat-icon-wrapper amber">
              <Clock size={22} />
            </div>
            <div>
              <span className="metric-number">{stats.pendingDonations}</span>
              <span className="metric-title">Awaiting NGO Claim</span>
            </div>
          </div>

          <div className="stat-metric-card card-surface">
            <div className="stat-icon-wrapper blue">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <span className="metric-number">{stats.acceptedDonations}</span>
              <span className="metric-title">Delivered & Fed</span>
            </div>
          </div>

          <div className="stat-metric-card card-surface">
            <div className="stat-icon-wrapper emerald">
              <Leaf size={22} />
            </div>
            <div>
              <span className="metric-number">
                {`${stats.co2SavedKg || 0} kg`}
              </span>
              <span className="metric-title">CO₂ Emissions Prevented</span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Section: Form & Live Listings */}
        <div className="donor-content-grid">
          {/* Left Column: Post Surplus Food Form */}
          <div className="donation-form-panel card-surface">
            <div className="form-panel-header">
              <PlusCircle size={22} color="#059669" />
              <div>
                <h2>Donate Surplus Food</h2>
                <p>Broadcasts instant notifications to verified local NGO shelters</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="post-food-form">
              {/* Section 1: Food Information */}
              <div className="form-fieldset">
                <div className="fieldset-legend">
                  <Utensils size={15} color="#059669" />
                  <span>1. Food Information</span>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Food Item Name / Description <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    name="foodName"
                    className="form-input"
                    placeholder="e.g. Buffet Rice, Dal, Mixed Veg Curry & Rotis"
                    value={formData.foodName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      name="category"
                      className="form-select"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="Cooked Meals">🍱 Cooked Meals</option>
                      <option value="Bakery">🍞 Fresh Bakery & Breads</option>
                      <option value="Fresh Produce">🥦 Fresh Produce / Vegetables</option>
                      <option value="Packaged Goods">🥫 Packaged Dry Groceries</option>
                      <option value="Beverages">🧃 Juices & Beverages</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Dietary Type</label>
                    <select
                      name="dietaryType"
                      className="form-select"
                      value={formData.dietaryType}
                      onChange={handleChange}
                    >
                      <option value="Veg">🌱 Vegetarian</option>
                      <option value="Non-Veg">🍗 Non-Vegetarian</option>
                      <option value="Vegan">🥗 Vegan</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">
                      Quantity / Volume <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      name="quantity"
                      className="form-input"
                      placeholder="e.g. 50 Meals / 25 kg / 4 Cartons"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Estimated Servings (Plates)</label>
                    <input
                      type="number"
                      name="mealCount"
                      className="form-input"
                      placeholder="e.g. 50"
                      value={formData.mealCount}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Safety & Collection */}
              <div className="form-fieldset">
                <div className="fieldset-legend">
                  <ShieldCheck size={15} color="#059669" />
                  <span>2. Safety & Collection Details</span>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Best-Before / Expiry Time</label>
                    <input
                      type="datetime-local"
                      name="expiryDate"
                      className="form-input"
                      value={formData.expiryDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Pickup Window</label>
                    <input
                      type="text"
                      name="pickupWindow"
                      className="form-input"
                      placeholder="e.g. Ready now - collect within 3 hours"
                      value={formData.pickupWindow}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="location-label-row">
                    <label className="form-label">
                      Pickup Address & Location <span className="required-star">*</span>
                    </label>
                    <button
                      type="button"
                      className="btn-locate-auto"
                      onClick={handleDetectLocation}
                      disabled={locationDetecting}
                    >
                      <Locate size={13} />
                      {locationDetecting ? "Detecting GPS..." : "Auto-Detect My GPS"}
                    </button>
                  </div>
                  <input
                    type="text"
                    name="location"
                    className="form-input"
                    placeholder="Street, Landmark, City"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Packaging & Special Handling</label>
                  <textarea
                    rows={2}
                    name="notes"
                    className="form-textarea"
                    placeholder="e.g. Packed in hot insulated containers. Please bring transport crates."
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Live Impact Preview */}
              {estimatedMeals > 0 && (
                <div className="form-impact-preview">
                  <Leaf size={16} color="#059669" />
                  <span>
                    This listing can feed approximately <strong>{estimatedMeals} people</strong> and prevent <strong>{estimatedCo2} kg</strong> of CO₂ emissions.
                  </span>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
                <PlusCircle size={18} />
                {loading ? "Listing Food Batch..." : "Submit Surplus Donation"}
              </button>
            </form>
          </div>

          {/* Right Column: Active Listings & Handover Codes */}
          <div className="active-donations-panel card-surface">
            <div className="panel-header-tabs">
              <div>
                <h2>Your Donation Batches</h2>
                <p>Track status and share Handover OTP with assigned drivers</p>
              </div>

              <div className="filter-pill-tabs">
                <button
                  className={`pill-tab ${activeTab === "all" ? "active" : ""}`}
                  onClick={() => setActiveTab("all")}
                >
                  All ({donations.length})
                </button>
                <button
                  className={`pill-tab ${activeTab === "pending" ? "active" : ""}`}
                  onClick={() => setActiveTab("pending")}
                >
                  Pending
                </button>
                <button
                  className={`pill-tab ${activeTab === "claimed" ? "active" : ""}`}
                  onClick={() => setActiveTab("claimed")}
                >
                  Claimed
                </button>
                <button
                  className={`pill-tab ${activeTab === "accepted" ? "active" : ""}`}
                  onClick={() => setActiveTab("accepted")}
                >
                  Delivered
                </button>
              </div>
            </div>

            <div className="donations-listing-stream">
              {filteredDonations.length === 0 ? (
                <div className="empty-state-box">
                  <Package size={36} color="#94A3B8" />
                  <h3>No donations in this view</h3>
                  <p>When you list food surplus, active status updates and OTP codes will display here.</p>
                </div>
              ) : (
                filteredDonations.map((item) => (
                  <div key={item._id || item.id} className="donor-listing-item card-surface">
                    <div className="item-top-row">
                      <div className="item-title-group">
                        <span className="item-txn-id">{item.transactionId || `TXN-WFM-${item._id?.slice(-4) || '8041'}`}</span>
                        <h3>{item.foodName}</h3>
                      </div>
                      <span className={`badge badge-${(item.status || "Pending").toLowerCase()}`}>
                        {item.status || "Pending"}
                      </span>
                    </div>

                    <div className="item-specs-grid">
                      <div>
                        <span className="spec-label">Quantity</span>
                        <span className="spec-val">{item.quantity}</span>
                      </div>
                      <div>
                        <span className="spec-label">Category</span>
                        <span className="spec-val">{item.category || "Cooked Meals"} ({item.dietaryType || "Veg"})</span>
                      </div>
                      <div>
                        <span className="spec-label">Location</span>
                        <span className="spec-val truncate">{item.location}</span>
                      </div>
                      <div>
                        <span className="spec-label">Pickup Window</span>
                        <span className="spec-val">{item.pickupWindow || "Ready"}</span>
                      </div>
                    </div>

                    {/* Claimed Status details or Handover OTP */}
                    {item.status === "Claimed" && (
                      <div className="claimed-dispatch-banner">
                        <div className="claimed-info">
                          <Truck size={18} color="#6D28D9" />
                          <div>
                            <strong>{item.claimedByNgoName || "Verified NGO Partner"}</strong>
                            <p>Driver: {item.volunteerName || "Dispatch Volunteer"} • {item.estimatedPickupTime || "ETA 30m"}</p>
                          </div>
                        </div>
                        <div className="otp-handover-box">
                          <span className="otp-label">Handover OTP:</span>
                          <span className="otp-digits">{item.otp || "4821"}</span>
                          <small>Give this code to the driver upon collection</small>
                        </div>
                      </div>
                    )}

                    {item.status === "Pending" && (
                      <div className="pending-otp-preview">
                        <span className="otp-label">Security Handover OTP:</span>
                        <span className="otp-digits">{item.otp || "4821"}</span>
                        <span>(Share with driver once claimed)</span>
                      </div>
                    )}

                    {item.status === "Accepted" && (
                      <div className="delivered-banner">
                        <div className="delivered-text">
                          <CheckCircle2 size={18} color="#059669" />
                          <span>Delivered & Distributed by {item.claimedByNgoName || "Charity Partner"}</span>
                        </div>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setSelectedReceipt(item)}
                        >
                          <Printer size={14} /> 80G Certificate
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 80G Tax Exemption & Donation Certificate Modal */}
      {selectedReceipt && (
        <DonationReceiptModal
          donation={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}

export default DonorDashboard;
