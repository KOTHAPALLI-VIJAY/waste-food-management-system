import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function DonationHistory() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/donations/history"
      );

      setDonations(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        <h1>Donation History</h1>

        <table border="1" width="100%">
          <thead>
            <tr>
              <th>Food Name</th>
              <th>Quantity</th>
              <th>Expiry Date</th>
              <th>Location</th>
              <th>Status</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default DonationHistory;