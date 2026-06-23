const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  foodName: String,
  quantity: Number,
  expiryDate: Date,
  location: String,

  latitude: Number,
  longitude: Number,

  status: {
    type: String,
    default: "Pending",
  },
});

module.exports = mongoose.model(
  "Donation",
  donationSchema
);