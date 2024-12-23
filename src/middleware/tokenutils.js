const jwt = require('jsonwebtoken');

// Secret key for signing tokens
const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

/**
 * Generate a JWT for a given user ID.
 * @param {string} userId - The user's unique identifier.
 * @returns {string} - The generated JWT.
 */
function generateToken(userId) {
  const payload = { userId }; // Payload contains the user's ID
  const options = { expiresIn: '1h' }; // Token expires in 1 hour

  try {
    return jwt.sign(payload, SECRET_KEY, options);
  } catch (error) {
    console.error('Error generating token:', error.message);
    throw new Error('Token generation failed');
  }
}

/**
 * Middleware to verify JWT from the request headers.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization']; // Get Authorization header

  // If Authorization header is missing
  if (!authHeader) {
    console.error('Authorization header missing'); // Logs the error
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // If token is missing in "Bearer <token>" format
  const token = authHeader.split(' ')[1];
  if (!token) {
    console.error('Token missing in Authorization header');
    return res.status(401).json({ message: 'Access denied. Token is missing.' });
  }

  // Verify token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error('Token Verification Error:', err.message);
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }

    req.userId = decoded.userId;
    console.log('Token verified successfully. Decoded:', decoded);
    next();
  });
}



module.exports = { generateToken, verifyToken };
