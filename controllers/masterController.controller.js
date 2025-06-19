const { userDeleted } = require("./otpControllers.controller");
const {
  deleteUser,
  adminDashboard,
  viewUserAccount,
  getAllUserPasswords,
  getUserPassword,
  resetUserPassword,
  adminExpiringAccounts,
  toggleLastAccessed,
  searchUser,
} = require("../database-controllers/masterDatabase.controller");

const { decryptPassword } = require("../utils/cryptoPassword");
const { hashPassword } = require("../utils/hashPassword");

//Delete User Controller
const deleteUserController = async (req, res) => {
  const deleteId = req.query.delete;
  const userId = req.params.id;
  try {
    const deletedUser = await deleteUser(deleteId, userId);
    userDeleted(deletedUser.email, res);
    res.status(200).json({ message: "User deleted", data: deletedUser });
  } catch (e) {
    console.log(e);
    switch (e.status) {
      case 401:
        res.status(401).json({ message: "Unauthorized Access" });
        break;
      case 404:
        res.status(404).json({ message: "Account not found" });
        break;
      default:
        res.status(500).json({ message: "Internal server error" });
        break;
    }
  }
};

//Admin Dashboard Controller

const adminDashboardController = async (req, res) => {
  const userId = req.params.id;
  try {
    const dashboard = await adminDashboard(userId);
    res.status(200).json({ message: "Results found", data: dashboard });
  } catch (e) {
    switch (e.status) {
      case 401:
        res.status(401).json({ message: "Unauthorized Access" });
        break;
      default:
        res.status(500).json({ message: "Internal server error" });
        break;
    }
  }
};
//View User Account Details;
const viewUserAccountController = async (req, res) => {
  const userId = req.params.id;
  const accountId = req.query.account;
  try {
    const userData = await viewUserAccount(accountId, userId);
    res.status(200).json({ message: "Result Found", data: userData });
  } catch (e) {
    switch (e.status) {
      case 401:
        res.status(401).json({ message: "Unauthorized Access" });
        break;
      case 404:
        res.status(404).json({ message: "Account not found" });
        break;
      default:
        res.status(500).json({ message: "Internal server error" });
        break;
    }
  }
};

//Get All passwords assciated with an account
const getAllUserPasswordController = async (req, res) => {
  const userId = req.params.id;
  const accountId = req.params.accountId;
  try {
    const userData = await getAllUserPasswords(accountId, userId);
    res.status(200).json({ message: "Result Found", data: userData });
  } catch (e) {
    switch (e.status) {
      case 401:
        res.status(401).json({ message: "Unauthorized Access" });
        break;
      case 404:
        res.status(404).json({ message: "Account not found" });
        break;
      default:
        res.status(500).json({ message: "Internal server error" });
        break;
    }
  }
};
//Get user Password

const getUserPasswordController = async (req, res) => {
  const userId = req.params.id;
  const accountId = req.body.accountId;
  const passID = req.body.passId;
  try {
    const response = await getUserPassword(accountId, userId, passID);
    const accountPass = decryptPassword(response.password);
    res.status(200).json({
      message: "Result Found",
      data: {
        _id: response._id,
        platform: response.platform,
        username: response.username,
        description: response.description,
        password: accountPass,
        lastAccessed: response.lastAccessed,
      },
    });
  } catch (e) {
    switch (e.status) {
      case 1:
        res.status(404).json({ message: "Password-Account not found" });
      case 401:
        res.status(401).json({ message: "Unauthorized Access" });
        break;
      case 404:
        res.status(404).json({ message: "Account not found" });
        break;
      default:
        res.status(500).json({ message: "Internal server error" });
        break;
    }
  }
};

//Reset User Password
const resetUserPasswordController = async (req, res) => {
  const userId = req.params.id;
  const accountId = req.body.accountId;
  const newPassword = req.body.newPassword;
  try {
    const hashedPassword = await hashPassword(newPassword);
    const userData = await resetUserPassword(userId, accountId, hashedPassword);
    res.status(204).json({ message: "Success", data: userData });
  } catch (e) {
    switch (e.status) {
      case 401:
        res.status(401).json({ message: "Unauthorized Access" });
        break;
      case 404:
        res.status(404).json({ message: "Account not found" });
        break;
      default:
        res.status(500).json({ message: "Internal server error" });
        break;
    }
  }
};
//Get Admin expiring accounts

const adminExpiringAccountsController = async (req, res) => {
  const userId = req.params.id;
  try {
    const accountsData = await adminExpiringAccounts(userId);
    res.status(200).json({ message: "Result Found", data: accountsData });
  } catch (e) {
    switch (e.status) {
      case 401:
        res.status(401).json({ message: "Unauthorized Access" });
        break;
      case 404:
        res.status(404).json({ message: "Account not found" });
        break;
      default:
        res.status(500).json({ message: "Internal server error" });
        break;
    }
  }
};

//Toggle last accessed
const toggleLastAccessedController = async (req, res) => {
  const userId = req.params.id;
  const passId = req.params.passId;
  try {
    const lastAccessed = await toggleLastAccessed(userId, passId);
    res.status(200).json({ message: "Result Found", data: lastAccessed });
  } catch (e) {
    switch (e.status) {
      case 1:
        res.status(404).json({ message: "Password Account not found" });
        break;
      case 401:
        res.status(401).json({ message: "Unauthorized Access" });
        break;
      case 404:
        res.status(404).json({ message: "Account not found" });
        break;
      default:
        res.status(500).json({ message: "Internal server error" });
        break;
    }
  }
};

//Search User
const searchUserController=async(req,res)=>{
  const userId=req.params.id;
  const search=req.query.search;
  try{
    const response=await searchUser(userId,search);
    res.status(200).json({message:"Results found",data:response})
  }catch(e){
    switch (e.status) {
      case 401:
        res.status(401).json({ message: "Unauthorized Access" });
        break;
      case 404:
        res.status(404).json({ message: "Account not found" });
        break;
      default:
        res.status(500).json({ message: "Internal server error" });
        break;
    }
  }
}
module.exports = {
  deleteUserController,
  adminDashboardController,
  viewUserAccountController,
  getAllUserPasswordController,
  getUserPasswordController,
  resetUserPasswordController,
  adminExpiringAccountsController,
  toggleLastAccessedController,
  searchUserController
};
