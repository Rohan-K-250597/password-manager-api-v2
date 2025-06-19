const User = require("../models/user.model");

const getUserRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user.role === "admin";
  } catch (e) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }
};

module.exports = getUserRole;
