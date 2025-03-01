const express = require('express');
const userRouters = express.Router();
const { login, register, forgetpassword, resetpassword, checkAuth } = require("../controllers/userController");

// Define routes using method chaining for clarity
userRouters.route("/login").post(login);
userRouters.route("/register").post(register);
userRouters.route('/forgetpassword').post(forgetpassword);
userRouters.route('/reset-password/:id/:token')
  .get(resetpassword)   // Handle GET request
  .post(resetpassword); //
userRouters.route('/check-auth').get(checkAuth);

module.exports = userRouters;
