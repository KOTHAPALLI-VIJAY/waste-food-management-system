const express = require("express");

const router = express.Router();

const {
  addDonation,
  getDonations,
  updateDonationStatus,
  acceptDonation,
  getDonationHistory,
  getDonorStats,
} = require("../controllers/donationController");

router.post("/", addDonation);

router.get("/", getDonations);

router.get("/history", getDonationHistory);

router.get("/stats", getDonorStats);

router.put("/:id", updateDonationStatus);

module.exports = router;