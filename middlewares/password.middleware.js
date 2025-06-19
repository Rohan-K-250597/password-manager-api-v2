//Middleware to validate new password credentials
const validateNewPasswordCredentialsMiddleware = (req, res, next) => {
  const platform = req.body.platform?.trim();
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  if ((platform, username, password)) {
    next();
  } else {
    res.status(400).json({
      message: "Platform, Username and Password are minimum required fields",
    });
  }
};
//Middleware to search a unique password by id
const validateGetAccountInfoMiddleware = (req, res, next) => {
  const userId = req.params.id?.trim();
  const passId = req.params.passId?.trim();
  const userPassword = req.body.password?.trim();
  if (userId && passId && userPassword) {
    next();
  } else if (!userId && !passId && !userPassword) {
    res.status(400).json({
      message:
        "User password, account ID and user ID are minimum required fields.",
    });
  } else if (!passId && !userId && userPassword) {
    res
      .status(400)
      .json({ message: "Please add account ID and user password." });
  } else if (passId && !userId && !userPassword) {
    res.status(400).json({ message: "Please add user ID and user password." });
  } else {
    res.status(400).json({ message: "Please add user password" });
  }
};

//Middleware to get all passwords
const validateGetAllPasswordsMiddleware = (req, res, next) => {
  const userId = req.params.id;
  const page = parseInt(req.query.page);

  if (userId && page > 0 && page !== NaN) next();
  else
    res
      .status(400)
      .json({ message: "Please provide a valid user id and page number." });
};
//Middleware to validate search passwords
const validateSearchPasswords = (req, res, next) => {
  const userId = req.params.id;
  const search = req.query.search?.trim();

  if (userId && search.length !== 0) {
    next();
  } else if (search) {
    res.status(400).json({ message: "Search cannot be blank" });
  } else {
    res
      .status(400)
      .json({ message: "Please provide a valid user ID and seach value" });
  }
};

//Middleware to validate password update

const validatePasswordUpdateMiddleware = (req, res, next) => {
  const userId = req.params.id?.trim();
  const passId = req.params.passId?.trim();
  const username = req.body.username?.trim();
  const password = req.body.accPassword?.trim();
  const platform = req.body.platform?.trim();

  if (userId && passId && username && password && platform) {
    next();
  } else if (!userId) {
    res.status(400).json({ message: "User Id is missing." });
  } else {
    res.status(400).json({
      message:
        "User ID, username, account password, description and platform are required fields",
    });
  }
};
const validateSearchPassword = (req, res, next) => {
  const userId = req.params.id?.trim();
  const passId = req.params.passId?.trim();
  if (userId && passId) {
    next();
  } else if (userId) {
    res.status(400).json({ message: "Missing user id" });
  } else {
    res.status(400).json({ message: "Missing password Id" });
  }
};

module.exports = {
  validateNewPasswordCredentialsMiddleware,
  validateGetAccountInfoMiddleware,
  validateGetAllPasswordsMiddleware,
  validateSearchPasswords,
  validatePasswordUpdateMiddleware,
  validateSearchPassword,
};
