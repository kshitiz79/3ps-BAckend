const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key';
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET || 'default_refresh_key';

/**
 * Generate an access token.
 * @param {string} userId - User ID.
 * @returns {string} - Access token.
 */
function generateAccessToken(userId) {
  const payload = { userId };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '15m' }); // Expires in 15 minutes
}

/**
 * Generate a refresh token.
 * @param {string} userId - User ID.
 * @returns {string} - Refresh token.
 */
function generateRefreshToken(userId) {
  const payload = { userId };
  return jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: '7d' }); // Expires in 7 days
}

/**
 * Middleware to verify access token.
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.userId = decoded.userId;
    next();
  });
}

module.exports = { generateAccessToken, generateRefreshToken, verifyToken };
