import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import type { Express, Request } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import crypto from "crypto";

// Extend Express types for Passport
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
      profileImageUrl?: string;
    }
  }
}

// Type for authenticated requests
type AuthenticatedRequest = Request & {
  isAuthenticated(): boolean;
  user?: Express.User;
}

// Simple OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Validate credentials
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error('❌ Missing Google OAuth credentials');
  throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required');
}

console.log('✅ Google OAuth credentials loaded');
console.log('   Client ID:', GOOGLE_CLIENT_ID.substring(0, 30) + '...');

export function getSession() {
  const sessionSecret = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
  
  let sessionStore;
  
  if (process.env.DATABASE_URL) {
    try {
      const pgStore = connectPg(session);
      sessionStore = new pgStore({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
        tableName: "sessions"
      });
      console.log('✅ Using PostgreSQL session store');
    } catch (error) {
      console.warn('⚠️ Database session store failed, using memory store');
      // Fix: Proper MemoryStore import
      const MemoryStore = session.MemoryStore;
      sessionStore = new MemoryStore();
    }
  } else {
    // Fix: Proper MemoryStore import
    const MemoryStore = session.MemoryStore;
    sessionStore = new MemoryStore();
    console.log('⚠️ Using memory session store (not recommended for production)');
  }
  
  return session({
    secret: sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
    }
  });
}

export function setupGoogleAuth(app: Express) {
  // Session setup
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Serialize user - store minimal data
  passport.serializeUser((user: Express.User, done) => {
    done(null, user.id);
  });

  // Deserialize user - fetch full user data
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        console.warn(`⚠️ User not found during deserialization: ${id}`);
        return done(null, null);
      }
      // Convert storage user to Express.User format
      const expressUser: Express.User = {
        id: user.id,
        email: user.email || '',
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        profileImageUrl: user.profileImageUrl || undefined
      };
      done(null, expressUser);
    } catch (error) {
      console.error('❌ Error during user deserialization:', error);
      done(error, null);
    }
  });

  // Get callback URL for current environment
  const callbackURL = process.env.REPLIT_URL 
    ? `${process.env.REPLIT_URL}/oauth2callback`
    : "https://0c7fe059-a7da-4a46-a7cc-18655fec2a24-00-1znejaw22ebqj.picard.replit.dev/oauth2callback";

  // Google Strategy with state parameter for CSRF protection
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID!,
    clientSecret: GOOGLE_CLIENT_SECRET!,
    callbackURL: callbackURL,
    passReqToCallback: false,
    state: true // Enable CSRF protection
  }, async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      console.log('🔐 Google OAuth: Processing user profile');
      
      if (!profile.id || !profile.emails?.[0]?.value) {
        console.error('❌ Invalid profile data from Google:', profile);
        return done(new Error('Invalid profile data from Google'), null);
      }

      const user = await storage.upsertUser({
        id: profile.id,
        email: profile.emails[0].value,
        firstName: profile.name?.givenName || 'User',
        lastName: profile.name?.familyName || '',
        profileImageUrl: profile.photos?.[0]?.value || ''
      });

      if (!user) {
        console.error('❌ Failed to upsert user');
        return done(new Error('Failed to create/update user'), null);
      }

      console.log('✅ Google OAuth: User authenticated successfully');
      return done(null, user);
    } catch (error) {
      console.error('❌ Google OAuth: Error processing user:', error);
      return done(error, null);
    }
  }));

  // OAuth routes with state parameter
  app.get('/api/auth/google', (req, res, next) => {
    console.log('🔐 Starting Google OAuth flow');
    console.log('   Callback URL:', callbackURL);
    console.log('   Client ID:', GOOGLE_CLIENT_ID!.substring(0, 30) + '...');
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      state: crypto.randomBytes(16).toString('hex') // Generate state for CSRF protection
    })(req, res, next);
  });

  app.get('/oauth2callback', (req, res, next) => {
    console.log('🔄 Google OAuth callback received');
    console.log('   Query params:', req.query);
    passport.authenticate('google', { 
      failureRedirect: '/?error=auth_failed',
      failureMessage: true
    })(req, res, next);
  }, (req, res) => {
    console.log('✅ OAuth callback successful, redirecting to dashboard');
    res.redirect('/dashboard');
  });

  // Auth status endpoint
  app.get('/api/auth/user', (req: AuthenticatedRequest, res) => {
    res.json({
      isAuthenticated: req.isAuthenticated(),
      user: req.user || null
    });
  });

  // Logout endpoint with proper callback handling
  app.get('/api/auth/logout', (req: AuthenticatedRequest, res) => {
    // Check if req.logout is a function (Passport v0.6+)
    if (typeof req.logout === 'function') {
      req.logout((err) => {
        if (err) {
          console.error('❌ Logout error:', err);
          return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ success: true });
      });
    } else {
      // Fallback for older Passport versions
      console.warn('⚠️ Using synchronous logout (older Passport version)');
      (req as any).logout();
      res.json({ success: true });
    }
  });

  // Test endpoint
  app.get('/api/auth/test', (req: AuthenticatedRequest, res) => {
    res.json({
      status: 'OAuth Configuration',
      clientId: GOOGLE_CLIENT_ID!.substring(0, 30) + '...',
      hasSecret: !!GOOGLE_CLIENT_SECRET,
      callbackUrl: callbackURL,
      isAuthenticated: req.isAuthenticated(),
      user: req.user || null
    });
  });

  console.log('✅ Google OAuth setup complete');
}

// Simple authentication middleware with proper typing
export const isAuthenticated = (req: AuthenticatedRequest, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};