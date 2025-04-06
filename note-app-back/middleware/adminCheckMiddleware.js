// middleware/checkAdmin.js
const User = require('../model/noteUser'); // Assuming User is the model you created

const checkAdmin = (req, res, next) => {
    const userId = req.params.id; // Assuming user ID is stored in `req.user.id` after authentication

    User.findById(userId)
        .then(user => {
            if (user && user.role === 'admin') {
                next(); // If user is an admin, proceed to the next middleware
            } else {
                return res.status(403).json({ message: 'Access denied. Admins only.' });
            }
        })
        .catch(err => {
            return res.status(500).json({ message: 'Server error' });
        });
};

module.exports = checkAdmin;