// middleware/checkToken.js
const jwt = require('jsonwebtoken');

function checkToken(req, res, next) {
    // Get token from the request headers
    const token = req.header('Authorization');

    // Check if token is missing
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, 'jwtPlutosSecret');
        req.user = decoded.user;
        next();

    } catch (error) {
        console.error(error.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
}

module.exports = checkToken;