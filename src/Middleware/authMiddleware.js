import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../Config/serverConfig.js';
import User from '../Schema/user.js';

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];

    if (!token) {
      return res.status(403).json({
        success: false,
        message: 'No auth token provided'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: 'Invalid auth token provided'
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'User not found'
      });
    }

    req.userId = user.id;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);

    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired auth token'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
