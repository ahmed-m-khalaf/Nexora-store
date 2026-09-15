import { AuthError, getUserFromToken } from '../services/authService.js';

const getBearerToken = (req) => {
  const header = req.headers.authorization;
  if (typeof header !== 'string' || !header.startsWith('Bearer ')) return null;
  const token = header.slice(7).trim();
  return token || null;
};

export const requireAuth = async (req, _res, next) => {
  try {
    const token = getBearerToken(req);
    if (!token) throw new AuthError(401, 'Authentication required.');
    req.user = await getUserFromToken(token);
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuth = async (req, _res, next) => {
  try {
    const token = getBearerToken(req);
    if (token) req.user = await getUserFromToken(token);
    next();
  } catch {
    // Auth is optional: if token is invalid or expired, continue as guest
    req.user = null;
    next();
  }
};
