const Donation = require("../models/Donation");

const addDonation = async (req, res) => {
  try {
    const donation = await Donation.create(req.body);

    res.status(201).json({
      message: "Donation Added",
      donation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find();

    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const acceptDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      {
        status: "Accepted",
      },
      { new: true }
    );

    res.status(200).json({
      message: "Donation Accepted",
      donation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const updateDonationStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const donation = await Donation.findByIdAndUpdate(
      id,
      { status: "Accepted" },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found",
      });
    }

    res.status(200).json({
      message: "Donation Accepted",
      donation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getDonationHistory = async (req, res) => {
  try {
    const donations = await Donation.find();

    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};
const getDonorStats = async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments();

    const pendingDonations =
      await Donation.countDocuments({
        status: "Pending",
      });

    const acceptedDonations =
      await Donation.countDocuments({
        status: "Accepted",
      });

    res.status(200).json({
      totalDonations,
      pendingDonations,
      acceptedDonations,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  addDonation,
  getDonations,
  updateDonationStatus,
  acceptDonation,
  getDonationHistory,
  getDonorStats,
};