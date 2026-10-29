import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import apiClient from "../api/apiClient";
import { 
  ShieldCheck, 
  Award, 
  Leaf, 
  HeartHandshake, 
  Users, 
  Thermometer, 
  Clock, 
  CheckCircle,
  Globe
} from "lucide-react";
import "../styles/About.css";

function About() {
  const [stats, setStats] = useState({ totalUsers: 0, mealsSaved: 0 });

  useEffect(() => {
    apiClient.get("/donations/stats")
      .then((res) => {
        if (res.data) setStats(res.data);
      })
      .catch(() => {});
  }, []);
  return (
    <div className="about-page">
      <Navbar />

      {/* Hero Header */}
      <section className="about-hero">
        <div className="app-container">
          <span className="about-pill">OUR MISSION & IMPACT</span>
          <h1 className="about-title">Ending Edible Food Waste. Feeding Tomorrow.</h1>
          <p className="about-subtitle">
            Every day, tons of wholesome, freshly prepared food is discarded while millions face hunger. 
            ResQFood provides the hyper-local digital logistics bridge between surplus food creators and community aid organizations.
          </p>
        </div>
      </section>

      {/* UN SDG Goals */}
      <section className="sdg-section">
        <div className="app-container">
          <div className="text-center section-header">
            <span className="section-eyebrow">GLOBAL COMMITMENT</span>
            <h2 className="section-title">Aligned With United Nations Sustainable Goals</h2>
          </div>

          <div className="sdg-grid">
            <div className="sdg-card card-surface">
              <div className="sdg-badge-number sdg-2">SDG 2</div>
              <div className="sdg-icon-box">
                <HeartHandshake size={32} color="#d97706" />
              </div>
              <h3>Zero Hunger</h3>
              <p>
                Redirecting safe, nutritious meals directly to vulnerable families, homeless shelters, and orphanages before food spoils.
              </p>
            </div>

            <div className="sdg-card card-surface">
              <div className="sdg-badge-number sdg-12">SDG 12</div>
              <div className="sdg-icon-box">
                <Leaf size={32} color="#059669" />
              </div>
              <h3>Responsible Consumption</h3>
              <p>
                Preventing organic waste from decaying in landfills, mitigating harmful methane emissions, and optimizing supply chains.
              </p>
            </div>

            <div className="sdg-card card-surface">
              <div className="sdg-badge-number sdg-17">SDG 17</div>
              <div className="sdg-icon-box">
                <Globe size={32} color="#2563eb" />
              </div>
              <h3>Partnerships For Goals</h3>
              <p>
                Uniting hospitality leaders, logistics volunteers, municipal bodies, and certified NGOs under a unified digital network.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Food Safety & Hygiene Standards */}
      <section className="safety-standards-section">
        <div className="app-container">
          <div className="safety-card">
            <div className="safety-header">
              <ShieldCheck size={36} color="#10b981" />
              <div>
                <h2>Strict Food Safety & Redistribution Standards</h2>
                <p>Every donation on the ResQFood network complies with strict food safety guidelines.</p>
              </div>
            </div>

            <div className="safety-points-grid">
              <div className="safety-point">
                <div className="point-icon"><Thermometer size={20} /></div>
                <div>
                  <h4>Temperature Integrity</h4>
                  <p>Hot meals must be maintained above 60°C or cooled below 5°C within 2 hours of preparation.</p>
                </div>
              </div>

              <div className="safety-point">
                <div className="point-icon"><Clock size={20} /></div>
                <div>
                  <h4>Strict Redistribution Window</h4>
                  <p>Cooked meals have an enforced 4-to-6 hour consumption deadline from the time of initial packaging.</p>
                </div>
              </div>

              <div className="safety-point">
                <div className="point-icon"><CheckCircle size={20} /></div>
                <div>
                  <h4>Sanitized Packaging</h4>
                  <p>All items must be sealed in food-grade, leak-proof containers clearly labeled with preparation time.</p>
                </div>
              </div>

              <div className="safety-point">
                <div className="point-icon"><Award size={20} /></div>
                <div>
                  <h4>Verified NGO Handover</h4>
                  <p>Only verified NGOs with certified volunteer drivers can claim and transport food batches with OTP verification.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta-section">
        <div className="app-container text-center">
          <h2>Ready to Make an Immediate Difference?</h2>
          <p>
            Join {stats.totalUsers > 0 ? `over ${stats.totalUsers} registered organizations` : "verified hospitality donors and charity shelters"} transforming surplus into sustenance today.
          </p>
          <div className="about-cta-buttons">
            <Link to="/register" className="btn btn-primary btn-lg">
              Register as Donor or NGO
            </Link>
            <Link to="/contact" className="btn btn-secondary btn-lg">
              Contact Our Operations Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;