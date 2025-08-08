import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID === '865530799156-v77qutagl1q2q7i7gi1ul5bvabrfa0il.apps.googleusercontent.com' 
  ? '372720245891-dtpkbj63rl2hju5vo2uorldivgurg6fh.apps.googleusercontent.com' 
  : process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET === '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'
  ? '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'
  : process.env.GOOGLE_CLIENT_SECRET;
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
    resave: true, // Changed to true for better session persistence
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Changed to false for development/HTTP
      sameSite: 'lax', // Allow cross-site requests for OAuth
      maxAge: sessionTtl,
      domain: undefined, // Remove domain restriction for better compatibility
    },
  });
}

export async function setupGoogleAuth(app: Express) {
  console.log('🔧 Google OAuth Setup - Client ID:', GOOGLE_CLIENT_ID ? `${GOOGLE_CLIENT_ID.substring(0, 30)}...` : 'Missing');
  
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

  // Google OAuth Strategy - dynamic callback URL
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    // Use dynamic callback URL - always use production domain for yappyy.com
    const callbackURL = "https://yappyy.com/oauth2callback";
      
    console.log('🔧 Google OAuth Strategy Configuration:');
    console.log('  - Client ID:', GOOGLE_CLIENT_ID?.substring(0, 20) + '...');
    console.log('  - Callback URL:', callbackURL);
    console.log('  - Scopes: profile, email');
    
    passport.use(new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: callbackURL,
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
  app.get('/api/auth/google', (req, res, next) => {
    console.log('🚀 Starting Google OAuth flow...');
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  });

  // Handle the OAuth callback route - redirect to dashboard
  app.get('/oauth2callback', (req, res, next) => {
    console.log('🔄 OAuth callback received');
    console.log('  - Query params:', req.query);
    console.log('  - Has authorization code:', !!req.query.code);
    console.log('  - Has error:', !!req.query.error);
    
    // Handle OAuth errors from Google
    if (req.query.error) {
      console.error('❌ OAuth error from Google:', req.query.error);
      console.error('❌ OAuth error description:', req.query.error_description);
      
      // Special handling for redirect_uri_mismatch
      if (req.query.error === 'redirect_uri_mismatch') {
        console.error('❌ Redirect URI mismatch - callback URL not authorized in Google Cloud Console');
        const currentCallbackURL = 'https://yappyy.com/oauth2callback';
        console.error('❌ Current callback URL:', currentCallbackURL);
        return res.redirect(`/?error=redirect_mismatch&callback_url=${encodeURIComponent(currentCallbackURL)}`);
      }
      
      return res.redirect(`/?error=oauth_failed&details=${encodeURIComponent(String(req.query.error_description || req.query.error))}`);
    }
    
    // Process OAuth callback
    passport.authenticate('google', (err: any, user: any, info: any) => {
      if (err) {
        console.error('❌ OAuth authentication error:', err);
        return res.redirect('/?error=auth_failed');
      }
      
      if (!user) {
        console.error('❌ OAuth authentication failed - no user:', info);
        return res.redirect('/?error=no_user');
      }
      
      req.logIn(user, (err) => {
        if (err) {
          console.error('❌ Login error:', err);
          return res.redirect('/?error=login_failed');
        }
        
        console.log('✅ OAuth callback successful for user:', user.email);
        console.log('✅ Redirecting to dashboard...');
        
        // Redirect to dashboard - session is already established
        res.redirect('/dashboard');
      });
    })(req, res, next);
  });

  // Also handle the original route for compatibility
  app.get('/api/auth/google/callback',
    passport.authenticate('google', { 
      failureRedirect: '/',
      successRedirect: '/dashboard'
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
        res.redirect('/');
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