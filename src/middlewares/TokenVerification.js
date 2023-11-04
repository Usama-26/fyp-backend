const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    req.user = jwt.verify(token, 'your-secret-key');
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token.' });
  }
}

module.exports = verifyToken;
