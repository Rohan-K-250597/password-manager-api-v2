const {
  addPasswordToUser,
  getAccountData,
  getAllPasswords,
  getSearchedPasswords,
  updatePassword,
  deletePassword,
  getBasicPasswordInfo,
  addToFavourites,
  removeFromFavourites,
  getAllFavourites,
  userDashboard,
} = require("../database-controllers/passwordDatabaseController.controller");
const { encryptPassword, decryptPassword } = require("../utils/cryptoPassword");

//Add Password
const addPasswordToUserService = async (req, res) => {
  const userId = req.params.id;
  const platform = req.body.platform;
  const password = req.body.password;
  const username = req.body.username;
  const description = req.body.description;
  const website = req.body.site;
  const remindAfterDays = parseInt(req.body.remindAfterDays) || -1;
  console.log(platform, password, username, description, website);
  try {
    const encryptedPassword = encryptPassword(password);
    const newPassword = {
      platform,
      password: encryptedPassword,
      username,
      description,
      website,
      remindAfterDays,
    };
    const savedUserPassword = await addPasswordToUser(userId, newPassword);
    res
      .status(201)
      .json({ message: "Password added", data: savedUserPassword });
  } catch (e) {
    console.log(e);
    switch (e.status) {
      case 404:
        res.status(404).josn({ message: "User does not exist !" });
        break;
      case 409:
        res
          .status(409)
          .json({ message: "Username already associated with a password !" });
        break;
      default:
        res.status(500).json({ message: "Internal Server Error !" });
        break;
    }
  }
};

const getPasswordInfoService = async (req, res) => {
  const passwordId = req.params.passId;
  const userId = req.params.id;
  const userPassword = req.body.password;
  console.log(req.body, userId, passwordId);
  try {
    const foundData = await getAccountData(userId, passwordId, userPassword);
    const passwordData = decryptPassword(foundData.password);
    res.status(200).json({ ...foundData, password: passwordData });
  } catch (e) {
    console.log(e);
    switch (e.status) {
      case 401:
        res.status(401).json({ message: `Unauthorized Access` });
        break;
      case 404:
        res.status(404).json({ message: "Account does not exist" });
        break;
      default:
        res.status(500).json({ message: "Internal Server Error!" });
        break;
    }
  }
};

const getAllPasswordsService = async (req, res) => {
  const userId = req.params.id;
  const page = parseInt(req.query.page);
  try {
    const passwords = await getAllPasswords(userId, page);
    res.status(200).json({ message: "Saved Passwords", ...passwords });
  } catch (e) {
    switch (e.status) {
      case 404:
        res
          .status(404)
          .json({ message: "No user with existing user id found" });
        break;
      default:
        res.status(500).json({ message: "Internal server error." });
        break;
    }
  }
};

//Search Passwords
const getSearchedPasswordsService = async (req, res) => {
  const userId = req.params.id;
  const search = req.query.search.toLowerCase();
  try {
    const searchedPasswords = await getSearchedPasswords(userId, search);
    res
      .status(200)
      .json({ message: "Searched results", data: searchedPasswords });
  } catch (e) {
    switch (e.status) {
      case 404:
        res.status(404).json({ message: "User does not exist." });
        break;
      default:
        res.status(500).json({ message: "Internal server error." });
        break;
    }
  }
};

//Update Passwords

const updatePasswordService = async (req, res) => {
  const userId = req.params.id;
  const {
    accPassword,
    username,
    description,
    platform,
    remindAfterDays,
    website,
  } = req.body;
  const passId = req.params.passId;
  try {
    const encryptedPassword = encryptPassword(accPassword);
    const passwordUpdate = {
      platform,
      password: encryptedPassword,
      username,
      description,
      remindAfterDays,
      website,
    };

    const savedData = await updatePassword(userId, passId, passwordUpdate);
    res
      .status(201)
      .json({ message: "Password updated successfully", data: savedData });
  } catch (e) {
    switch (e.status) {
      case 404:
        if (e.message.toLowerCase() === "password")
          res.status(404).json({ message: "Account does not exist." });
        else res.status(404).json({ message: "User does not exist." });
        break;
      default:
        res.status(500).json({ message: "Internal server error." });
        break;
    }
  }
};
// Delete Password

const deletePasswordService = async (req, res) => {
  const userId = req.params.id;
  const passId = req.params.passId;
  try {
    await deletePassword(userId, passId);
    res.status(204).json({ message: "Password deleted successfully" });
  } catch (e) {
    switch (e.status) {
      case 404:
        if (e.message.toLowerCase() === "password")
          res.status(404).json({ message: "Account does not exist." });
        else res.status(404).json({ message: "User does not exist." });
        break;
      default:
        res.status(500).json({ message: "Internal server error." });
        break;
    }
  }
};
const getBasicPasswordDetailsService = async (req, res) => {
  const userId = req.params.id;
  const passId = req.params.passId;
  try {
    const data = await getBasicPasswordInfo(userId, passId);
    res.status(200).json({ message: "Success", data });
  } catch (e) {
    switch (e.status) {
      case 404: {
        if (e.message === "Password") {
          res.status(404).json({ message: "Password does not exist" });
        } else res.status(404).json({ message: "Password does not exist" });
      }
      default:
        res.status(500).json({ message: "Internal Server Error" });
        break;
    }
  }
};
//Add password to favourites
const addToFavouritesService = async (req, res) => {
  const { id, passId } = req.params;
  try {
    const favourites = await addToFavourites(id, passId);
    if (favourites === true)
      res.status(409).json({ message: "Password exists in favourites" });
    else res.status(200).json({ message: "Added to favourites" });
  } catch (e) {
    console.log(e);
    switch (e.status) {
      case 403:
        res.status(404).json({ message: "Password does not exist" });
        break;
      case 404:
        res.status(404).json({ message: "User does not exist" });
        break;
      default:
        res.status(500).json({ message: "Internal server error" });
        break;
    }
  }
};
//remove password from favourites
const removeFromFavouriteService = async (req, res) => {
  const { id, passId } = req.params;
  try {
    const favourites = await removeFromFavourites(id, passId);
    if (favourites === false)
      res
        .status(404)
        .json({ message: "Password does not exists in favourites" });
    else res.status(200).json({ message: "Removed from favourites" });
  } catch (e) {
    console.log(e);
    switch (e.status) {
      case 404:
        res.status(404).json({ message: "User does not exist" });
        break;
      default:
        res.status(500).json({ message: "Internal server error" });
        break;
    }
  }
};

const getAllFavouritesService = async (req, res) => {
  const userId = req.params.id;
  try {
    const favourites = await getAllFavourites(userId);
    res.status(200).json({ message: "Favourites", data: favourites });
  } catch (e) {
    switch (e.status) {
      case 404:
        res.status(404).json({ message: "User does not exist" });
        break;
      default:
        res.status(500).json({ message: "Internal Server Error" });
        break;
    }
  }
};
const userDashboardService = async (req, res) => {
  const userId = req.params.id;
  try {
    const data = await userDashboard(userId);
    res.status(200).json({ data });
  } catch (e) {
    switch (e.status) {
      case 404:
        res.status(404).json({ message: "User does not exist" });
        break;
      default:
        res.status(500).json({ message: "Internal Server Error" });
        break;
    }
  }
};
module.exports = {
  addPasswordToUserService,
  getPasswordInfoService,
  getAllPasswordsService,
  getSearchedPasswordsService,
  updatePasswordService,
  deletePasswordService,
  getBasicPasswordDetailsService,
  addToFavouritesService,
  removeFromFavouriteService,
  getAllFavouritesService,
  userDashboardService,
};
