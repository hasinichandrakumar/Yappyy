import type { RequestHandler } from "express";

// Google OAuth authentication middleware
export const unifiedAuth: RequestHandler = async (req, res, next) => {
  // Check if user is authenticated via session (Google OAuth)
  if (req.isAuthenticated && req.isAuthenticated() && req.user) {
    return next();
  }

  // Return 401 if not authenticated
  return res.status(401).json({ message: "Unauthorized" });
};

// Helper to get user ID from Google OAuth
export function getUserId(req: any): string | null {
  if (req.user?.id) {
    // Google OAuth user
    return req.user.id;
  }
  
  return null;
}