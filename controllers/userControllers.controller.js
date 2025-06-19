const jwt = require("jsonwebtoken");

const secret = process.env.SECRET;

const {
  userSignupService,
  userLoginService,
  deleteUserService,
  forgotPasswordService,
  findUser,
  updatePasswordService,
  userProfileService,
  checkUsername,
  updateProfileService,
  userLoginOTPService,
} = require("../database-controllers/usersDatabase.controllers");

const { verifyOtp } = require("../utils/otpManager");
const {
  userDeleted,
  welcomeToServer,
  sendPasswordResetOtp,
  LoginToServer,
} = require("./otpControllers.controller");
const { hashPassword } = require("../utils/hashPassword");

//Signup service

const signupService = async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;
  const newUserData = {
    username,
    email,
    password,
    firstName,
    lastName,
  };
  try {
    const hashedPassword = await hashPassword(newUserData.password);
    const newUser = await userSignupService({
      ...newUserData,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { username: newUser.username, id: newUser._id },
      secret,
      { expiresIn: "2h" },
    );
    welcomeToServer(newUser.email, res);
    res.status(201).json({
      message: "User created successfully",
      data: {
        token,
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
      },
    });
  } catch (e) {
    if (e.code === 11000 && e.keyPattern.email) {
      res.status(409).json({ message: "Email already exists" });
    } else if (e.code === 11000 && e.keyPattern.username) {
      res.status(409).json({ message: "Username exists" });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

//Login Service
const loginOTPServiceController = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userLoginOTPService(username.trim(), password.trim());
    if (user) LoginToServer(user.email, user.username, res);
  } catch (e) {
    switch (e.status) {
      case 401:
        res.status(401).json({ message: "Invalid Credentials" });
        break;
      case 404:
        res.status(404).json({ message: "User does not exist" });
        break;
      default:
        res.status(500).json({ message: "Internal Server Error" });
        break;
    }
  }
};
const loginService = async (req, res) => {
  const { user, password, otp } = req.body;
  try {
    if (verifyOtp(user, otp)) {
      const userData = await userLoginService(user.trim(), password.trim());
      if (userData !== null && userData !== false) {
        {
          const token = await jwt.sign(
            { username: userData.username, id: userData._id },
            secret,
            { expiresIn: "2h" },
          );
          res.status(200).json({
            message: "User Found",
            data: {
              token,
              user: {
                id: userData._id,
                username: userData.username,
                email: userData.email,
              },
            },
          });
        }
      } else if (userData === null)
        res.status(404).json({ message: "User not found" });
      else res.status(401).json({ message: "Unauthorized Access" });
    }
  } catch (e) {
    console.log(e);
    switch (e.status) {
      case 400:
        if (e.message === "Invalid OTP")
          res.status(400).json({ message: "Provide a valid OTP" });
        break;
      default:
        res.status(500).json({ message: "Internal server error" });
        break;
    }
  }
};

//Delete user service

const userDeleteService = async (req, res) => {
  const { username, password, email, otp } = req.body;
  const id = req.params.id;

  try {
    if (verifyOtp(username, otp)) {
      const deleteUser = await deleteUserService(username, password, id, email);
      if (deleteUser !== null) {
        userDeleted(deleteUser.email, res);
        res.status(200).json({
          message: "Account deleted",
          data: {
            id: deleteUser._id,
            username: deleteUser.username,
            email: deleteUser.email,
          },
        });
      } else if (deleteUser === null) {
        res.status(404).json({ message: "User not found !" });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    }
  } catch (e) {
    switch (e.status) {
      case 400:
        res.status(400).json({ message: "Invalid OTP" });
        break;

      case 403:
        res.status(403).json({ message: "OTP Expired" });

      default:
        res.status(500).json({ message: "Internal server error" });
        break;
    }
  }
};
const sendOTPforgotPassword = async (req, res) => {
  const { user } = req.body;
  try {
    const foundUser = await findUser(user);
    sendPasswordResetOtp(foundUser.email, foundUser.username, res);
  } catch (e) {
    switch (e.status) {
      case 404:
        res.status(404).json({ message: "User does not exist" });
        break;
      default:
        res.status(500).json({ message: "Internal server error" });
    }
  }
};

// Forgot password service

const forgotPasswordController = async (req, res) => {
  const { username, newPassword, otp } = req.body;
  try {
    if (verifyOtp(username, otp)) {
      const hashedPassword = await hashPassword(newPassword);
      await forgotPasswordService(username, hashedPassword);
      res.status(204).json({ message: "Password updated successfully" });
    }
  } catch (e) {
    switch (e.status) {
      case 400:
        res.status(400).json({ message: "Invalid OTP" });
        break;
      case 404:
        res.status(404).json({ message: "User does not exist" });
        break;
      default:
        res.status(500).json({ message: "Internal server error" });
    }
  }
};

//Update Password

const updatePassword = async (req, res) => {
  const { username, password, newPassword } = req.body;
  try {
    const newHashedPassword = await hashPassword(newPassword);
    const savedData = await updatePasswordService(
      username,
      password,
      newHashedPassword,
    );
    if (savedData) {
      res.status(204).json({ message: "Password updated successfully" });
    }
  } catch (e) {
    switch (e.status) {
      case 401:
        res.status(401).json({ message: "Incorrect Password" });
        break;
      case 404:
        res
          .status(404)
          .json({ message: `No user with username: <${username}> exists.` });
        break;
      default:
        res.status(500).json({ message: "Internal server error !" });
        break;
    }
  }
};
// User Profile

const userProfile = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await userProfileService(id);
    res.status(200).json({
      message: "User found",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt,
          totalSavedPassword: user.passwords.length,
          role: user.role,
        },
      },
    });
  } catch (e) {
    if (e.status === 404) {
      res.status(404).json({ message: "User does not exist" });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const checkUsernameService = async (req, res) => {
  const username = req.body.username;
  try {
    const isUserAvailable = await checkUsername(username);
    if (isUserAvailable) {
      res
        .status(200)
        .json({ message: "Username is available", available: true });
    } else {
      res
        .status(200)
        .json({ message: "Username is not available", available: false });
    }
  } catch (e) {
    res.status(500).json({ message: "Internal server error !" });
  }
};
//Update Profile
const updateProfileController = async (req, res) => {
  const userId = req.params.id;
  const { email, firstName, lastName } = req.body;
  try {
    const newData = { email, firstName, lastName };
    const response = await updateProfileService(userId, newData);
    res.status(201).json({ message: "Success", data: response });
  } catch (e) {
    switch (e.status) {
      case 404:
        res.status(404).json({ message: "Account not found" });
        break;
      default:
        res.status(500).json({ message: "Internal server error" });
        break;
    }
  }
};
module.exports = {
  signupService,
  loginService,
  userDeleteService,
  forgotPasswordController,
  sendOTPforgotPassword,
  updatePassword,
  userProfile,
  checkUsernameService,
  updateProfileController,
  loginOTPServiceController,
};
