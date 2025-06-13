import type { Express, RequestHandler } from "express";
import { storage } from "./storage";

// Simple demo authentication middleware
export const demoAuth: RequestHandler = async (req: any, res, next) => {
  // Check if user is already authenticated
  if (req.user) {
    return next();
  }

  // For demo purposes, automatically authenticate as demo user
  try {
    const demoUser = await storage.getUser("demo-user-123");
    if (demoUser) {
      req.user = demoUser;
      return next();
    }
  } catch (error) {
    console.error("Demo auth error:", error);
  }
  
  res.status(401).json({ message: "Authentication required" });
};

export function setupDemoAuth(app: Express) {
  // Demo login route
  app.get("/api/auth/demo", async (req: any, res) => {
    try {
      const demoUser = {
        id: "demo-user-123",
        email: "demo@yapup.com",
        firstName: "Demo",
        lastName: "User",
        profileImageUrl: "",
        hasCompletedOnboarding: false
      };

      const user = await storage.upsertUser(demoUser);
      
      // Set user in session-like object
      req.session = req.session || {};
      req.session.userId = user.id;
      req.user = user;
      
      console.log("Demo user created and authenticated");
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Demo auth setup error:", error);
      res.redirect("/?error=demo_auth_error");
    }
  });

  // Simple auth check route
  app.get("/api/auth/user", async (req: any, res) => {
    try {
      // Check session
      if (req.session?.userId) {
        const user = await storage.getUser(req.session.userId);
        if (user) {
          req.user = user;
          return res.json(user);
        }
      }
      
      // Fallback to demo user for demo environment
      const demoUser = await storage.getUser("demo-user-123");
      if (demoUser) {
        req.user = demoUser;
        return res.json(demoUser);
      }
      
      res.status(401).json({ message: "Authentication required" });
    } catch (error) {
      console.error("Auth check error:", error);
      res.status(401).json({ message: "Authentication required" });
    }
  });

  // Logout route
  app.get("/api/auth/logout", (req: any, res) => {
    if (req.session) {
      req.session.destroy();
    }
    req.user = null;
    res.redirect("/");
  });
}