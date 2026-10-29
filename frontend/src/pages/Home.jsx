import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import Navbar from "../components/Navbar";
import { 
  HeartHandshake, 
  Utensils, 
  Truck, 
  Users, 
  Leaf, 
  ArrowRight, 
  CheckCircle2,
  MapPin, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Calculator,
  ChevronRight,
  PlusCircle,
  Building,
  Quote,
  Package
} from "lucide-react";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [recentDonations, setRecentDonations] = useState([]);
  const [stats, setStats] = useState({
    mealsSaved: 0,
    mealsDelivered: 0,
    co2SavedKg: 0,
    totalNGOs: 0,
    totalDonors: 0,
    totalUsers: 0,
    totalDonations: 0,
    acceptedDonations: 0,
    pendingDonations: 0,
    claimedDonations: 0,
    fulfillmentRate: 100,
    avgDispatchTime: "Within 45 mins",
  });
  const [testimonials, setTestimonials] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Food Waste Impact Calculator State
  const [sliderKg, setSliderKg] = useState(50);

  useEffect(() => {
    fetchStats();
    fetchRecentDonations();
    fetchTestimonials();
  }, []);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await apiClient.get("/donations/stats");
      if (res.data) {
        setStats({
          mealsSaved: Number(res.data.mealsSaved) || 0,
          mealsDelivered: Number(res.data.mealsDelivered) || 0,
          co2SavedKg: Number(res.data.co2SavedKg) || 0,
          totalNGOs: Number(res.data.totalNGOs) || 0,
          totalDonors: Number(res.data.totalDonors) || 0,
          totalUsers: Number(res.data.totalUsers) || 0,
          totalDonations: Number(res.data.totalDonations) || 0,
          acceptedDonations: Number(res.data.acceptedDonations) || 0,
          pendingDonations: Number(res.data.pendingDonations) || 0,
          claimedDonations: Number(res.data.claimedDonations) || 0,
          fulfillmentRate: Number(res.data.fulfillmentRate) || 100,
          avgDispatchTime: res.data.avgDispatchTime || "Within 45 mins",
        });
      }
    } catch (err) {
      console.log("Could not load stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchRecentDonations = async () => {
    try {
      const res = await apiClient.get("/donations");
      if (res.data && Array.isArray(res.data)) {
        setRecentDonations(res.data);
      }
    } catch (err) {
      console.log("Could not fetch recent donations:", err);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const res = await apiClient.get("/donations/testimonials");
      if (res.data && Array.isArray(res.data)) {
        setTestimonials(res.data);
      }
    } catch (err) {
      console.log("Could not fetch testimonials:", err);
    }
  };

  const handleHeroAction = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (role === "donor") navigate("/donor");
    else if (role === "ngo") navigate("/ngo");
    else if (role === "admin") navigate("/admin");
    else navigate("/login");
  };

  const fulfillmentRate = stats.totalDonations > 0 
    ? Math.round((stats.acceptedDonations / stats.totalDonations) * 100) 
    : 100;

  // Category Icon & Illustration helper
  const getCategoryDetails = (category, foodName = "") => {
    const text = (category + " " + foodName).toLowerCase();
    if (text.includes("bakery") || text.includes("bread") || text.includes("cake")) {
      return { icon: "🍞", label: "Fresh Bakery", tagClass: "cat-bakery" };
    }
    if (text.includes("produce") || text.includes("vegetable") || text.includes("fruit")) {
      return { icon: "🥦", label: "Fresh Produce", tagClass: "cat-produce" };
    }
    if (text.includes("dairy") || text.includes("milk") || text.includes("curd") || text.includes("paneer")) {
      return { icon: "🧀", label: "Dairy & Perishables", tagClass: "cat-dairy" };
    }
    return { icon: "🍱", label: "Prepared Meals", tagClass: "cat-cooked" };
  };

  return (
    <div className="home-page-container">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="app-container hero-grid">
          {/* Left Hero Column */}
          <div className="hero-content">
            <div className="hero-pill-badge">
              <Sparkles size={14} className="badge-sparkle-icon" />
              <span>Real-Time Surplus Food Redistribution</span>
            </div>

            <h1 className="hero-headline">
              Turn Surplus Food Into <span className="highlight-text">Immediate Relief</span>.
            </h1>

            <p className="hero-subtext">
              ResQFood empowers hotels, banquets, restaurants, and grocers to instantly connect excess edible food with verified charity shelters, community kitchens, and relief volunteers.
            </p>

            <div className="hero-cta-group">
              <button className="btn btn-primary btn-lg hero-donate-btn" onClick={handleHeroAction}>
                <PlusCircle size={18} />
                {role === "ngo" ? "Browse Available Food" : "Donate Surplus Food"}
              </button>
              <a href="#how-it-works" className="btn btn-secondary btn-lg hero-how-btn">
                How It Works
              </a>
            </div>

            {/* Social Trust Metrics */}
            <div className="hero-trust-metrics">
              <div className="trust-item">
                <ShieldCheck size={18} className="trust-icon" />
                <span>80G Tax Exemption Certified</span>
              </div>
              <div className="trust-item">
                <Clock size={18} className="trust-icon" />
                <span>{stats.avgDispatchTime} NGO Dispatch</span>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Premium White Dashboard Card */}
          <div className="hero-visual-card">
            <div className="hero-dashboard-card card-surface">
              <div className="card-top-header">
                <div className="live-status-pill">
                  <span className="live-pulse-dot"></span>
                  <span>LIVE RESCUE DISPATCH</span>
                </div>
                <span className="live-network-tag">Verified Network</span>
              </div>

              {/* Main Live Stat Highlight Box */}
              <div className="floating-stat-box">
                <div className="stat-highlight-icon">
                  <Utensils size={22} />
                </div>
                <div>
                  <span className="stat-big-number">
                    {loadingStats ? "..." : (stats.mealsSaved || 0).toLocaleString()}
                  </span>
                  <span className="stat-label">Meals Rescued & Distributed</span>
                </div>
              </div>

              {/* Dynamic Live Batches */}
              <div className="live-feed-header-label">Recent Rescue Activity</div>
              <div className="live-feed-stack">
                {recentDonations.slice(0, 2).map((item, idx) => {
                  const cat = getCategoryDetails(item.category, item.foodName);
                  return (
                    <div key={item._id || item.id || idx} className="live-feed-sample">
                      <div className="sample-avatar">{cat.icon}</div>
                      <div className="sample-info">
                        <h4>{item.foodName || "Surplus Meal Batch"}</h4>
                        <p>{item.quantity} • {item.location || "City Hub"}</p>
                      </div>
                      <span className={`badge badge-${(item.status || "Pending").toLowerCase()}`}>
                        {item.status === "Accepted" ? "Delivered" : item.status === "Claimed" ? "En Route" : "Available"}
                      </span>
                    </div>
                  );
                })}

                {recentDonations.length === 0 && !loadingStats && (
                  <div className="live-feed-sample">
                    <div className="sample-avatar">📦</div>
                    <div className="sample-info">
                      <h4>No Live Dispatches Right Now</h4>
                      <p>Surplus food batches appear here live as donors post.</p>
                    </div>
                    <span className="badge badge-pending">Standing By</span>
                  </div>
                )}
              </div>

              <div className="hero-card-footer">
                <div className="eco-pill">
                  <Leaf size={15} className="eco-icon" />
                  <span>
                    <strong>{(stats.co2SavedKg || 0).toLocaleString()} kg</strong> Greenhouse CO₂ Prevented
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics Section */}
      <section className="impact-stats-section">
        <div className="app-container">
          <div className="stats-cards-grid">
            {/* Metric 1 */}
            <div className="impact-metric-card card-surface">
              <div className="metric-icon-wrap emerald">
                <Utensils size={22} />
              </div>
              <div className="metric-content">
                <h3 className="metric-number">
                  {loadingStats ? "..." : (stats.mealsSaved || 0).toLocaleString()}
                </h3>
                <p className="metric-label">Meals Rescued</p>
                <span className="metric-sublabel">Nutritious meals redirected to shelters</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="impact-metric-card card-surface">
              <div className="metric-icon-wrap forest">
                <Leaf size={22} />
              </div>
              <div className="metric-content">
                <h3 className="metric-number">
                  {loadingStats ? "..." : `${(stats.co2SavedKg || 0).toLocaleString()} kg`}
                </h3>
                <p className="metric-label">CO₂ Emissions Prevented</p>
                <span className="metric-sublabel">Greenhouse landfill reduction</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="impact-metric-card card-surface">
              <div className="metric-icon-wrap purple">
                <Users size={22} />
              </div>
              <div className="metric-content">
                <h3 className="metric-number">
                  {loadingStats ? "..." : stats.totalNGOs}
                </h3>
                <p className="metric-label">Partner NGOs & Shelters</p>
                <span className="metric-sublabel">
                  {stats.totalDonors > 0 ? `Active with ${stats.totalDonors} registered donors` : "Verified relief distribution networks"}
                </span>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="impact-metric-card card-surface">
              <div className="metric-icon-wrap mint">
                <CheckCircle2 size={22} />
              </div>
              <div className="metric-content">
                <h3 className="metric-number">
                  {loadingStats ? "..." : `${stats.fulfillmentRate || 100}%`}
                </h3>
                <p className="metric-label">Fulfillment & Safety Rate</p>
                <span className="metric-sublabel">Verified temperature & OTP handovers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Food Listings Section */}
      <section className="marketplace-preview-section">
        <div className="app-container">
          <div className="section-header-row">
            <div>
              <span className="section-eyebrow">URGENT SURPLUS LISTINGS</span>
              <h2 className="section-title">Available Food Ready For Immediate Pickup</h2>
            </div>
            <Link to={token ? (role === "ngo" ? "/ngo" : "/history") : "/login"} className="view-all-link">
              View All Listings <ChevronRight size={18} />
            </Link>
          </div>

          <div className="listings-grid">
            {recentDonations.length === 0 ? (
              <div className="empty-listing-box card-surface">
                <Utensils size={36} color="#059669" />
                <h3>No surplus food listings right now</h3>
                <p>New surplus food batches appear automatically when donors post in your area.</p>
              </div>
            ) : (
              (recentDonations.filter((d) => d.status === "Pending").length > 0 
                ? recentDonations.filter((d) => d.status === "Pending") 
                : recentDonations
              ).slice(0, 3).map((item) => {
                const cat = getCategoryDetails(item.category, item.foodName);
                const servings = Number(item.mealCount) || parseInt(item.quantity) || 10;
                return (
                  <div key={item._id || item.id} className="food-listing-card card-surface">
                    {/* Visual Card Banner Header */}
                    <div className="food-card-banner">
                      <div className="banner-left">
                        <span className="banner-cat-icon">{cat.icon}</span>
                        <span className="banner-cat-name">{item.category || "Cooked Meals"}</span>
                      </div>
                      <div className="banner-badges">
                        <span className={`badge ${item.dietaryType === "Non-Veg" ? "badge-nonveg" : "badge-veg"}`}>
                          <span className="diet-dot"></span>
                          {item.dietaryType || "Veg"}
                        </span>
                        <span className={`badge badge-${(item.status || "Pending").toLowerCase()}`}>
                          {item.status || "Pending"}
                        </span>
                      </div>
                    </div>

                    <div className="food-card-body">
                      <h3 className="food-card-title">{item.foodName}</h3>

                      <div className="food-quantity-pill">
                        <Package size={14} />
                        <span><strong>{item.quantity}</strong> ({servings} Servings)</span>
                      </div>

                      <div className="food-card-meta">
                        <div className="meta-row">
                          <MapPin size={15} className="meta-icon" />
                          <span className="truncate">{item.location || "Location on Request"}</span>
                        </div>
                        <div className="meta-row">
                          <Clock size={15} className="meta-icon" />
                          <span>{item.pickupWindow || "Ready for immediate pickup"}</span>
                        </div>
                        <div className="meta-row">
                          <Building size={15} className="meta-icon" />
                          <span>Donor: <strong>{item.donorName || "Verified Donor"}</strong></span>
                        </div>
                      </div>

                      <div className="food-card-actions">
                        <button
                          className="btn btn-primary btn-sm w-full food-claim-btn"
                          onClick={() => navigate(token ? (role === "ngo" ? "/ngo" : "/donor") : "/login")}
                        >
                          {role === "ngo" ? "Claim for Rescue" : "View Details"}
                          <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="app-container">
          <div className="text-center section-header">
            <span className="section-eyebrow">TECHNOLOGY-DRIVEN REDISTRIBUTION</span>
            <h2 className="section-title">How ResQFood Works in 3 Simple Steps</h2>
            <p className="section-subtitle">
              Seamless digital coordination connects donors and charity distribution networks with real-world verification.
            </p>
          </div>

          <div className="steps-grid-wrapper">
            <div className="steps-grid">
              {/* Step 1 */}
              <div className="step-card card-surface">
                <div className="step-header-row">
                  <div className="step-number-pill">STEP 01</div>
                  <div className="step-icon-box green">
                    <Utensils size={24} />
                  </div>
                </div>
                <h3>List Surplus Food</h3>
                <p>
                  Hotels, restaurants, and caterers post surplus edible food in 60 seconds with quantity, safe consumption window, and pickup coordinates.
                </p>
                <div className="step-feature-tag">Instant Broadcast</div>
              </div>

              {/* Step 2 */}
              <div className="step-card card-surface">
                <div className="step-header-row">
                  <div className="step-number-pill purple">STEP 02</div>
                  <div className="step-icon-box purple">
                    <Truck size={24} />
                  </div>
                </div>
                <h3>NGOs Claim & Dispatch</h3>
                <p>
                  Nearby verified NGOs claim the batch instantly and dispatch volunteer drivers with temperature-regulated transport bags.
                </p>
                <div className="step-feature-tag purple">Live ETA Tracking</div>
              </div>

              {/* Step 3 */}
              <div className="step-card card-surface">
                <div className="step-header-row">
                  <div className="step-number-pill forest">STEP 03</div>
                  <div className="step-icon-box forest">
                    <HeartHandshake size={24} />
                  </div>
                </div>
                <h3>Secure Handover & Impact</h3>
                <p>
                  A secure 4-digit Handover OTP verifies physical custody. Food feeds hungry families, and an official 80G tax certificate is issued.
                </p>
                <div className="step-feature-tag forest">80G Certificate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Food Waste Impact Calculator */}
      <section className="calculator-section">
        <div className="app-container">
          <div className="calculator-card">
            <div className="calculator-header">
              <div className="calculator-icon">
                <Calculator size={26} color="#FFFFFF" />
              </div>
              <div>
                <h2>Food Waste Impact Calculator</h2>
                <p>Calculate your tangible social and environmental footprint reduction.</p>
              </div>
            </div>

            <div className="calculator-body">
              <div className="slider-container">
                <div className="slider-label-row">
                  <label htmlFor="food-slider">Surplus Food Rescued Per Month:</label>
                  <span className="slider-value-display">{sliderKg} kg / month</span>
                </div>
                <input
                  id="food-slider"
                  type="range"
                  min="10"
                  max="500"
                  step="5"
                  value={sliderKg}
                  onChange={(e) => setSliderKg(Number(e.target.value))}
                  className="calc-range-slider"
                />
              </div>

              <div className="calculator-results-grid">
                <div className="calc-result-box">
                  <span className="calc-stat">{(sliderKg * 2.2).toFixed(0)}</span>
                  <span className="calc-desc">Plates of Food Provided</span>
                </div>
                <div className="calc-result-box">
                  <span className="calc-stat">{(sliderKg * 2.5).toFixed(1)} kg</span>
                  <span className="calc-desc">CO₂ Emissions Prevented</span>
                </div>
                <div className="calc-result-box">
                  <span className="calc-stat">{(sliderKg * 180).toLocaleString()} L</span>
                  <span className="calc-desc">Water Footprint Saved</span>
                </div>
              </div>

              <div className="calculator-comparison-banner" style={{ marginTop: '1.25rem', padding: '0.85rem 1.25rem', background: '#ecfdf5', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#065f46', fontSize: '0.92rem' }}>
                <Sparkles size={18} color="#059669" />
                <span>
                  Our verified platform has already prevented <strong>{(stats.co2SavedKg || 0).toLocaleString()} kg</strong> of greenhouse emissions and rescued <strong>{(stats.mealsSaved || 0).toLocaleString()}</strong> nutritious meals!
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Stories / Testimonials */}
      <section className="testimonials-section">
        <div className="app-container">
          <div className="text-center section-header">
            <span className="section-eyebrow">COMMUNITY STORIES</span>
            <h2 className="section-title">Trusted By Food Donors & NGO Leaders</h2>
            <p className="section-subtitle">
              Real voices from verified hospitality partners and charity relief coordinators using ResQFood.
            </p>
          </div>

          <div className="testimonials-grid">
            {testimonials.length > 0 ? (
              testimonials.map((item, idx) => (
                <div key={item.id || idx} className="testimonial-card card-surface">
                  <div className="quote-icon-badge">
                    <Quote size={20} />
                  </div>
                  <p className="testimonial-quote">"{item.quote}"</p>
                  <div className="testimonial-author">
                    <div className={`author-avatar ${item.type || "donor"}`}>{item.avatar || "👤"}</div>
                    <div>
                      <h4>{item.author}</h4>
                      <p>{item.role}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="testimonial-card card-surface">
                  <div className="quote-icon-badge">
                    <Quote size={20} />
                  </div>
                  <p className="testimonial-quote">
                    "Disposing of banquet surplus used to be our biggest heartache. Now, with automatic NGO alerts and OTP verification, our food feeds over 300 children every weekend safely."
                  </p>
                  <div className="testimonial-author">
                    <div className="author-avatar donor">👨‍🍳</div>
                    <div>
                      <h4>Grand Feast Hotel & Banquet</h4>
                      <p>Executive Banquet Partner</p>
                    </div>
                  </div>
                </div>

                <div className="testimonial-card card-surface">
                  <div className="quote-icon-badge">
                    <Quote size={20} />
                  </div>
                  <p className="testimonial-quote">
                    "The instant notification and Google Maps routing makes it so easy for our volunteers to collect nutritious food within 40 minutes of posting. An indispensable platform!"
                  </p>
                  <div className="testimonial-author">
                    <div className="author-avatar ngo">🤝</div>
                    <div>
                      <h4>Hope & Harvest Food Relief</h4>
                      <p>Certified Charity Network</p>
                    </div>
                  </div>
                </div>

                <div className="testimonial-card card-surface">
                  <div className="quote-icon-badge">
                    <Quote size={20} />
                  </div>
                  <p className="testimonial-quote">
                    "The real-time SMS alerts and GPS coordinates make evening food rescues 3x faster. We can serve hot, nutritious meals to shelter residents within an hour."
                  </p>
                  <div className="testimonial-author">
                    <div className="author-avatar volunteer">🚚</div>
                    <div>
                      <h4>Rapid Dispatch Fleet</h4>
                      <p>Logistics Volunteers Team</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Deep Forest-Green Footer */}
      <footer className="app-footer">
        {/* Donation Pre-Footer CTA Bar */}
        <div className="footer-cta-banner">
          <div className="app-container footer-cta-inner">
            <div className="footer-cta-text">
              <h3>Have Surplus Food To Donate Today?</h3>
              <p>Join {stats.totalUsers > 0 ? `${stats.totalUsers}+ verified hotels, caterers, and relief partners` : "verified donors and NGOs"} creating zero-waste communities.</p>
            </div>
            <button className="btn btn-emerald-solid btn-lg" onClick={handleHeroAction}>
              <PlusCircle size={18} />
              {role === "ngo" ? "Explore Marketplace" : "Start Donating Now"}
            </button>
          </div>
        </div>

        <div className="app-container footer-content-grid">
          <div className="footer-brand-col">
            <div className="footer-logo">
              <div className="footer-logo-badge">
                <HeartHandshake size={20} color="#FFFFFF" />
              </div>
              <span className="footer-brand-title">ResQ<span className="footer-brand-highlight">Food</span></span>
            </div>
            <p className="footer-description">
              Empowering communities through digital coordination to eliminate edible food waste and ensure food security for all.
            </p>
            <p className="footer-compliance">
              Registered Section 8 Non-Profit Technology & Food Safety Initiative. 80G Tax Exemption Certified.
            </p>
          </div>

          <div className="footer-links-col">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Mission</Link></li>
              <li><Link to="/contact">Emergency Support</Link></li>
              <li><Link to="/history">Transactions Ledger</Link></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Portals</h4>
            <ul>
              <li><Link to="/donor">Donor Portal</Link></li>
              <li><Link to="/ngo">NGO Rescue Hub</Link></li>
              <li><Link to="/admin">Admin Console</Link></li>
              <li><Link to="/login">Sign In</Link></li>
            </ul>
          </div>

          <div className="footer-contact-col">
            <h4>Emergency Rescue Hotline</h4>
            <p className="footer-phone">+91 98765 43210</p>
            <p className="footer-hours">24/7 Rapid Response Dispatch</p>
            <p className="footer-email">operations@wastefood.org</p>
            <div className="footer-status-pill">
              <span className="pulse-green"></span> System Operational ({stats.totalDonations} Batches Tracked)
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div className="app-container bottom-bar-inner">
            <p>© {new Date().getFullYear()} ResQFood — Waste Food Rescue. All Rights Reserved.</p>
            <div className="bottom-links">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Food Safety Guidelines</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;