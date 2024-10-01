import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export function createJWT(credentials: any): any {
  const payload = {
    userId: credentials.userId,
  };
  const secretKey = 'todoTasks';
  const options = {
    expiresIn: '200s'
  };
  try {
    const token = jwt.sign(payload, secretKey, options);
    const jti = uuidv4();
    console.log('Token generated:', token);
    return buildTokenResponse(token, jti);
  } catch (error) {
    console.error('JWT Error:', error);
    throw new Error('jwt Error');
  }
}

function buildTokenResponse(token: string, jti: string) {
  return {
    token,
    token_type: "bearer",
    expires_in: '200s',
    scope: "read admin",
    jti
  };
}

export function verifyJWT(token: string): any {
  const secretKey = 'todoTasks';
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
