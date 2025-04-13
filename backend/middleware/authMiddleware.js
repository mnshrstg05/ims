const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    // Get the token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');  // Removing "Bearer " prefix

    if (!token) {
        return res.status(401).json({ message: 'No token found, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, 'pfixs');  // The same secret key used to sign the token
        req.userId = decoded.userId;  // Add userId to the request object (for use in the next handler)
        next();  // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticateUser;
