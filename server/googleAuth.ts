import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import type { Express } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import crypto from "crypto";

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
    } catch (error) {
      console.warn('⚠️ Database session store failed, using memory store');
      sessionStore = new session.MemoryStore();
    }
  } else {
    sessionStore = new session.MemoryStore();
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

  // Serialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Get callback URL for current environment
  const callbackURL = process.env.REPLIT_URL 
    ? `${process.env.REPLIT_URL}/oauth2callback`
    : "https://0c7fe059-a7da-4a46-a7cc-18655fec2a24-00-1znejaw22ebqj.picard.replit.dev/oauth2callback";

  // Simple Google Strategy
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID!,
    clientSecret: GOOGLE_CLIENT_SECRET!,
    callbackURL: callbackURL,
    passReqToCallback: false
  }, async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      console.log('🔐 Google OAuth: Processing user profile');
      
      if (!profile.id || !profile.emails?.[0]?.value) {
        return done(new Error('Invalid profile data from Google'), null);
      }

      const user = await storage.upsertUser({
        id: profile.id,
        email: profile.emails[0].value,
        firstName: profile.name?.givenName || 'User',
        lastName: profile.name?.familyName || '',
        profileImageUrl: profile.photos?.[0]?.value || ''
      });

      console.log('✅ Google OAuth: User authenticated successfully');
      return done(null, user);
    } catch (error) {
      console.error('❌ Google OAuth: Error processing user:', error);
      return done(error, null);
    }
  }));

  // OAuth routes
  app.get('/api/auth/google', (req, res, next) => {
    console.log('🔐 Starting Google OAuth flow');
    console.log('   Callback URL:', callbackURL);
    console.log('   Client ID:', GOOGLE_CLIENT_ID!.substring(0, 30) + '...');
    passport.authenticate('google', {
      scope: ['profile', 'email']
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
  app.get('/api/auth/user', (req, res) => {
    res.json({
      isAuthenticated: req.isAuthenticated(),
      user: req.user || null
    });
  });

  // Logout endpoint
  app.get('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error('❌ Logout error:', err);
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.json({ success: true });
    });
  });

    // Test endpoint
  app.get('/api/auth/test', (req, res) => {
    res.json({
      status: 'OAuth Configuration',
      clientId: GOOGLE_CLIENT_ID!.substring(0, 30) + '...',
      hasSecret: !!GOOGLE_CLIENT_SECRET,
      callbackUrl: callbackURL,
      isAuthenticated: req.isAuthenticated()
    });
  });

  console.log('✅ Google OAuth setup complete');
}

// Simple authentication middleware
export const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};