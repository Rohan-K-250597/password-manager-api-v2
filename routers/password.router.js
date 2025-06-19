const express = require("express");
const passwordRouter = express.Router();

const {
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
} = require("../controllers/passwordController.controller");
const { tokenValidatorMiddleware } = require("../middlewares/auth.middleware");
const {
  validateNewPasswordCredentialsMiddleware,
  validateGetAccountInfoMiddleware,
  validateGetAllPasswordsMiddleware,
  validateSearchPasswords,
  validatePasswordUpdateMiddleware,
  validateSearchPassword,
} = require("../middlewares/password.middleware");

//POST Requests
passwordRouter.post(
  "/add-password/:id",
  tokenValidatorMiddleware,
  validateNewPasswordCredentialsMiddleware,
  addPasswordToUserService,
);
passwordRouter.post(
  "/update-password/:id/:passId",
  tokenValidatorMiddleware,
  validatePasswordUpdateMiddleware,
  updatePasswordService,
);
passwordRouter.post(
  "/password/:id/:passId",
  tokenValidatorMiddleware,
  validateGetAccountInfoMiddleware,
  getPasswordInfoService,
);
//GET Requests
passwordRouter.get(
  "/password/:id",
  tokenValidatorMiddleware,
  validateSearchPasswords,
  getSearchedPasswordsService,
);
passwordRouter.get(
  "/:id",
  tokenValidatorMiddleware,
  validateGetAllPasswordsMiddleware,
  getAllPasswordsService,
);
passwordRouter.get(
  "/password/:id/:passId",
  tokenValidatorMiddleware,
  validateSearchPassword,
  getBasicPasswordDetailsService,
);
//DELETE ROUTES
passwordRouter.delete(
  "/password/:id/:passId",
  tokenValidatorMiddleware,
  validateSearchPassword,
  deletePasswordService,
);
passwordRouter.post(
  "/favourites/:id/:passId",
  tokenValidatorMiddleware,
  addToFavouritesService,
);
passwordRouter.delete(
  "/favourites/:id/:passId",
  tokenValidatorMiddleware,
  removeFromFavouriteService,
);
passwordRouter.get(
  "/favourites/:id",
  tokenValidatorMiddleware,
  getAllFavouritesService,
);
passwordRouter.get(
  "/dashboard/:id",
  tokenValidatorMiddleware,
  userDashboardService,
);
module.exports = passwordRouter;
