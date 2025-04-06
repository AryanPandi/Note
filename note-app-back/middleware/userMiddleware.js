const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied', isAuth: false });
    }

    jwt.verify(token, process.env.JWT_SEC, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token', isAuth: false });
        }

        req.user = decoded;
        next();
    });
};
module.exports = checkAuth;