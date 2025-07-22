import type { RequestHandler } from "express";
import { isAuthenticated as replitIsAuthenticated } from "./replitAuth";

// Unified authentication middleware that works with both Replit Auth and Google OAuth
export const unifiedAuth: RequestHandler = async (req, res, next) => {
  // Check if user is authenticated via session (Google OAuth)
  if (req.isAuthenticated && req.isAuthenticated() && req.user) {
    return next();
  }

  // Fallback to Replit Auth
  return replitIsAuthenticated(req, res, next);
};

// Helper to get user ID from either auth system
export function getUserId(req: any): string | null {
  if (req.user?.claims?.sub) {
    // Replit Auth user
    return req.user.claims.sub;
  }
  
  if (req.user?.id) {
    // Google OAuth user
    return req.user.id;
  }
  
  return null;
}