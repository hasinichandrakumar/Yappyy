import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import connectPg from "connect-pg-simple";
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";

const hasGoogleCredentials = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

if (!hasGoogleCredentials) {
  console.warn("Google OAuth credentials not provided. Authentication will be disabled.");
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: false, // Allow client-side access for debugging
      secure: true, // Use secure cookies for production HTTPS deployment
      maxAge: sessionTtl,
      sameSite: 'lax'
    },
  });
}

export async function setupGoogleAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Setup passport serialization for all authentication methods
  passport.serializeUser((user: any, done) => {
    console.log("Serializing user:", user.id);
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      console.log("Deserializing user ID:", id);
      const user = await storage.getUser(id);
      console.log("Found user:", user ? "yes" : "no");
      done(null, user);
    } catch (error) {
      console.error("Deserialize error:", error);
      done(error, null);
    }
  });

  // Only setup Google OAuth if credentials are available
  if (hasGoogleCredentials) {
    // Google OAuth Strategy
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          callbackURL: `https://${process.env.REPLIT_DEV_DOMAIN}/api/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            console.log("Google OAuth callback - Profile ID:", profile.id);
            
            // Check if this is a new user
            const existingUser = await storage.getUser(profile.id);
            const isNewUser = !existingUser;
            
            const userData = {
              id: profile.id,
              email: profile.emails?.[0]?.value || "",
              firstName: profile.name?.givenName || "",
              lastName: profile.name?.familyName || "",
              profileImageUrl: profile.photos?.[0]?.value || "",
              // Only set onboarding to false for new users
              ...(isNewUser ? { hasCompletedOnboarding: false } : {})
            };

            const user = await storage.upsertUser(userData);
            console.log("User upserted successfully:", user.id, "New user:", isNewUser);
            return done(null, user);
          } catch (error) {
            console.error("OAuth callback error:", error);
            return done(error, undefined);
          }
        }
      )
    );



    // Debug endpoint to check OAuth configuration
    app.get("/api/auth/debug", (req, res) => {
      res.json({
        hasClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasSessionSecret: !!process.env.SESSION_SECRET,
        domain: process.env.REPLIT_DEV_DOMAIN,
        callbackUrl: `https://${process.env.REPLIT_DEV_DOMAIN}/api/auth/google/callback`,
        nodeEnv: process.env.NODE_ENV
      });
    });

    // Helper endpoint for Google Cloud Console setup
    app.get("/api/auth/google-setup", (req, res) => {
      const domain = process.env.REPLIT_DEV_DOMAIN;
      res.json({
        message: "🚨 GOOGLE OAUTH SETUP REQUIRED - redirect_uri_mismatch Error",
        error: "Error 400: redirect_uri_mismatch",
        solution: "Add these exact URLs to your Google Cloud Console OAuth settings",
        instructions: {
          step1: "Go to https://console.cloud.google.com/",
          step2: "Navigate to APIs & Services → Credentials",
          step3: "Find and edit your OAuth 2.0 Client ID",
          step4: "In 'Authorized redirect URIs' section, click ADD URI",
          step5: "Add the exact URL below (copy-paste to avoid typos)",
          step6: "Save the changes and wait 5-10 minutes for Google to propagate"
        },
        CRITICAL_REDIRECT_URI_TO_ADD: `https://${domain}/api/auth/google/callback`,
        authorizedJavaScriptOrigins: [
          `https://${domain}`
        ],
        currentDomain: domain,
        troubleshooting: {
          commonIssues: [
            "Typos in the redirect URI",
            "Missing https:// prefix", 
            "Extra trailing slashes",
            "Not waiting for Google's propagation (5-10 minutes)"
          ],
          verification: "After adding, test the Google sign-in again"
        }
      });
    });

    // Google OAuth routes
    app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

    app.get(
      "/api/auth/google/callback",
      (req, res, next) => {
        console.log("OAuth callback received", req.query);
        passport.authenticate("google", (err, user, info) => {
          if (err) {
            console.error("OAuth authentication error:", err);
            console.error("Error details:", JSON.stringify(err, null, 2));
            return res.redirect("/?error=auth_error&details=" + encodeURIComponent(err.message || "Unknown error"));
          }
          if (!user) {
            console.error("OAuth authentication failed:", info);
            console.error("Info details:", JSON.stringify(info, null, 2));
            return res.redirect("/?error=auth_failed&details=" + encodeURIComponent(info?.message || "Authentication failed"));
          }
          req.logIn(user, (err) => {
            if (err) {
              console.error("Login error:", err);
              console.error("Login error details:", JSON.stringify(err, null, 2));
              return res.redirect("/?error=login_error&details=" + encodeURIComponent(err.message || "Login failed"));
            }
            console.log("User successfully authenticated:", user.id);
            return res.redirect("/dashboard");
          });
        })(req, res, next);
      }
    );

    // Logout route
    app.get("/api/auth/logout", (req, res) => {
      req.logout(() => {
        req.session.destroy(() => {
          res.redirect("/");
        });
      });
    });
  } else {
    // Fallback routes when Google OAuth is not configured
    app.get("/api/auth/google", (req, res) => {
      res.status(503).json({ message: "Google OAuth not configured" });
    });

    app.get("/api/auth/google/callback", (req, res) => {
      res.redirect("/?error=oauth_not_configured");
    });
  }

  // Auth check endpoint - returns current user or null with resilient error handling
  app.get("/api/auth/user", async (req: any, res) => {
    try {
      console.log("Auth check - req.user:", req.user ? "exists" : "null");
      console.log("Auth check - isAuthenticated():", req.isAuthenticated ? req.isAuthenticated() : "no function");
      
      if (req.isAuthenticated && req.isAuthenticated() && req.user) {
        console.log("Returning authenticated user:", req.user.id);
        return res.json(req.user);
      }
      
      console.log("No authenticated user found, returning null");
      res.json(null);
    } catch (error: any) {
      console.error("Auth check error:", error.message);
      // Handle database connection errors gracefully to prevent runtime crashes
      if (error.code === '57P01' || error.message.includes('terminating connection')) {
        console.log("Database connection error during auth check - returning null");
        return res.json(null);
      }
      res.json(null);
    }
  });

  // Demo authentication for development/testing
  app.get("/api/auth/demo", async (req, res) => {
    try {
      // Create or get demo user
      const demoUser = {
        id: "demo-user-123",
        email: "demo@yapup.com",
        firstName: "Demo",
        lastName: "User",
        profileImageUrl: "",
        hasCompletedOnboarding: false
      };

      const user = await storage.upsertUser(demoUser);
      
      // Log in the demo user
      req.logIn(user, (err) => {
        if (err) {
          console.error("Demo login error:", err);
          return res.redirect("/?error=demo_login_failed");
        }
        console.log("Demo user logged in successfully");
        return res.redirect("/dashboard");
      });
    } catch (error) {
      console.error("Demo auth error:", error);
      res.redirect("/?error=demo_auth_error");
    }
  });

  app.get("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });
}

export const requireAuth: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Authentication required" });
};