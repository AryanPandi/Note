const express = require('express');
const userRouters = express.Router();
const {register,login,forgetpassword,resetpassword,checkAuth} = require('../controllers/userController'); // Adjust path as needed

// User routes mapped to controller methods
userRouters.post('/register', register);
userRouters.post('/login', login);
userRouters.post('/forgetpassword', forgetpassword);
userRouters.get('/reset-password/:id/:token', resetpassword);
userRouters.post('/reset-password/:id/:token', resetpassword);
userRouters.get('/check-auth', checkAuth);

module.exports = userRouters;
