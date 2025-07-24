import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// Get the current domain from the request or environment
const getCurrentDomain = (req?: any) => {
  if (req?.get('host')) {
    return req.protocol + '://' + req.get('host');
  }
  if (process.env.REPLIT_DEV_DOMAIN) {
    return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  }
  return 'http://localhost:5000';
};

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
    secret: process.env.SESSION_SECRET || 'dev-secret-key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true, // Enable for HTTPS
      sameSite: 'lax', // Allow cross-site requests for OAuth
      maxAge: sessionTtl,
    },
  });
}

export async function setupGoogleAuth(app: Express) {
  console.log('🔧 Google OAuth Setup - Client ID:', GOOGLE_CLIENT_ID ? 'Present' : 'Missing');
  
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Serialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });

  // Google OAuth Strategy - Custom domain callback
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://yappyy.com/oauth2callback',
      scope: ['profile', 'email']
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        // Create or update user with Google data
        const user = await storage.upsertUser({
          id: profile.id,
          email: profile.emails?.[0]?.value || `${profile.id}@gmail.com`,
          firstName: profile.name?.givenName || profile.displayName?.split(' ')[0] || 'User',
          lastName: profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' ') || '',
          profileImageUrl: profile.photos?.[0]?.value || 'https://via.placeholder.com/150'
        });

        console.log('✅ Google OAuth: User authenticated:', user.email);
        return done(null, user);
      } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, false);
      }
    }));
  } else {
    console.warn('⚠️ Google OAuth credentials not found in environment variables');
  }

  // Google OAuth routes
  app.get('/api/auth/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  // Handle the OAuth callback route - redirect to yappyy.com/dashboard
  app.get('/oauth2callback',
    passport.authenticate('google', { 
      failureRedirect: 'https://yappyy.com/',
      successRedirect: 'https://yappyy.com/dashboard'
    })
  );

  // Also handle the original route for compatibility
  app.get('/api/auth/google/callback',
    passport.authenticate('google', { 
      failureRedirect: 'https://yappyy.com/',
      successRedirect: 'https://yappyy.com/dashboard'
    })
  );

  // Login route (redirects to Google OAuth)
  app.get('/api/login', (req, res) => {
    res.redirect('/api/auth/google');
  });

  // Logout route
  app.get('/api/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
      }
      req.session.destroy(() => {
        res.redirect('https://yappyy.com/');
      });
    });
  });

  // Demo user fallback when Google OAuth is not configured
  app.get('/api/demo-login', async (req: any, res) => {
    try {
      const demoUser = await storage.upsertUser({
        id: 'demo-user',
        email: 'demo@example.com',
        firstName: 'Demo',
        lastName: 'User',
        profileImageUrl: 'https://via.placeholder.com/150'
      });

      req.login(demoUser, (err: any) => {
        if (err) {
          console.error('Demo login error:', err);
          return res.redirect('/');
        }
        console.log('✅ Demo user logged in');
        res.redirect('/dashboard');
      });
    } catch (error) {
      console.error('Demo user creation error:', error);
      res.redirect('/');
    }
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};