const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("getUsers error:", error);
    res.status(500).json({
      message: "Server Error fetching users",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User Deleted Successfully",
    });
  } catch (error) {
    console.error("deleteUser error:", error);
    res.status(500).json({
      message: "Server Error deleting user",
    });
  }
};

module.exports = {
  getUsers,
  deleteUser,
};