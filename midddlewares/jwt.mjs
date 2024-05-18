import jwt from "jsonwebtoken"
import dotenv from 'dotenv';

dotenv.config();

export const  generateAccessToken = async ({id, email, username}) => {
    const payload = {
      id: id,
      email: email,
      username: username
    };
    
    const secret = process.env.SECRET_KEY;
    const options = { expiresIn: '1h' };
  
    return jwt.sign(payload, secret, options);
}


export const verifyAccessToken = async (token) => {
    const secret = process.env.SECRET_KEY;
  
    try {
      const decoded = await jwt.verify(token, secret);
      return { success: true, data: decoded };
    } catch (error) {
      return { success: false, error: error.message };
    }
}