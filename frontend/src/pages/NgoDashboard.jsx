import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function NgoDashboard() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/donations"
      );

      setDonations(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccept = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/donations/${id}`
      );

      alert("Donation accepted successfully!");
      fetchDonations();
    } catch (error) {
      console.log(error);
      alert("Error accepting donation");
    }
  };

  const openMap = (latitude, longitude) => {
    window.open(
      `https://www.google.com/maps?q=${latitude},${longitude}`,
      "_blank"
    );
  };

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        <h1>NGO Dashboard</h1>

        <h2>Available Donations</h2>

        <table border="1" width="100%">
          <thead>
            <tr>
              <th>Food Name</th>
              <th>Quantity</th>
              <th>Expiry Date</th>
              <th>Location</th>
              <th>Status</th>
              <th>Map</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {donations.map((donation) => (
              <tr key={donation._id}>
                <td>{donation.foodName}</td>
                <td>{donation.quantity}</td>

                <td>
                  {new Date(
                    donation.expiryDate
                  ).toLocaleDateString()}
                </td>

                <td>{donation.location}</td>

                <td>{donation.status}</td>

                <td>
                  {donation.latitude &&
                  donation.longitude ? (
                    <button
                      onClick={() =>
                        openMap(
                          donation.latitude,
                          donation.longitude
                        )
                      }
                    >
                      View Map
                    </button>
                  ) : (
                    "N/A"
                  )}
                </td>

                <td>
                  {donation.status === "Pending" && (
                    <button
                      onClick={() =>
                        handleAccept(donation._id)
                      }
                    >
                      Accept
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default NgoDashboard;