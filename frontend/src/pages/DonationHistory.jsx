import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import Navbar from "../components/Navbar";
import DonationReceiptModal from "../components/DonationReceiptModal";
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Key, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import "../styles/DonationHistory.css";

function DonationHistory() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/donations/history");
      setDonations(res.data);
    } catch (error) {
      console.log("Error fetching transaction history:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = donations.filter((item) => {
    const matchesSearch = 
      item.foodName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && item.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  const exportCSV = () => {
    const headers = "TransactionID,FoodName,Category,Quantity,Donor,NGO,Status,Date\n";
    const rows = donations.map(d => 
      `"${d.transactionId || ''}","${d.foodName || ''}","${d.category || ''}","${d.quantity || ''}","${d.donorName || ''}","${d.claimedByNgoName || ''}","${d.status || ''}","${new Date(d.createdAt).toLocaleDateString()}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ResQFood_Transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="transactions-hub-page">
      <Navbar />

      <div className="app-container transactions-main-content">
        {/* Page Header */}
        <div className="transactions-header-row">
          <div>
            <div className="header-eyebrow">
              <History size={16} />
              <span>AUDITABLE RELIEF LEDGER</span>
            </div>
            <h1>Transactions & Fulfillment Hub</h1>
            <p>End-to-end lifecycle tracking, Handover OTP records, and official tax certificates.</p>
          </div>

          <div className="header-actions">
            <button className="btn btn-secondary" onClick={exportCSV}>
              <Download size={16} /> Export CSV Audit Log
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="transactions-toolbar card-surface">
          <div className="toolbar-search">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by Transaction ID (e.g. TXN-WFM-8421), food, or donor..."
              className="form-input search-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="toolbar-filters">
            <button
              className={`filter-btn ${statusFilter === "all" ? "active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              All Batches ({donations.length})
            </button>
            <button
              className={`filter-btn ${statusFilter === "pending" ? "active" : ""}`}
              onClick={() => setStatusFilter("pending")}
            >
              Pending
            </button>
            <button
              className={`filter-btn ${statusFilter === "claimed" ? "active" : ""}`}
              onClick={() => setStatusFilter("claimed")}
            >
              In Transit
            </button>
            <button
              className={`filter-btn ${statusFilter === "accepted" ? "active" : ""}`}
              onClick={() => setStatusFilter("accepted")}
            >
              Completed / Delivered
            </button>
          </div>
        </div>

        {/* Transactions Stream / Cards */}
        <div className="transactions-stream">
          {loading ? (
            <div className="loading-card card-surface">
              <p>Loading transactions ledger...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-transactions-card card-surface">
              <History size={40} color="#94a3b8" />
              <h3>No transaction records matching criteria</h3>
              <p>Try searching with another term or filter.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div key={item._id || item.id} className="transaction-card card-surface">
                {/* Transaction Card Top Bar */}
                <div className="txn-card-top">
                  <div className="txn-meta-group">
                    <span className="txn-id-badge">{item.transactionId || `TXN-WFM-${item._id?.slice(-4) || '8041'}`}</span>
                    <span className="txn-date-stamp">
                      Listed: {new Date(item.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  <div className="txn-status-badge-wrap">
                    <span className={`badge badge-${(item.status || "Pending").toLowerCase()}`}>
                      {item.status === "Accepted" ? "Delivered & Distributed" : item.status === "Claimed" ? "In Transit / Claimed" : "Awaiting NGO Claim"}
                    </span>
                  </div>
                </div>

                {/* Main Content Details */}
                <div className="txn-food-info">
                  <h3>{item.foodName}</h3>
                  <div className="txn-badges-row">
                    <span className={`badge ${item.dietaryType === "Non-Veg" ? "badge-nonveg" : "badge-veg"}`}>
                      {item.dietaryType || "Veg"}
                    </span>
                    <span className="spec-tag">Category: {item.category || "Cooked Meals"}</span>
                    <span className="spec-tag">Volume: {item.quantity}</span>
                    <span className="spec-tag">Location: {item.location}</span>
                  </div>
                </div>

                {/* 4-Stage Transaction Lifecycle Tracker */}
                <div className="lifecycle-timeline">
                  {/* Stage 1: Listed */}
                  <div className="timeline-step completed">
                    <div className="step-circle"><CheckCircle2 size={16} /></div>
                    <div className="step-content">
                      <span className="step-title">1. Surplus Listed</span>
                      <span className="step-detail">{item.donorName || "Food Donor"}</span>
                    </div>
                  </div>

                  <div className={`timeline-connector ${item.status !== "Pending" ? "active" : ""}`}></div>

                  {/* Stage 2: Claimed */}
                  <div className={`timeline-step ${item.status !== "Pending" ? "completed" : "pending"}`}>
                    <div className="step-circle">
                      {item.status !== "Pending" ? <CheckCircle2 size={16} /> : <Clock size={14} />}
                    </div>
                    <div className="step-content">
                      <span className="step-title">2. Claimed by NGO</span>
                      <span className="step-detail">{item.claimedByNgoName || "Awaiting Volunteer"}</span>
                    </div>
                  </div>

                  <div className={`timeline-connector ${item.status === "Accepted" ? "active" : ""}`}></div>

                  {/* Stage 3: OTP Handover */}
                  <div className={`timeline-step ${item.status === "Accepted" ? "completed" : item.status === "Claimed" ? "in-transit" : "pending"}`}>
                    <div className="step-circle">
                      {item.status === "Accepted" ? <CheckCircle2 size={16} /> : <Key size={14} />}
                    </div>
                    <div className="step-content">
                      <span className="step-title">3. OTP Handover</span>
                      <span className="step-detail">
                        {item.status === "Accepted" ? "Verified" : `Code: ${item.otp || "4821"}`}
                      </span>
                    </div>
                  </div>

                  <div className={`timeline-connector ${item.status === "Accepted" ? "active" : ""}`}></div>

                  {/* Stage 4: Delivered */}
                  <div className={`timeline-step ${item.status === "Accepted" ? "completed" : "pending"}`}>
                    <div className="step-circle">
                      {item.status === "Accepted" ? <ShieldCheck size={16} /> : <Clock size={14} />}
                    </div>
                    <div className="step-content">
                      <span className="step-title">4. Distributed</span>
                      <span className="step-detail">
                        {item.status === "Accepted" ? `${item.mealCount || (parseInt(item.quantity) || 0)} Plates Fed` : "In Progress"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="txn-card-footer">
                  <div className="footer-meta">
                    {item.status === "Claimed" && (
                      <span className="in-transit-alert">
                        🚚 Dispatch Driver: <strong>{item.volunteerName || "Assigned Driver"}</strong> ({item.volunteerPhone || "Phone provided by NGO"})
                      </span>
                    )}
                    {item.status === "Accepted" && (
                      <span className="delivered-impact-note">
                        🌱 Prevented <strong>{item.co2SavedKg || ((Number(item.mealCount) || 0) * 1.8).toFixed(1)} kg</strong> of Greenhouse Carbon Emissions
                      </span>
                    )}
                  </div>

                  <div className="footer-actions">
                    {item.status === "Accepted" && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setSelectedReceipt(item)}
                      >
                        <Printer size={15} /> Official 80G Certificate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 80G Certificate Modal */}
      {selectedReceipt && (
        <DonationReceiptModal
          donation={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}

export default DonationHistory;