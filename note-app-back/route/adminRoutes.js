const express = require('express');
const isAdmin = require('../middleware/adminCheckMiddleware'); // The admin check middleware
const adminController = require('../controllers/adminController');


const router = express.Router();
router.get('/users/:id', isAdmin, adminController.getAllUsers);
router.get('/getAdminUser/:id', isAdmin, adminController.getAdminUser);
router.delete('/users/:id', isAdmin, adminController.deleteUser);


module.exports = router;