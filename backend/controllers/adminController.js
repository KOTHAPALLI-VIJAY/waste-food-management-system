const User = require("../models/User");
const Donation = require("../models/Donation");

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalNGOs = await User.countDocuments({
      role: "ngo",
    });

    const totalDonations =
      await Donation.countDocuments();

    const acceptedDonations =
      await Donation.countDocuments({
        status: "Accepted",
      });

    const pendingDonations =
      await Donation.countDocuments({
        status: "Pending",
      });

    res.status(200).json({
      totalUsers,
      totalNGOs,
      totalDonations,
      acceptedDonations,
      pendingDonations,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getAdminStats,
};