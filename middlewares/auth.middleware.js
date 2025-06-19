require("dotenv").config();
const jwt = require("jsonwebtoken");

const decodeToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    return decoded;
  } catch (e) {
    const error = new Error("Invalid token");
    error.status = 401;
    throw error;
  }
};

const extractUserIdFromToken = (decodedToken) => {
  if (decodedToken && decodedToken.id) {
    return decodedToken.id;
  } else {
    throw new Error("Missing userID in token");
  }
};

const tokenValidatorMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  const receivedParamsId = req.params.id;
  const receivedBodyId = req.body.id;
  try {
    const decoded = decodeToken(token);
    const userId = extractUserIdFromToken(decoded);
    req.user = { userId };
    if (receivedBodyId === userId || receivedParamsId === userId) {
      next();
    } else if (!receivedBodyId && !receivedParamsId) {
      res.status(401).json({ message: "Please provide user ID" });
    } else {
      res.status(401).json({ message: "Unauthorized Access" });
    }
  } catch (e) {
    console.log(e);
    switch (e.status) {
      case 401:
        res.status(401).json({
          message: "Unauthorised access, token expired",
        });
        break;
      default:
        res.status(401).json({
          message: "Unauthorised access, please add a valid Token",
        });
        break;
    }
  }
};
module.exports = {
  tokenValidatorMiddleware,
  decodeToken,
};
