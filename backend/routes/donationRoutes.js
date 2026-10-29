const express = require("express");
const router = express.Router();

const {
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
} = require("../controllers/donationController");

router.post("/", addDonation);
router.get("/", getDonations);
router.get("/history", getDonationHistory);
router.get("/stats", getDonorStats);
router.get("/testimonials", getTestimonials);
router.get("/:id", getDonationById);
router.put("/:id", updateDonationStatus);
router.put("/:id/claim", claimDonation);
router.post("/:id/verify-otp", verifyDonationOtp);
router.put("/:id/accept", acceptDonation);

module.exports = router;