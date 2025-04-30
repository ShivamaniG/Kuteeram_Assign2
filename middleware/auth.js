const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    try {
      console.log('Authorization Header:', req.headers.authorization);
  
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Bearer token
  
      if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'No token provided' });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded Token:', decoded); 
  
      if (!decoded.userId) {  
        console.log('Invalid token: No user ID found');
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      req.user = await User.findById(decoded.userId);  
      console.log('User found:', req.user); 
  
      if (!req.user) {
        console.log('User not found');
        return res.status(401).json({ message: 'User not found' });
      }
  
      next();
    } catch (err) {
      console.error('Authorization error:', err); 
      res.status(401).json({ message: 'Not authorized', error: err.message });
    }
  };
  