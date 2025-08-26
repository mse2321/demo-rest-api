import jwt from 'jsonwebtoken';

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'testtoken';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object containing id and email
 * @param {number} user.id - User ID
 * @param {string} user.email - User email
 * @returns {string} JWT token
 */
function generateToken(user) {
  try {
    if (!user || !user.id || !user.email) {
      throw new Error('Invalid user data for token generation');
    }

    const payload = {
      userId: user.id,
      email: user.email,
      iat: Math.floor(Date.now() / 1000), // Issued at
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      algorithm: 'HS256'
    });

    return token;
  } catch (error) {
    throw new Error(`Token generation failed: ${error.message}`);
  }
}

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
function verifyToken(token) {

    if (!token) {
      throw new Error('No token provided');
    }

    // Remove 'Bearer ' prefix if present
    const cleanToken = token.replace(/^Bearer\s+/, '');

    const decoded = jwt.verify(cleanToken, JWT_SECRET, {
      algorithms: ['HS256']
    });

    return {
      isValid: true,
      payload: decoded,
      message: 'Token is valid'
    };
}

/**
 * Extract user information from a JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} User information (userId and email) or null if invalid
 */
function extractUserFromToken(token) {
  const result = verifyToken(token);
  
  if (result.isValid && result.payload) {
    return {
      userId: result.payload.userId,
      email: result.payload.email
    };
  }
  
  return null;
}

/**
 * Middleware function to authenticate requests using JWT
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required',
      message: 'No authorization token provided' 
    });
  }

  const result = verifyToken(token);
  
  if (!result.isValid) {
    return res.status(403).json({ 
      error: 'Invalid token',
      message: result.message 
    });
  }

  // Add user info to request object
  req.user = {
    userId: result.payload.userId,
    email: result.payload.email
  };
  
  next();
}

export { 
  generateToken, 
  verifyToken, 
  extractUserFromToken, 
  authenticateToken,
  JWT_SECRET,
  JWT_EXPIRES_IN
};
