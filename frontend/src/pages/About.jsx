import Navbar from "../components/Navbar";
import "../styles/About.css";

import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import img4 from "../assets/img4.png";

import { useState, useEffect } from "react";

function About() {
  const images = [
    {
      img: img1,
      title: "Fight Hunger",
      desc: "Millions of people struggle to get food every day. Our platform helps connect surplus food with those who need it most.",
    },
    {
      img: img2,
      title: "Reduce Food Waste",
      desc: "Large quantities of edible food are wasted daily. We help reduce food wastage through efficient food redistribution.",
    },
    {
      img: img3,
      title: "NGO Support",
      desc: "NGOs collect and distribute food donations to needy people quickly and efficiently.",
    },
    {
      img: img4,
      title: "Our Solution",
      desc: "Connecting donors and NGOs through technology to build a hunger-free society.",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="about-hero">
        <h1>🌍 Together We Can End Food Waste</h1>
        <p>
          Connecting Donors, NGOs and Needy People through
          technology.
        </p>

        <button>Join Our Mission</button>
      </div>

      {/* About Slider Section */}
      <div className="about-container">
        <h1>About Waste Food Management</h1>

        <div className="slide">
          <div className="slide-image">
            <img
              src={images[current].img}
              alt={images[current].title}
            />
          </div>

          <div className="slide-text">
            <h2>{images[current].title}</h2>

            <p>{images[current].desc}</p>

          </div>
        </div>
      </div>

      {/* Impact Section */}
      <div className="impact-section">
        <div className="impact-card">
          <h2>500+</h2>
          <p>Food Donations</p>
        </div>

        <div className="impact-card">
          <h2>50+</h2>
          <p>NGOs Connected</p>
        </div>

        <div className="impact-card">
          <h2>5000+</h2>
          <p>People Helped</p>
        </div>

        <div className="impact-card">
          <h2>2 Tons</h2>
          <p>Food Saved</p>
        </div>
      </div>
    </>
  );
}

export default About;