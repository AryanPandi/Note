const express = require('express');
const userRouters = express.Router();
const { login, register, forgetpassword, resetpassword } = require("../controllers/userController");

// Define routes using method chaining for clarity
userRouters.route("/login").post(login);
userRouters.route("/register").post(register);
userRouters.route('/forgetpassword').post(forgetpassword);
userRouters.route('/reset-password/:id/:token')
  .get(resetpassword)   // Handle GET request
  .post(resetpassword); //

module.exports = userRouters;
