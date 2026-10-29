const User = require("../models/User");
const Donation = require("../models/Donation");

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonors = await User.countDocuments({ role: "donor" });
    const totalNGOs = await User.countDocuments({ role: "ngo" });

    const totalDonations = await Donation.countDocuments();
    const acceptedDonations = await Donation.countDocuments({
      status: "Accepted",
    });
    const pendingDonations = await Donation.countDocuments({
      status: "Pending",
    });
    const claimedDonations = await Donation.countDocuments({
      status: "Claimed",
    });

    const all = await Donation.find();
    const mealsSaved = all.reduce((acc, curr) => acc + (Number(curr.mealCount) || 0), 0);
    const co2SavedKg = all.reduce(
      (acc, curr) => acc + (Number(curr.co2SavedKg) || (Number(curr.mealCount) || 0) * 1.8),
      0
    );

    res.status(200).json({
      totalUsers,
      totalDonors,
      totalNGOs,
      totalDonations,
      acceptedDonations,
      pendingDonations,
      claimedDonations,
      mealsSaved,
      co2SavedKg: Math.round(co2SavedKg),
    });

  } catch (error) {
    console.error("getAdminStats error:", error);
    res.status(500).json({
      message: "Server Error fetching admin stats",
    });
  }
};

module.exports = {
  getAdminStats,
};