// auth.js
import Jwt from 'jsonwebtoken';
import ENV from '../config.js';

export default async function Auth(req, res, next) {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: 'Authentication failed. Token missing.' });
    }

    // Verify the token and extract user information
    const decodedToken = Jwt.verify(token.replace('Bearer ', ''), ENV.JWT_SECRET); // Replace 'your-secret-key' with your actual secret key

    // Set the user information in req.user
    req.user = decodedToken;

    // Call next() to pass control to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
}


export function localvariables(req, res, next){
    req.app.locals={
        OTP:null,
        resetSession:false
    }
    next()
}