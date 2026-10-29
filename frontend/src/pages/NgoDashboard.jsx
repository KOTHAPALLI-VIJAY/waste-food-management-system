import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import Navbar from "../components/Navbar";
import { 
  Building, 
  MapPin, 
  Clock, 
  Utensils, 
  Search, 
  Filter, 
  Truck, 
  CheckCircle, 
  ExternalLink, 
  Key, 
  ShieldCheck,
  X,
  Phone,
  UserCheck
} from "lucide-react";
import "../styles/NgoDashboard.css";

function NgoDashboard() {
  const ngoName = localStorage.getItem("name") || "Charity Relief Partner";
  const ngoId = localStorage.getItem("userId") || "2";
  const ngoPhone = localStorage.getItem("phone") || "";

  const [donations, setDonations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dietaryFilter, setDietaryFilter] = useState("all");
  
  // Claim Modal state
  const [claimingDonation, setClaimingDonation] = useState(null);
  const [claimFormData, setClaimFormData] = useState({
    volunteerName: "",
    volunteerPhone: ngoPhone,
    estimatedPickupTime: "Within 45 mins",
    vehicleType: "Insulated Food Van",
  });

  // OTP Verification state
  const [verifyingId, setVerifyingId] = useState(null);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await apiClient.get("/donations");
      setDonations(res.data);
    } catch (error) {
      console.log("Error fetching donations:", error);
    }
  };

  const handleOpenClaimModal = (donation) => {
    setClaimingDonation(donation);
  };

  const submitClaim = async (e) => {
    e.preventDefault();
    if (!claimingDonation) return;

    try {
      await apiClient.put(`/donations/${claimingDonation._id || claimingDonation.id}/claim`, {
        ngoId,
        ngoName,
        volunteerName: claimFormData.volunteerName,
        volunteerPhone: claimFormData.volunteerPhone,
        estimatedPickupTime: claimFormData.estimatedPickupTime,
      });

      alert("🎉 Food rescue batch claimed! The donor has been notified with your volunteer details.");
      setClaimingDonation(null);
      fetchDonations();
    } catch (error) {
      console.error("Error claiming donation:", error);
      alert("Error claiming donation. Please try again.");
    }
  };

  const handleVerifyOtp = async (donationId) => {
    if (!enteredOtp || enteredOtp.length !== 4) {
      setOtpError("Please enter the complete 4-digit Handover OTP.");
      return;
    }

    try {
      await apiClient.post(`/donations/${donationId}/verify-otp`, {
        otp: enteredOtp,
      });

      alert("✅ Handover Confirmed! Food batch verified and marked as Distributed.");
      setVerifyingId(null);
      setEnteredOtp("");
      setOtpError("");
      fetchDonations();
    } catch (error) {
      console.error("OTP verification failed:", error);
      setOtpError(error.response?.data?.message || "Invalid OTP code. Please ask donor for the code.");
    }
  };

  const openMap = (latitude, longitude, locationName) => {
    if (latitude && longitude) {
      window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, "_blank");
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`, "_blank");
    }
  };

  // Filtered available listings (Pending)
  const availableListings = donations.filter((d) => {
    if (d.status !== "Pending") return false;
    const matchesSearch = 
      d.foodName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || d.category === categoryFilter;
    const matchesDietary = dietaryFilter === "all" || d.dietaryType === dietaryFilter;
    return matchesSearch && matchesCategory && matchesDietary;
  });

  // Claimed Dispatches
  const activeDispatches = donations.filter((d) => d.status === "Claimed");

  return (
    <div className="ngo-dashboard-page">
      <Navbar />

      <div className="app-container ngo-main-content">
        {/* Welcome Header */}
        <div className="ngo-header-card card-surface">
          <div>
            <div className="header-badge-row">
              <span className="role-badge ngo">Verified Charity Partner</span>
              <span className="verified-status"><ShieldCheck size={14} /> Active Relief Center</span>
            </div>
            <h1>{ngoName} • Rescue Hub 🏢</h1>
            <p>Discover real-time surplus edible food ready for pickup, dispatch volunteers, and verify physical handovers.</p>
          </div>
        </div>

        {/* Section 1: Active Claimed Dispatches Tracker */}
        {activeDispatches.length > 0 && (
          <div className="active-dispatches-section">
            <div className="section-title-with-count">
              <Truck size={22} color="#2563eb" />
              <h2>Active Collections & In-Transit Batches ({activeDispatches.length})</h2>
            </div>

            <div className="dispatches-grid">
              {activeDispatches.map((item) => (
                <div key={item._id || item.id} className="dispatch-card card-surface">
                  <div className="dispatch-header">
                    <span className="dispatch-txn">{item.transactionId || `TXN-WFM-${(item._id || item.id || '').slice(-4)}`}</span>
                    <span className="badge badge-claimed">🚚 Out For Collection</span>
                  </div>

                  <h3>{item.foodName}</h3>

                  <div className="dispatch-meta">
                    <p>📍 <strong>Pickup:</strong> {item.location}</p>
                    <p>🍱 <strong>Quantity:</strong> {item.quantity}</p>
                    <p>👤 <strong>Donor:</strong> {item.donorName} ({item.donorPhone || "Contact Donor"})</p>
                    <p>🚚 <strong>Assigned Driver:</strong> {item.volunteerName || "Relief Volunteer"}</p>
                  </div>

                  {/* Physical Handover OTP Verification Form */}
                  <div className="otp-verification-container">
                    {verifyingId === (item._id || item.id) ? (
                      <div className="otp-input-box animate-fade-in">
                        <label>Enter 4-Digit Handover OTP from Donor:</label>
                        <div className="otp-action-row">
                          <input
                            type="text"
                            maxLength="4"
                            className="form-input otp-field"
                            placeholder="e.g. 6934"
                            value={enteredOtp}
                            onChange={(e) => setEnteredOtp(e.target.value)}
                          />
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleVerifyOtp(item._id || item.id)}
                          >
                            Verify & Complete
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setVerifyingId(null);
                              setEnteredOtp("");
                              setOtpError("");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                        {otpError && <p className="otp-error-text">{otpError}</p>}
                      </div>
                    ) : (
                      <div className="otp-start-row">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setVerifyingId(item._id || item.id)}
                        >
                          <Key size={15} /> Confirm Handover with OTP
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => openMap(item.latitude, item.longitude, item.location)}
                        >
                          <ExternalLink size={14} /> Open GPS Route
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Available Food Marketplace */}
        <div className="marketplace-section">
          <div className="marketplace-header-row">
            <div>
              <h2>Surplus Food Marketplace</h2>
              <p>Browse fresh edible food listed by local businesses needing urgent collection.</p>
            </div>

            {/* Search and Filters */}
            <div className="marketplace-controls">
              <div className="search-input-box">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search food item or location..."
                  className="form-input search-field"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="form-select filter-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Cooked Meals">🍱 Cooked Meals</option>
                <option value="Bakery">🍞 Bakery</option>
                <option value="Fresh Produce">🥦 Fresh Produce</option>
                <option value="Packaged Goods">🥫 Packaged</option>
              </select>

              <select
                className="form-select filter-select"
                value={dietaryFilter}
                onChange={(e) => setDietaryFilter(e.target.value)}
              >
                <option value="all">All Dietary</option>
                <option value="Veg">🌱 Veg</option>
                <option value="Non-Veg">🍗 Non-Veg</option>
              </select>
            </div>
          </div>

          {/* Available Cards Grid */}
          <div className="available-donations-grid">
            {availableListings.length === 0 ? (
              <div className="no-listings-card card-surface">
                <Utensils size={40} color="#94a3b8" />
                <h3>No available donations matching your filters.</h3>
                <p>New surplus food notifications appear in real-time as donors post.</p>
              </div>
            ) : (
              availableListings.map((donation) => (
                <div key={donation._id || donation.id} className="available-card card-surface">
                  <div className="available-badge-row">
                    <span className={`badge ${donation.dietaryType === "Non-Veg" ? "badge-nonveg" : "badge-veg"}`}>
                      {donation.dietaryType || "Veg"}
                    </span>
                    <span className="badge badge-pending">
                      Ready for Collection
                    </span>
                  </div>

                  <h3 className="available-title">{donation.foodName}</h3>

                  <div className="available-details-list">
                    <div className="detail-item">
                      <Utensils size={15} />
                      <span><strong>{donation.quantity}</strong> ({donation.mealCount || 20} Servings)</span>
                    </div>
                    <div className="detail-item">
                      <Clock size={15} />
                      <span>{donation.pickupWindow || "Within 3 hours"}</span>
                    </div>
                    <div className="detail-item">
                      <MapPin size={15} />
                      <span className="truncate">{donation.location}</span>
                    </div>
                    <div className="detail-item donor-name">
                      <span>Donated by: <strong>{donation.donorName || "Institutional Donor"}</strong></span>
                    </div>
                  </div>

                  {donation.notes && (
                    <div className="handling-note">
                      <p>ℹ️ {donation.notes}</p>
                    </div>
                  )}

                  <div className="available-card-actions">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => openMap(donation.latitude, donation.longitude, donation.location)}
                    >
                      <ExternalLink size={14} /> Map
                    </button>
                    <button
                      className="btn btn-primary btn-sm flex-grow"
                      onClick={() => handleOpenClaimModal(donation)}
                    >
                      <Truck size={15} /> Claim & Dispatch
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Claim Donation Modal */}
      {claimingDonation && (
        <div className="claim-modal-backdrop" onClick={() => setClaimingDonation(null)}>
          <div className="claim-modal-card card-surface" onClick={(e) => e.stopPropagation()}>
            <button className="claim-close-btn" onClick={() => setClaimingDonation(null)}>
              <X size={20} />
            </button>

            <div className="claim-modal-header">
              <Truck size={28} color="#2563eb" />
              <div>
                <h2>Dispatch Volunteer for Collection</h2>
                <p>Batch: <strong>{claimingDonation.foodName}</strong></p>
              </div>
            </div>

            <form onSubmit={submitClaim} className="claim-form">
              <div className="form-group">
                <label className="form-label">Volunteer Driver Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={claimFormData.volunteerName}
                  onChange={(e) => setClaimFormData({ ...claimFormData, volunteerName: e.target.value })}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Driver Contact Phone *</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={claimFormData.volunteerPhone}
                    onChange={(e) => setClaimFormData({ ...claimFormData, volunteerPhone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Estimated Arrival Window</label>
                  <select
                    className="form-select"
                    value={claimFormData.estimatedPickupTime}
                    onChange={(e) => setClaimFormData({ ...claimFormData, estimatedPickupTime: e.target.value })}
                  >
                    <option value="Within 30 mins">⚡ Rapid (Within 30 mins)</option>
                    <option value="Within 45 mins">🚚 Standard (Within 45 mins)</option>
                    <option value="Within 1 hour">⏰ Scheduled (Within 1 hour)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Collection Vehicle Type</label>
                <select
                  className="form-select"
                  value={claimFormData.vehicleType}
                  onChange={(e) => setClaimFormData({ ...claimFormData, vehicleType: e.target.value })}
                >
                  <option value="Insulated Food Van">🚐 Insulated Food Van (Temperature Controlled)</option>
                  <option value="Two-Wheeler Carrier">🛵 Two-Wheeler Thermal Bag</option>
                  <option value="Volunteer Car">🚗 Volunteer Personal Vehicle</option>
                </select>
              </div>

              <div className="claim-notice-box">
                <p>
                  Upon claiming, the donor will be provided with your driver's contact. When your volunteer collects the food, they must collect the <strong>4-digit Handover OTP</strong> from the donor to verify delivery.
                </p>
              </div>

              <div className="claim-modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setClaimingDonation(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Claim & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default NgoDashboard;