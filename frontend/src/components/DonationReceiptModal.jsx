import { X, Printer, CheckCircle, ShieldCheck, Award, HeartHandshake, Leaf } from "lucide-react";
import "../styles/DonationReceiptModal.css";

function DonationReceiptModal({ donation, onClose }) {
  if (!donation) return null;

  const handlePrint = () => {
    window.print();
  };

  const mealCount = donation.mealCount || parseInt(donation.quantity) || 25;
  const co2Saved = donation.co2SavedKg || (mealCount * 1.8).toFixed(1);

  return (
    <div className="receipt-modal-backdrop" onClick={onClose}>
      <div className="receipt-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="receipt-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="receipt-printable-area" id="donation-receipt">
          {/* Certificate Header */}
          <div className="receipt-header">
            <div className="receipt-branding">
              <div className="receipt-logo-icon">
                <HeartHandshake size={28} color="#059669" />
              </div>
              <div>
                <h2>ResQFood Platform</h2>
                <p>National Food Waste Management & Redistribution Network</p>
              </div>
            </div>
            <div className="receipt-badge-certified">
              <ShieldCheck size={16} />
              <span>Verified 80G Certified</span>
            </div>
          </div>

          <div className="receipt-divider"></div>

          {/* Certificate Title Banner */}
          <div className="receipt-certificate-banner">
            <Award size={24} className="award-icon" />
            <div>
              <h3>OFFICIAL FOOD DONATION CERTIFICATE</h3>
              <p>Certificate of Community Impact & Sustainable Food Rescue</p>
            </div>
          </div>

          {/* Transaction Metadata Bar */}
          <div className="receipt-meta-grid">
            <div className="meta-item">
              <span className="meta-label">TRANSACTION ID</span>
              <span className="meta-value highlight">{donation.transactionId || `TXN-WFM-${donation._id?.slice(-4) || '8041'}`}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">DATE & TIME</span>
              <span className="meta-value">{new Date(donation.createdAt || Date.now()).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">FULFILLMENT STATUS</span>
              <span className="meta-value status-done">
                <CheckCircle size={14} /> {donation.status || 'Delivered'}
              </span>
            </div>
          </div>

          {/* Parties Grid */}
          <div className="receipt-parties-grid">
            <div className="party-card">
              <span className="party-badge">RESCUE DONOR</span>
              <h4>{donation.donorName || "Registered Food Donor"}</h4>
              <p>📍 {donation.location || "Donor Facility"}</p>
              {donation.donorPhone && <p>📞 {donation.donorPhone}</p>}
            </div>

            <div className="party-card">
              <span className="party-badge">RECEIVING CHARITY / NGO</span>
              <h4>{donation.claimedByNgoName || "Verified Relief Organization"}</h4>
              <p>🚚 Dispatch: {donation.volunteerName || "Relief Volunteer"}</p>
              {donation.volunteerPhone && <p>📞 Contact: {donation.volunteerPhone}</p>}
            </div>
          </div>

          {/* Donation Summary Table */}
          <div className="receipt-items-table">
            <table>
              <thead>
                <tr>
                  <th>Food Description</th>
                  <th>Category</th>
                  <th>Dietary</th>
                  <th>Quantity / Volume</th>
                  <th>Meals Provided</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="food-title">{donation.foodName}</td>
                  <td>{donation.category || "Cooked Meals"}</td>
                  <td>
                    <span className={`pill-type ${donation.dietaryType === "Non-Veg" ? "nonveg" : "veg"}`}>
                      {donation.dietaryType || "Veg"}
                    </span>
                  </td>
                  <td>{donation.quantity}</td>
                  <td className="bold-qty">{mealCount} Plates</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Environmental Impact Banner */}
          <div className="receipt-impact-banner">
            <div className="impact-pill">
              <Leaf size={18} color="#059669" />
              <span><strong>{co2Saved} kg</strong> CO2 Emissions Prevented</span>
            </div>
            <div className="impact-pill">
              <HeartHandshake size={18} color="#2563eb" />
              <span><strong>{mealCount} Needy People</strong> Fed & Supported</span>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="receipt-footer">
            <div className="seal-container">
              <div className="official-stamp">
                <span>RESQFOOD</span>
                <span>★ VERIFIED ★</span>
                <span>AUTHENTIC</span>
              </div>
            </div>
            <div className="signature-box">
              <div className="digital-sig">Dr. Priya Swaminathan</div>
              <p>Director of Relief Operations</p>
              <small>Digital Verification Hash: SHA256-{(donation._id || 'resq').slice(0, 10).toUpperCase()}</small>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="receipt-modal-actions no-print">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={18} /> Print / Save Certificate PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default DonationReceiptModal;
