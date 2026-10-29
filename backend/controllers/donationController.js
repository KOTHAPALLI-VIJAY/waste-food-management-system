const Donation = require("../models/Donation");
const User = require("../models/User");

const addDonation = async (req, res) => {
  try {
    const donationData = {
      ...req.body,
      status: "Pending",
      otp: String(Math.floor(1000 + Math.random() * 9000)),
      transactionId: "TXN-WFM-" + Math.floor(1000 + Math.random() * 9000),
    };

    const donation = await Donation.create(donationData);

    res.status(201).json({
      message: "Food Donation listed successfully!",
      donation,
    });
  } catch (error) {
    console.error("addDonation error:", error);
    res.status(500).json({
      message: "Server Error adding donation",
    });
  }
};

const getDonations = async (req, res) => {
  try {
    const { status, donorId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (donorId) filter.donorId = donorId;

    const donations = await Donation.find(filter);
    res.status(200).json(donations);
  } catch (error) {
    console.error("getDonations error:", error);
    res.status(500).json({
      message: "Server Error fetching donations",
    });
  }
};

const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }
    res.status(200).json(donation);
  } catch (error) {
    console.error("getDonationById error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const acceptDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const { ngoName, ngoId, volunteerName, volunteerPhone, estimatedPickupTime } = req.body || {};

    const donation = await Donation.findByIdAndUpdate(
      id,
      {
        status: "Accepted",
        claimedByNgoId: ngoId || "usr_ngo_1",
        claimedByNgoName: ngoName || "Partner NGO Relief",
        volunteerName: volunteerName || "NGO Dispatch Volunteer",
        volunteerPhone: volunteerPhone || "+91 98765 12345",
        estimatedPickupTime: estimatedPickupTime || "Within 1 hour",
        deliveredAt: new Date().toISOString(),
      },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.status(200).json({
      message: "Donation Accepted Successfully!",
      donation,
    });
  } catch (error) {
    console.error("acceptDonation error:", error);
    res.status(500).json({
      message: "Server Error accepting donation",
    });
  }
};

const updateDonationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const donation = await Donation.findByIdAndUpdate(
      id,
      { status: status || "Accepted" },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found",
      });
    }

    res.status(200).json({
      message: `Donation status updated to ${donation.status}`,
      donation,
    });
  } catch (error) {
    console.error("updateDonationStatus error:", error);
    res.status(500).json({
      message: "Server Error updating donation",
    });
  }
};

const claimDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ngoName,
      ngoId,
      volunteerName,
      volunteerPhone,
      estimatedPickupTime,
    } = req.body;

    const donation = await Donation.findByIdAndUpdate(
      id,
      {
        status: "Claimed",
        claimedByNgoId: ngoId,
        claimedByNgoName: ngoName || "Verified NGO Partner",
        volunteerName: volunteerName || "Relief Volunteer",
        volunteerPhone: volunteerPhone || "",
        estimatedPickupTime: estimatedPickupTime || "Within 60 mins",
      },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.status(200).json({
      message: "Surplus Food Claimed for Distribution!",
      donation,
    });
  } catch (error) {
    console.error("claimDonation error:", error);
    res.status(500).json({ message: "Server Error claiming donation" });
  }
};

const verifyDonationOtp = async (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;

    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({ message: "Donation record not found" });
    }

    if (String(donation.otp).trim() !== String(otp).trim()) {
      return res.status(400).json({
        message: "Invalid Handover OTP. Please ask the food donor for the 4-digit code.",
      });
    }

    const updated = await Donation.findByIdAndUpdate(
      id,
      {
        status: "Accepted",
        deliveredAt: new Date().toISOString(),
      },
      { new: true }
    );

    res.status(200).json({
      message: "OTP Verified! Handover confirmed and marked as distributed.",
      donation: updated,
    });
  } catch (error) {
    console.error("verifyDonationOtp error:", error);
    res.status(500).json({ message: "Server Error verifying OTP" });
  }
};

const getDonationHistory = async (req, res) => {
  try {
    const donations = await Donation.find();
    res.status(200).json(donations);
  } catch (error) {
    console.error("getDonationHistory error:", error);
    res.status(500).json({
      message: "Server Error fetching history",
    });
  }
};

const getDonorStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonors = await User.countDocuments({ role: "donor" });
    const totalNGOs = await User.countDocuments({ role: "ngo" });

    const totalDonations = await Donation.countDocuments();
    const pendingDonations = await Donation.countDocuments({ status: "Pending" });
    const acceptedDonations = await Donation.countDocuments({ status: "Accepted" });
    const claimedDonations = await Donation.countDocuments({ status: "Claimed" });

    const all = await Donation.find();
    const mealsSaved = all.reduce((acc, curr) => acc + (Number(curr.mealCount) || 0), 0);
    const deliveredBatches = all.filter((d) => d.status === "Accepted");
    const mealsDelivered = deliveredBatches.reduce((acc, curr) => acc + (Number(curr.mealCount) || 0), 0);

    const co2SavedKg = all.reduce((acc, curr) => {
      const co2 = Number(curr.co2SavedKg) > 0 
        ? Number(curr.co2SavedKg) 
        : (Number(curr.mealCount) || 0) * 1.8;
      return acc + co2;
    }, 0);

    const fulfillmentRate = totalDonations > 0 
      ? Math.round(((acceptedDonations + claimedDonations) / totalDonations) * 100) 
      : 100;

    const claimedBatches = all.filter((d) => d.estimatedPickupTime);
    const avgDispatchTime = claimedBatches.length > 0 
      ? claimedBatches[0].estimatedPickupTime 
      : "Within 45 mins";

    res.status(200).json({
      totalUsers,
      totalDonors,
      totalNGOs,
      totalDonations,
      pendingDonations,
      acceptedDonations,
      claimedDonations,
      mealsSaved,
      mealsDelivered,
      co2SavedKg: Math.round(co2SavedKg),
      fulfillmentRate,
      avgDispatchTime,
    });
  } catch (error) {
    console.error("getDonorStats error:", error);
    res.status(500).json({
      message: "Server Error fetching donor statistics",
    });
  }
};

const getTestimonials = async (req, res) => {
  try {
    const users = await User.find();
    const donations = await Donation.find();

    const donors = users.filter((u) => u.role === "donor");
    const ngos = users.filter((u) => u.role === "ngo");
    const completed = donations.filter((d) => d.status === "Accepted");

    const testimonials = [];

    // Donor testimonial
    if (donors.length > 0) {
      const donor = donors[0];
      const donorBatches = donations.filter((d) => d.donorName === donor.name || d.donorId === donor.id || d.donorId === donor._id);
      const meals = donorBatches.reduce((sum, d) => sum + (Number(d.mealCount) || 0), 0);
      testimonials.push({
        id: "testi-1",
        quote: `Disposing of banquet surplus used to be our biggest heartache. Now, with automatic NGO alerts and OTP verification, our food feeds over ${meals > 0 ? meals : 50}+ people safely every week.`,
        author: donor.name,
        role: "Verified Hospitality Donor",
        avatar: "👨‍🍳",
        type: "donor",
      });
    }

    // NGO testimonial
    if (ngos.length > 0) {
      const ngo = ngos[0];
      testimonials.push({
        id: "testi-2",
        quote: `The instant notification and Google Maps routing makes it seamless for our volunteers to collect hot, nutritious food within 40 minutes of posting. An indispensable platform!`,
        author: ngo.name,
        role: "Certified Charity Distribution Partner",
        avatar: "🤝",
        type: "ngo",
      });
    }

    // Volunteer / Dispatch testimonial
    if (completed.length > 0) {
      const item = completed[0];
      testimonials.push({
        id: "testi-3",
        quote: `We rescued ${item.quantity} (${item.mealCount || 40} servings) from ${item.donorName || "our donor partner"} and delivered them with verified temperature integrity and 4-digit OTP handover.`,
        author: item.volunteerName || "Lead Logistics Volunteer",
        role: `Relief Coordinator, ${item.claimedByNgoName || "City Hunger Relief"}`,
        avatar: "🚚",
        type: "volunteer",
      });
    } else {
      testimonials.push({
        id: "testi-3",
        quote: `The real-time SMS alerts and GPS coordinates make evening food rescues 3x faster. We can serve hot, nutritious meals to shelter residents within an hour.`,
        author: "Rapid Dispatch Volunteer",
        role: "Logistics Volunteer, City Hunger Project",
        avatar: "🚚",
        type: "volunteer",
      });
    }

    res.status(200).json(testimonials);
  } catch (error) {
    console.error("getTestimonials error:", error);
    res.status(500).json({ message: "Error fetching testimonials" });
  }
};

module.exports = {
  addDonation,
  getDonations,
  getDonationById,
  updateDonationStatus,
  acceptDonation,
  claimDonation,
  verifyDonationOtp,
  getDonationHistory,
  getDonorStats,
  getTestimonials,
};