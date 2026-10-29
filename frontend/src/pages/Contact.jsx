import { useState } from "react";
import Navbar from "../components/Navbar";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  HelpCircle, 
  ChevronDown, 
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import "../styles/Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Surplus Food Alert",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: "How fast do NGOs pick up donated food?",
      a: "On average, local certified partner NGOs respond within 15 minutes of listing and dispatch a volunteer pickup driver within 45 minutes to ensure freshness."
    },
    {
      q: "Are food donations eligible for tax exemption (80G)?",
      a: "Yes! All verified institutional food donations through ResQFood receive an automated digital 80G tax receipt and verified community impact certificate."
    },
    {
      q: "What types of food can be donated?",
      a: "We accept freshly prepared cooked meals (from banquets, hotels, corporate canteens), fresh produce, bakery products, packaged grocery items, and beverages within safe consumption limits."
    },
    {
      q: "How does the Handover OTP work?",
      a: "When an NGO driver arrives to collect the food, the donor gives them a unique 4-digit Handover OTP generated in the app. Entering this OTP marks physical custody transfer and triggers the delivery receipt."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in your name, email, and message.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <Navbar />

      <section className="contact-hero">
        <div className="app-container">
          <span className="contact-pill">RAPID SUPPORT & RELIEF</span>
          <h1>Get In Touch With ResQFood</h1>
          <p>
            Have surplus food ready for emergency collection? Looking to partner your NGO? Our relief coordination desk is available 24/7.
          </p>
        </div>
      </section>

      <section className="contact-main-section">
        <div className="app-container contact-grid">
          {/* Left Column: Form */}
          <div className="contact-form-container card-surface">
            <h2>Send Us a Message</h2>
            <p className="form-helper-text">
              Our dispatch team responds to urgent pickup alerts within minutes.
            </p>

            {submitted ? (
              <div className="contact-success-banner animate-fade-in">
                <CheckCircle2 size={32} color="#059669" />
                <div>
                  <h4>Message Received!</h4>
                  <p>Our rapid response team has been notified and will contact you at <strong>{formData.email}</strong> shortly.</p>
                </div>
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", phone: "", subject: "Surplus Food Alert", message: "" });
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Chef Anita Rao / Vikram Joshi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="name@organization.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="+91 98765 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Inquiry Category</label>
                  <select
                    className="form-select"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="Surplus Food Alert">⚡ Urgent Surplus Food Alert (Immediate Pickup)</option>
                    <option value="NGO Onboarding">🏢 NGO Partnership & Verification</option>
                    <option value="Corporate Catering">🍱 Hotel / Banquet Surplus Partnership</option>
                    <option value="Volunteer Driver">🚚 Volunteer Logistics & Driving</option>
                    <option value="General Support">💬 General Support & Feedback</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Message Details</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    placeholder="Provide details about food quantity, pickup timing, location, or partnership query..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-full">
                  <Send size={16} /> Submit Inquiry / Alert
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Contact Cards */}
          <div className="contact-info-column">
            <div className="emergency-hotline-card">
              <div className="hotline-badge">
                <AlertTriangle size={16} /> 24/7 RAPID DISPATCH
              </div>
              <h3>Emergency Food Rescue Desk</h3>
              <p>For urgent collections exceeding 50+ meals needing dispatch within 1 hour:</p>
              <div className="hotline-number">
                <Phone size={24} /> +91 7995919508
              </div>
              <small>Toll-free across major metropolitan regions.</small>
            </div>

            <div className="contact-channels-card card-surface">
              <h3>Support Channels</h3>

              <div className="channel-item">
                <div className="channel-icon"><Mail size={18} /></div>
                <div>
                  <span className="channel-title">Direct Operations Desk</span>
                  <p>operations@wastefood.org</p>
                </div>
              </div>

              <div className="channel-item">
                <div className="channel-icon"><Clock size={18} /></div>
                <div>
                  <span className="channel-title">Operational Hours</span>
                  <p>Platform: 24/7 • Hotline: 06:00 AM – 02:00 AM Daily</p>
                </div>
              </div>

              <div className="channel-item">
                <div className="channel-icon"><MapPin size={18} /></div>
                <div>
                  <span className="channel-title">National Coordination Center</span>
                  <p>Plot 48, HITEC City Relief Zone, Hyderabad, Telangana 500081</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section className="faq-section">
        <div className="app-container">
          <div className="text-center section-header">
            <span className="section-eyebrow">FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="section-title">Everything You Need to Know</h2>
          </div>

          <div className="faq-accordion-container">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`faq-item card-surface ${openFaq === idx ? "open" : ""}`}
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
              >
                <div className="faq-question">
                  <span className="faq-q-text">{faq.q}</span>
                  <ChevronDown size={18} className={`faq-chevron ${openFaq === idx ? "rotate" : ""}`} />
                </div>
                {openFaq === idx && (
                  <div className="faq-answer animate-fade-in">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;