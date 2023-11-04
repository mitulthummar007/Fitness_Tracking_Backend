const jwt = require('jsonwebtoken');


// Middleware to authenticate JWT tokens
function authenticateToken(req, res, next) {
  // const token = req.cookies.token;
  const token = req.headers['authorization'];
  if (!token) {
      return res.status(401).json({ message: 'Token not found' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
          return res.status(403).json({ message: 'Invalid token' });
      }

      req.user = user;
      next();
  });
}

  module.exports = authenticateToken