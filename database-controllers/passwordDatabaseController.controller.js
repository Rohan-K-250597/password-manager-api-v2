const User = require("../models/user.model");
const verifyPassword = require("../utils/verifyPassword");

const addPasswordToUser = async (userId, newPassword) => {
  try {
    const user = await User.findById(userId);
    if (user) {
      const checkSavedPassword = user.passwords.findIndex(
        ({ username, platform }) =>
          username === newPassword.username &&
          platform === newPassword.platform,
      );
      if (checkSavedPassword === -1) {
        user.passwords.push(newPassword);
        await user.save();
        const {
          _id,
          username,
          platform,
          description,
          remindAfterDays,
          isFavourite,
          website,
        } = user.passwords[user.passwords.length - 1];
        return user.role === "admin"
          ? {
              _id,
              username,
              platform,
              description,
              remindAfterDays,
              website,
              isFavourite,
            }
          : { _id, username, platform, description, website, isFavourite };
      } else {
        const error = new Error("Username already associated with a password.");
        error.status = 409;
        throw error;
      }
    } else {
      const error = new Error("User no found !");
      error.status = 404;
      throw error;
    }
  } catch (e) {
    throw e;
  }
};

const getAccountData = async (userId, passwordId, userPassword) => {
  try {
    const isValid = await verifyPassword(userId, userPassword);
    if (isValid) {
      const user = await User.findById(userId);
      const password = user.passwords.find(({ _id }) => _id.equals(passwordId));
      if (password !== null && password !== undefined) {
        const passwordData =
          user.role === "admin"
            ? {
                _id: password._id,
                platform: password.platform,
                password: password.password,
                username: password.username,
                description: password.description,
                website: password.website,
                isFavourite: password.isFavourite,
                remindAfterDays: password.remindAfterDays,
              }
            : {
                _id: password._id,
                platform: password.platform,
                password: password.password,
                username: password.username,
                website: password.website,
                description: password.description,
                isFavourite: password.isFavourite,
              };
        return passwordData;
      } else {
        const error = new Error("Accout does not exist !");
        error.status = 404;
        throw error;
      }
    } else {
      const error = new Error("Unauthorized Access!");
      error.status = 401;
      throw error;
    }
  } catch (e) {
    throw e;
  }
};

const getAllPasswords = async (userId, index) => {
  try {
    const foundUser = await User.findById(userId);
    if (foundUser) {
      const startIndex = index - 1 === 0 ? 0 : (index - 1) * 16;
      const lastIndex = index * 16;
      const results = foundUser.passwords.slice(startIndex, lastIndex);
      return {
        data: results.map((ele) => ({
          _id: ele._id,
          username: ele.username,
          platform: ele.platform,
          website: ele.website,
          isFavourite: ele.isFavourite,
          description: ele.description,
        })),
        totalPasswords: foundUser.passwords.length,
      };
    } else {
      const error = new Error("Username not found");
      error.status = 404;
      throw error;
    }
  } catch (e) {
    throw e;
  }
};

//Searched Passwords

const getSearchedPasswords = async (userId, key) => {
  try {
    const user = await User.findById(userId);
    if (user) {
      const results = user.passwords.filter(
        ({ username, platform, description }) =>
          username.toLocaleLowerCase().includes(key) ||
          platform.toLocaleLowerCase().includes(key) ||
          description.toLowerCase().includes(key),
      );
      return results.map((ele) => ({
        _id: ele._id,
        username: ele.username,
        platform: ele.platform,
        website: ele.website,
        isFavourite: ele.isFavourite,
        description: ele.description,
      }));
    } else {
      const error = new Error("User does not exist");
      error.status = 404;
      throw error;
    }
  } catch (e) {
    throw e;
  }
};
//Update Password
const updatePassword = async (userId, passId, update) => {
  try {
    const user = await User.findById(userId);
    if (user) {
      const findPassword = user.passwords.id(passId);
      if (findPassword) {
        Object.assign(findPassword, update);
        await user.save();
        if (user.role === "admin") {
          console.log(findPassword);
          return {
            _id: passId,
            username: update.username,
            platform: update.platform,
            description: update.description,
            isFavourite: update.isFavourite,
            website: update.website,
            remindAfterDays:
              update?.remindAfterDays || findPassword?.remindAfterDays,
          };
        } else {
          return {
            _id: passId,
            username: update.username,
            platform: update.platform,
            website: update.website,
            isFavourite: update.isFavourite,
            description: update.description,
          };
        }
      } else {
        const error = new Error("Password");
        error.status = 404;
        throw error;
      }
    } else {
      const error = new Error("User does not exist");
      error.status = 404;
      throw error;
    }
  } catch (e) {
    throw e;
  }
};

//Delete Password
const deletePassword = async (userId, passId) => {
  try {
    const user = await User.findById(userId);
    if (user) {
      const foundPassword = user.passwords.id(passId);
      if (foundPassword) {
        user.passwords.pull({ _id: passId });
        if (user.favourites.id(passId)) {
          user.favourites.pull({ _id: passId });
        }
        return await user.save();
      } else {
        const error = new Error("Password");
        error.status = 404;
        throw error;
      }
    } else {
      const error = new Error("User does not exist.");
      error.status = 404;
      throw error;
    }
  } catch (e) {
    throw e;
  }
};
const getBasicPasswordInfo = async (userId, passwordId) => {
  try {
    const user = await User.findById(userId);
    if (user) {
      const foundPassword = user.passwords.id(passwordId);
      if (foundPassword) {
        const { _id, username, platform, description, website, isFavourite } =
          foundPassword;
        return { _id, username, platform, description, website };
      } else {
        const error = new Error("Password");
        error.status = 404;
        throw error;
      }
    } else {
      const error = new Error("User does not exist");
      error.status = 404;
      throw error;
    }
  } catch (e) {
    throw e;
  }
};

//Add password to favourites
const addToFavourites = async (userId, passId) => {
  try {
    const user = await User.findById(userId);
    if (user) {
      const password = user.passwords.id(passId);
      if (password) {
        if (user.favourites.id(passId)) {
          return true;
        } else {
          user.favourites.push(password);
          password.isFavourite = true;
          return await user.save();
        }
      } else {
        const error = new Error("Password not found");
        error.status = 403;
        throw error;
      }
    } else {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }
  } catch (e) {
    throw e;
  }
};
//Remove from favourites
const removeFromFavourites = async (userId, passId) => {
  try {
    const user = await User.findById(userId);
    if (user) {
      const foundPassword = user.favourites.id(passId);
      const password = user.passwords.id(passId);
      if (foundPassword) {
        user.favourites.pull({ _id: passId });
        password.isFavourite = false;
        return user.save();
      } else {
        return false;
      }
    } else {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }
  } catch (e) {
    throw e;
  }
};
//Get all Favourites
const getAllFavourites = async (userId) => {
  try {
    const foundUser = await User.findById(userId);
    if (foundUser) {
      return {
        data: foundUser.favourites.map((ele) => ({
          _id: ele._id,
          username: ele.username,
          platform: ele.platform,
          description: ele.description,
          website: ele.website,
        })),
        totalPasswords: foundUser.favourites.length,
      };
    } else {
      const error = new Error("Username not found");
      error.status = 404;
      throw error;
    }
  } catch (e) {
    throw e;
  }
};
const userDashboard = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (user) {
      return {
        totalPassword: user.passwords.length,
        favourites: user.favourites.length,
      };
    } else {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }
  } catch (e) {
    throw e;
  }
};
module.exports = {
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
};
