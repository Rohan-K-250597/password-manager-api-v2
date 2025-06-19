const User = require("../models/user.model");
const getUserRole = require("../utils/getUserRole");
//Delete a user
const deleteUser = async (deleteId, userId) => {
  try {
    const isAdmin = await getUserRole(userId);
    if (isAdmin) {
      const deleteUser = await User.findByIdAndDelete(deleteId);
      if (deleteUser) {
        const {_id,firstName,lastName,username}=deleteUser;
        return ({_id,firstName,lastName,username});
      } else {
        const error = new Error("Account not found");
        error.status = 404;
        throw error;
      }
    } else {
      const error = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }
  } catch (e) {
    throw e;
  }
};

//Dashboard
const adminDashboard = async (userId) => {
  try {
    const isAdmin = await getUserRole(userId);
    if (isAdmin) {
      const allUsers = await User.find({});
      const result = allUsers.reduce(
        (acc, curr) => ({
          user: acc.user + 1,
          savedPasswords: acc.savedPasswords + curr.passwords.length,
        }),
        { user: 0, savedPasswords: 0 },
      );
      return result;
    } else {
      const error = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }
  } catch (e) {
    throw e;
  }
};
//User Account
const viewUserAccount = async (accountId, userId) => {
  try {
    const isAdmin = await getUserRole(userId);
    if (isAdmin) {
      const user = await User.findById(accountId);
      if (user) {
        return {
          _id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          createdAt: user.createdAt,
          savedPasswords: user.passwords.length,
        };
      } else {
        const error = new Error("Account not found");
        error.status = 404;
        throw error;
      }
    } else {
      const error = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }
  } catch (e) {
    throw e;
  }
};
//Get All user passwords;

const getAllUserPasswords = async (accountId, userId) => {
  try {
    const isAdmin = await getUserRole(userId);
    if (isAdmin) {
      const user = await User.findById(accountId);
      if (user) {
        const passwords=user.passwords.map(({ _id,username, platform, description }) => ({
          _id,
          username,
          platform,
          description,
        }))
        return ({
          _id:user.id,
          username:user.username,
          firstName:user.firstName,
          lastName:user.lastName,
          role:user.role,
          createdAt:user.createdAt,
          passwords
        });
      } else {
        const error = new Error("Account not found");
        error.status = 404;
        throw error;
      }
    } else {
      const error = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }
  } catch (e) {
    throw e;
  }
};

const getUserPassword = async (accountID, userID, passID) => {
  try {
    const isAdmin = await getUserRole(userID);
    if (isAdmin) {
      const user = await User.findById(accountID);
      if (user) {
        const result = user.passwords.find(({ _id }) => _id.equals(passID));
        if (result) {
          return result;
        } else {
          const error = new Error("Account not found");
          error.status = 1;
          throw error;
        }
      } else {
        const error = new Error("Account not found");
        error.status = 404;
        throw error;
      }
    } else {
      const error = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }
  } catch (e) {
    throw e;
  }
};

const resetUserPassword = async (userID, accountID, newPassword) => {
  try {
    const isAdmin = await getUserRole(userID);
    if (isAdmin) {
      const user = await User.findById(accountID);
      if (user) {
        Object.assign(user, { password: newPassword });
        return await user.save();
      } else {
        const error = new Error("Account not found");
        error.status = 404;
        throw error;
      }
    } else {
      const error = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }
  } catch (e) {
    throw e;
  }
};

//Expiring Accounts

const adminExpiringAccounts = async (userID) => {
  try {
    const isAdmin = await getUserRole(userID);
    const today = new Date();
    if (isAdmin) {
      const user = await User.findById(userID);
      if (user) {
        const expiringAccounts = user.passwords
          .filter((password) => {
            const expirationDate = new Date(password.lastAccessed);
            expirationDate.setDate(
              expirationDate.getDate() + password.remindAfterDays,
            );

            return expirationDate <= today && password.remindAfterDays > 0;
          })
          .map((password) => ({
            _id: password._id,
            platform: password.platform,
            username: password.username,
            remindAfterDays: password.remindAfterDays,
            description: password.description,
            lastAccessed: password.lastAccessed,
          }));
        return expiringAccounts;
      } else {
        const error = new Error("Account not found");
        error.status = 404;
        throw error;
      }
    } else {
      const error = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }
  } catch (e) {
    throw e;
  }
};
//Toggle last accessed

const toggleLastAccessed = async (userID, passID) => {
  try {
    const isAdmin = await getUserRole(userID);
    if (isAdmin) {
      const user = await User.findById(userID);
      if (user) {
        const password = user.passwords.id(passID);
        if (password) {
          Object.assign(password, { lastAccessed: Date.now() });
          await user.save();
          return password;
        } else {
          const error = new Error("Account not found");
          error.status = 1;
          throw error;
        }
      } else {
        const error = new Error("Account not found");
        error.status = 404;
        throw error;
      }
    } else {
      const error = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }
  } catch (e) {
    throw e;
  }
};
//Search User
const searchUser=async(userID,search)=>{
  try {
    const isAdmin = await getUserRole(userID);
    if (isAdmin) {
      const regex=new RegExp(search,'i')
      const user = await User.find({username:regex});
      if (user) {
        return (user.map(({_id,username,firstName,lastName})=>({_id,username,firstName,lastName})))
      } else {
        const error = new Error("Account not found");
        error.status = 404;
        throw error;
      }
    } else {
      const error = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }
  } catch (e) {
    throw e;
  }
}
module.exports = {
  deleteUser,
  adminDashboard,
  viewUserAccount,
  getAllUserPasswords,
  getUserPassword,
  resetUserPassword,
  adminExpiringAccounts,
  toggleLastAccessed,
  searchUser
};
