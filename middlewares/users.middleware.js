// Middleware to validate signup credentials
const validateSignupMiddleware = (req, res, next) => {
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();
  const email = req.body.email?.trim();

  // Check if all required fields are present and of type string
  if (
    username &&
    email &&
    password &&
    typeof username === "string" &&
    typeof password === "string" &&
    typeof email === "string"
  ) {
    // Validate email format
    if (email.includes(".com") && email.includes("@")) {
      // Check password length requirement
      if (password.length >= 8) {
        req.body.username = username.trim();
        req.body.password = password.trim();
        req.body.email = email.trim();
        next(); // Proceed to the next middleware
      } else {
        // Respond with error if password is too short
        res.status(400).json({
          error: "Bad Request",
          message: "Password must be at least 8 characters long.",
        });
      }
    } else {
      // Respond with error if email format is invalid
      res.status(400).json({
        error: "Bad Request",
        message:
          "Invalid email ID provided. Please enter a valid email address.",
      });
    }
  } else {
    // Respond with error if any required field is missing
    res.status(400).json({
      error: "Bad Request",
      message: "Missing required fields: username, email, and password.",
    });
  }
};

// Middleware to validate login credentials
const validateLoginMiddleware = (req, res, next) => {
  const user = req.body.username;
  const password = req.body.password;
  const otp = req.body.otp;
  // Check if username and password are present and of type string
  if (
    user &&
    password &&
    typeof user === "string" &&
    typeof password === "string" &&
    typeof otp === "string"
  ) {
    // Check password length requirement
    if (password.length >= 8) {
      req.body.user = user.trim();
      req.body.password = password.trim();
      next(); // Proceed to the next middleware
    } else {
      // Respond with error if password is too short
      res.status(400).json({
        error: "Bad Request",
        message: "Password must be at least 8 characters long.",
      });
    }
  } else if (otp.length !== 6) {
    res.status(400).json({
      message: "Provide a valid OTP",
    });
  } else {
    // Respond with error if username or password is missing or not of type string
    res.status(401).json({
      error: "Unauthorized",
      message:
        "Invalid credentials provided. Please verify your username,password and OTP",
    });
  }
};
const validateLoginOTPMiddleware = (req, res, next) => {
  const user = req.body.username;
  const password = req.body.password;
  // Check if username and password are present and of type string
  if (
    user &&
    typeof user === "string" &&
    password &&
    typeof password === "string"
  ) {
    // Check password length requirement
    if (user.trim()) {
      req.body.user = user.trim();
      next(); // Proceed to the next middleware
    } else if (password && typeof password === "string") {
      res.status(400).json({
        error: "Bad Request",
        message: "Provide a password",
      });
    } else {
      // Respond with error if password is too short
      res.status(400).json({
        error: "Bad Request",
        message: "Provide a username",
      });
    }
  } else {
    // Respond with error if username or password is missing or not of type string
    res.status(401).json({
      error: "Unauthorized",
      message: " Please verify your username .",
    });
  }
};

// Middleware to validate user deletion credentials
const deleterUserMiddleware = (req, res, next) => {
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();
  const otp = req.body.otp?.trim();
  const id = req.params.id?.trim();

  // Check if all required fields are present
  if (username && password && id && otp) {
    next(); // Proceed to the next middleware
  } else {
    // Respond with error if any required field is missing
    res.status(401).json({
      error: "Unauthorized",
      message:
        "Invalid credentials provided. Please verify your username, password and OTP.",
    });
  }
};
// Middleware to validate forgotten password update credentials

const validateAndUpdateForgottenPasswordMiddleware = (req, res, next) => {
  const username = req.body.username?.trim();
  const newPassword = req.body.newPassword?.trim();

  // Check if username and newPassword are present
  if (username && newPassword) {
    // Check newPassword length requirement
    if (newPassword.length >= 8) {
      next(); // Proceed to the next middleware
    } else {
      // Respond with error if newPassword is too short
      res.status(400).json({
        error: "Invalid Password",
        message: "The password must be at least 8 characters long.",
      });
    }
  } else {
    // Respond with error if username or newPassword is missing
    res
      .status(401)
      .json({ error: "Unauthorized", message: "Invalid username or password" });
  }
};

//Middleware to validate password updation

const validateAndUpdatePasswordMiddleware = (req, res, next) => {
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();
  const newPassword = req.body.newPassword?.trim();

  if ((username, password, newPassword)) {
    if (password.length >= 8) {
      if (newPassword.length >= 8) {
        next();
      } else {
        // Respond with error if newPassword is too short
        res.status(400).json({
          error: "Invalid Password",
          message: "The new password must be at least 8 characters long.",
        });
      }
    } else {
      // Respond with error if newPassword is too short
      res.status(400).json({
        error: "Invalid Password",
        message: "The password must be at least 8 characters long.",
      });
    }
  } else {
    // Respond with error if username or newPassword is missing
    res.status(400).json({
      error: "Bad Request",
      message: "Username, password or newpassword fields are missing",
    });
  }
};

//Middleware to validate user id for user profile

const userProfileMiddleware = (req, res, next) => {
  const userId = req.params.id?.trim();
  if (userId) {
    next();
  } else {
    res.status(400).json({ message: "User ID is required" });
  }
};
// Middleware to validate check username

const checkUsernameMiddleware = (req, res, next) => {
  const username = req.body.username?.trim();
  if (username && username.length > 3) {
    next();
  } else if (username.length <= 3) {
    res
      .status(400)
      .json({ message: "username should be atleast 4 characters long." });
  } else {
    res.status(400).json({ message: "Please enter a valid username" });
  }
};
const validateProfileUpdateMiddleware = (req, res, next) => {
  const userId = req.params.id?.trim();
  const firstName = req.body.firstName?.trim();
  const email = req.body.email?.trim();

  if (userId) {
    if (firstName && email && email.includes("@") && email.includes(".com")) {
      next();
    } else {
      res.status(400).json({
        message: "firstName, lastName and email are the required fields.",
      });
    }
  } else {
    res.status(400).json({ message: "Please provide a valid userId" });
  }
};
module.exports = {
  validateSignupMiddleware,
  validateLoginMiddleware,
  deleterUserMiddleware,
  validateAndUpdateForgottenPasswordMiddleware,
  validateAndUpdatePasswordMiddleware,
  userProfileMiddleware,
  checkUsernameMiddleware,
  validateProfileUpdateMiddleware,
  validateLoginOTPMiddleware,
};
