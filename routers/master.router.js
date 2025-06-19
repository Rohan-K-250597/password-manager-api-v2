const express = require("express");
const masterRouter = express.Router();

const {
  deleteUserController,
  adminDashboardController,
  viewUserAccountController,
  getAllUserPasswordController,
  getUserPasswordController,
  resetUserPasswordController,
  adminExpiringAccountsController,
  toggleLastAccessedController,
  searchUserController,
} = require("../controllers/masterController.controller");
const { tokenValidatorMiddleware } = require("../middlewares/auth.middleware");

masterRouter.delete("/delete-user/:id",tokenValidatorMiddleware,deleteUserController);
masterRouter.get("/dashboard/:id",tokenValidatorMiddleware,adminDashboardController);
masterRouter.get("/user/:id",tokenValidatorMiddleware,viewUserAccountController);
masterRouter.get("/user/:id/:accountId",tokenValidatorMiddleware,getAllUserPasswordController);
masterRouter.get("/user-password/:id",tokenValidatorMiddleware,getUserPasswordController);
masterRouter.get("/accounts/:id",adminExpiringAccountsController);
masterRouter.get("/users/:id",tokenValidatorMiddleware,searchUserController)
masterRouter.post("/reset-password/:id",tokenValidatorMiddleware,resetUserPasswordController);
masterRouter.put("/last-accessed/:id/:passId",toggleLastAccessedController);
module.exports = masterRouter;
