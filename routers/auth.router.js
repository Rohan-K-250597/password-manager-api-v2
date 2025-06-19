const express = require("express");
const userRouter = express.Router();

const {
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
} = require("../controllers/userControllers.controller");
const {
  validateSignupMiddleware,
  validateLoginMiddleware,
  deleterUserMiddleware,
  validateAndUpdateForgottenPasswordMiddleware,
  validateAndUpdatePasswordMiddleware,
  userProfileMiddleware,
  checkUsernameMiddleware,
  validateProfileUpdateMiddleware,
  validateLoginOTPMiddleware,
} = require("../middlewares/users.middleware");
const {
  tokenValidatorMiddleware,
  decodeToken,
} = require("../middlewares/auth.middleware");
const {
  OTPValidationMiddleware,
  requestToDeleteUserOTP,
  forgotPasswordRequest,
} = require("../middlewares/otpValidation.middleware");
const { deleteUserOTP } = require("../controllers/otpControllers.controller");

//POST Requests
userRouter.post("/signup", validateSignupMiddleware, signupService);
userRouter.post(
  "/login-otp",
  validateLoginOTPMiddleware,
  loginOTPServiceController,
);
userRouter.post("/login", validateLoginMiddleware, loginService);

//OTP Verification for user deletion
userRouter.post(
  "/send-delete-otp/:id",
  tokenValidatorMiddleware,
  requestToDeleteUserOTP,
  deleteUserOTP,
);
userRouter.post(
  "/forgot-password/send-otp",
  forgotPasswordRequest,
  sendOTPforgotPassword,
);
userRouter.post(
  "/update-password/:id",
  tokenValidatorMiddleware,
  validateAndUpdatePasswordMiddleware,
  updatePassword,
);
userRouter.post(
  "/reset-password",
  OTPValidationMiddleware,
  validateAndUpdateForgottenPasswordMiddleware,
  forgotPasswordController,
);
userRouter.post(
  "/update-profile/:id",
  tokenValidatorMiddleware,
  validateProfileUpdateMiddleware,
  updateProfileController,
);
//DELETE Routes

userRouter.post(
  "/users/:id",
  tokenValidatorMiddleware,
  userProfileMiddleware,
  userProfile,
);
userRouter.delete(
  "/authorize-delete/:id",
  tokenValidatorMiddleware,
  OTPValidationMiddleware,
  deleterUserMiddleware,
  userDeleteService,
);
userRouter.post(
  "/check-username",
  checkUsernameMiddleware,
  checkUsernameService,
);
userRouter.get("/verify-token", (req, res) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      const response = decodeToken(token);
      if (response) {
        res.status(200).json({ message: "Valid" });
      }
    } else {
      const error = new Error("No token");
      error.status(400);
      throw error;
    }
  } catch (e) {
    switch (e.status) {
      case 400:
        res.status(400).json({ message: "Provide a valid token" });
        break;
      default:
        res.status(401).json({ message: "Token Expired" });
        break;
    }
  }
});
module.exports = { userRouter };
