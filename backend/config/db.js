const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("Trying MongoDB connection...");

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
      serverSelectionTimeoutMS: 30000,
    });

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Error:");
    console.error(error);
  }
};

module.exports = connectDB;