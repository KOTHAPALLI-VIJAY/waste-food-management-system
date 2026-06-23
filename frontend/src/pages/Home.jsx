import Navbar from "../components/Navbar";
import "../styles/Home.css";
import bgImage from "../assets/food-bg.jpg";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const handleDonate = () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (role === "donor") {
      navigate("/donor");
    } else if (role === "ngo") {
      navigate("/ngo");
    } else if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <Navbar />

      <div
        className="hero"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        <button onClick={handleDonate}>
          {role === "ngo"
            ? "Available Food"
            : role === "admin"
            ? "Admin Dashboard"
            : "Donate Food"}
        </button>
      </div>

      {/* Features Section */}
      <section className="features">
        <div className="card">
          <h2>🍱 Donate Food</h2>
          <p>
            Restaurants and individuals can donate surplus food.
          </p>
        </div>

        <div className="card">
          <h2>🏢 NGO Support</h2>
          <p>
            NGOs can view and accept available donations.
          </p>
        </div>

        <div className="card">
          <h2>🚚 Fast Delivery</h2>
          <p>
            Track food pickup and distribution efficiently.
          </p>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats">
        <div>
          <h1>100+</h1>
          <p>Donors</p>
        </div>

        <div>
          <h1>50+</h1>
          <p>NGOs</p>
        </div>

        <div>
          <h1>5000+</h1>
          <p>Meals Saved</p>
        </div>
      </section>

      <footer className="footer">
        <h3>Waste Food Management System</h3>

        <p>
          Reducing food waste and helping communities through
          smart food donation.
        </p>

        <p>© 2026 All Rights Reserved</p>
      </footer>
    </>
  );
}

export default Home;