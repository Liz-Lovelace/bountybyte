import bcrypt from 'bcrypt';
import crypto from 'crypto';
import base64url from 'base64url';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_ARBITRARY_SECRET || process.env.JWT_ARBITRARY_SECRET.length < 10) {
  throw new Error('JWT_ARBITRARY_SECRET environment variable is not set, or is too short');
}

export async function hashPassword(password) {
  if (!password || password.length <= 1) {
    throw new Error('Password is too short, something is probably broken. Password: ' + password);
  }
  let saltRounds = 13;
  return await bcrypt.hash(password, saltRounds);
}

export async function isPasswordCorrect(password, hash) {
  return await bcrypt.compare(password, hash);
}

export function signJWT(payload) {
  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = crypto
    .createHmac('sha256', process.env.JWT_ARBITRARY_SECRET)
    .update(encodedPayload)
    .digest();

  return `${encodedPayload}.${base64url.encode(signature)}`;
}

export function parseJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) {
      return null;
    }

    const [encodedPayload, providedSignature] = parts;
    
    const expectedSignature = crypto
      .createHmac('sha256', process.env.JWT_ARBITRARY_SECRET)
      .update(encodedPayload)
      .digest();

    const providedSignatureBuffer = base64url.toBuffer(providedSignature);

    if (!crypto.timingSafeEqual(expectedSignature, providedSignatureBuffer)) {
      return null;
    }

    return JSON.parse(base64url.decode(encodedPayload));
  } catch (e) {
    return null;
  }
}
