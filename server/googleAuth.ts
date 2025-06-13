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
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to false for Replit development environment
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
          callbackURL: process.env.NODE_ENV === 'production' 
            ? `https://${process.env.REPLIT_DEV_DOMAIN}/api/auth/google/callback`
            : `https://${process.env.REPLIT_DEV_DOMAIN}/api/auth/google/callback`,
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