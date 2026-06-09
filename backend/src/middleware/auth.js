import jwt from "jsonwebtoken";
import User from "../models/User.js";

function getTokenFromHeader(req) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) return null;

  return header.slice(7);
}

export function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export async function requireAuth(req, res, next) {
  try {
    const token = getTokenFromHeader(req);

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId);

    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export async function optionalAuth(req, _res, next) {
  try {
    const token = getTokenFromHeader(req);

    if (!token) {
      req.user = null;
      return next();
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.userId);
    next();
  } catch {
    req.user = null;
    next();
  }
}
