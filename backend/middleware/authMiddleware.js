// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Guard 1: Verify the user is logged in via a valid JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No authentication token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attaches { id, email, role } straight to the request object
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Access Denied: Invalid or expired token.' });
  }
};

// Guard 2: Verify the user has the correct role permissions
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access Denied: You do not have permission to view this resource.' });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  checkRole
};