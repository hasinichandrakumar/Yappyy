import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

// Google OAuth configuration - using environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// Get the current domain from the request or environment
const DEFAULT_PORT = process.env.PORT || '3000';
const getCurrentDomain = (req?: any) => {
  // Try to get domain from request
  if (req?.get('host')) {
    const protocol = req.get('x-forwarded-proto') || req.protocol || 'https';
    return `${protocol}://${req.get('host')}`;
  }
  
  // Check for Replit deployment domain
  if (process.env.REPLIT_DOMAINS) {
    const domains = process.env.REPLIT_DOMAINS.split(',');
    return `https://${domains[0]}`;
  }
  
  // Fallback for development
  if (process.env.REPLIT_DEV_DOMAIN) {
    return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  }
  
  return `http://localhost:${DEFAULT_PORT}`;
};

// Get appropriate callback URL based on environment
const getCallbackURL = (req?: any) => {
  // For development on Replit, use the current domain
  if (req?.get('host') && req.get('host')?.includes('replit.dev')) {
    const protocol = req.get('x-forwarded-proto') || req.protocol || 'https';
    return `${protocol}://${req.get('host')}/auth/google/callback`;
  }
  
  // For production or when no request context, use yappyy.com
  return 'https://yappyy.com/auth/google/callback';
};

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const hasDatabase = Boolean(process.env.DATABASE_URL);
  const sessionStore = hasDatabase
    ? new pgStore({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
        ttl: sessionTtl,
        tableName: "sessions",
        pruneSessionInterval: 60 * 60, // Prune expired sessions every hour
        errorLog: (error: any) => {
          console.error('Session store error:', error);
        }
      })
    // Fallback to in-memory store if DATABASE_URL is not configured
    : new session.MemoryStore();
  
  // Test the session store connection
  sessionStore.on('error', (error: any) => {
    console.error('Session store connection error:', error);
  });
  
  const isProd = process.env.NODE_ENV === 'production';
  return session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key-change-in-production',
    store: sessionStore,
    resave: true, // Save session on every request to ensure persistence
    saveUninitialized: true, // Create session immediately
    rolling: true, // Reset expiry on activity
    cookie: {
      httpOnly: true,
      secure: isProd, // secure cookies in production (trust proxy is enabled)
      sameSite: 'lax', // OAuth-friendly while protecting CSRF
      maxAge: sessionTtl,
      domain: undefined, // Remove domain restriction for better compatibility
      path: '/' // Ensure cookie is available for all paths
    },
    name: 'yappyy.sid', // Custom session name to avoid conflicts
    proxy: true // Trust proxy for secure cookies in production
  });
}

export async function setupGoogleAuth(app: Express) {
  console.log('🔧 Google OAuth Setup - Client ID:', GOOGLE_CLIENT_ID ? `${GOOGLE_CLIENT_ID.substring(0, 30)}...` : 'Missing');
  
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Serialize user for session - store only the user ID
  passport.serializeUser((user: any, done) => {
    console.log('🔐 Serializing user for session:', user.id, user.email);
    // Store the entire user object in session for simplicity
    done(null, user);
  });

  // Deserialize user from session
  passport.deserializeUser(async (sessionUser: any, done) => {
    try {
      console.log('🔓 Deserializing user from session:', sessionUser?.id);
      
      // If we have a user object stored, use it directly
      if (sessionUser && sessionUser.id) {
        // Optionally fetch fresh user data from database
        const freshUser = await storage.getUser(sessionUser.id);
        if (freshUser) {
          console.log('✅ User deserialized successfully:', freshUser.email);
          done(null, freshUser);
        } else {
          // User was deleted from DB, use session data
          console.log('⚠️ Using session user data (not in DB):', sessionUser.email);
          done(null, sessionUser);
        }
      } else {
        console.log('❌ No user data in session');
        done(null, false);
      }
    } catch (error) {
      console.error('❌ Error deserializing user:', error);
      done(error, false);
    }
  });

  // Google OAuth Strategy - use a generic callback that will be overridden per request
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    // Use a default callback URL that will be dynamically overridden
    const defaultCallbackURL = '/oauth2callback';
      
    console.log('🔧 Google OAuth Strategy Configuration:');
    console.log('  - Client ID:', GOOGLE_CLIENT_ID?.substring(0, 20) + '...');
    console.log('  - Default Callback URL:', defaultCallbackURL);
    console.log('  - Scopes: profile, email');
    
    passport.use(new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback', // Use relative path - will be determined per request
      scope: ['profile', 'email'],
      passReqToCallback: false // Don't pass req to match the function signature
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('📊 Google OAuth Profile received:', {
          id: profile.id,
          displayName: profile.displayName,
          email: profile.emails?.[0]?.value,
          provider: profile.provider
        });
        
        // Create or update user with Google data
        const user = await storage.upsertUser({
          id: profile.id,
          email: profile.emails?.[0]?.value || `${profile.id}@gmail.com`,
          firstName: profile.name?.givenName || profile.displayName?.split(' ')[0] || 'User',
          lastName: profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' ') || '',
          profileImageUrl: profile.photos?.[0]?.value || 'https://via.placeholder.com/150'
        });

        console.log('✅ Google OAuth: User authenticated:', user.email);
        console.log('✅ User data stored in database');
        return done(null, user);
      } catch (error) {
        console.error('❌ Google OAuth error:', error);
        return done(error, false);
      }
    }));
  } else {
    console.warn('⚠️ Google OAuth credentials not found in environment variables');
  }

  // Google OAuth routes - with dynamic callback URL (consistent for both steps)
  app.get('/api/auth/google', (req, res, next) => {
    console.log('🚀 Starting Google OAuth flow...');
    console.log('  - Request host:', req.get('host'));
    console.log('  - Full URL:', `${req.protocol}://${req.get('host')}${req.originalUrl}`);
    const requestCallbackURL = getCallbackURL(req);
    console.log('  - Dynamic callback URL:', requestCallbackURL);
    console.log('🔧 IMPORTANT: Make sure this callback URL is added to your Google Cloud Console OAuth credentials!');

    // Override callbackURL per request to ensure exact domain/protocol is used in redirect_uri
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      callbackURL: requestCallbackURL
    })(req, res, next);
  });

  // Handle the OAuth callback route - redirect to dashboard
  app.get('/auth/google/callback', (req, res, next) => {
    console.log('🔄 OAuth callback received');
    console.log('  - Request URL:', req.url);
    console.log('  - Request host:', req.get('host'));
    console.log('  - Request protocol:', req.protocol);
    console.log('  - Query params:', JSON.stringify(req.query));
    console.log('  - Has authorization code:', !!req.query.code);
    console.log('  - Has error:', !!req.query.error);
    console.log('  - Session ID:', req.sessionID);
    
    // Handle OAuth errors from Google
    if (req.query.error) {
      console.error('❌ OAuth error from Google:', req.query.error);
      console.error('❌ OAuth error description:', req.query.error_description);
      
      // Special handling for redirect_uri_mismatch
      if (req.query.error === 'redirect_uri_mismatch') {
        console.error('❌ Redirect URI mismatch - callback URL not authorized in Google Cloud Console');
        const currentCallbackURL = getCallbackURL(req);
        console.error('❌ Current callback URL:', currentCallbackURL);
        console.error('❌ Request host:', req.get('host'));
        console.error('❌ Please add this URL to your Google Cloud Console OAuth credentials');
        return res.redirect(`/?error=redirect_mismatch&callback_url=${encodeURIComponent(currentCallbackURL)}`);
      }
      
      return res.redirect(`/?error=oauth_failed&details=${encodeURIComponent(String(req.query.error_description || req.query.error))}`);
    }
    
    // Check if we have the required code parameter
    if (!req.query.code) {
      console.error('❌ No authorization code received from Google');
      return res.redirect('/?error=no_code');
    }
    
    console.log('✅ Authorization code received, processing...');
    
    // Process OAuth callback using standard passport authenticate with failureRedirect
    passport.authenticate('google', {
      failureRedirect: '/?error=auth_failed',
      failureMessage: true
    }, (err: any, user: any, info: any) => {
      console.log('🔍 Passport authenticate callback:', { 
        hasError: !!err, 
        hasUser: !!user, 
        info: info,
        errorMessage: err?.message
      });
      
      if (err) {
        console.error('❌ OAuth authentication error:', err);
        console.error('❌ Error stack:', err.stack);
        return res.redirect('/?error=auth_failed&details=' + encodeURIComponent(err.message || 'Authentication failed'));
      }
      
      if (!user) {
        console.error('❌ OAuth authentication failed - no user returned');
        console.error('❌ Info:', info);
        return res.redirect('/?error=no_user&info=' + encodeURIComponent(JSON.stringify(info || {})));
      }
      
      console.log('✅ User authenticated:', user.email);
      console.log('✅ User data:', { id: user.id, firstName: user.firstName, lastName: user.lastName });
      
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error('❌ Login session error:', loginErr);
          console.error('❌ Login error stack:', loginErr.stack);
          return res.redirect('/?error=login_failed&details=' + encodeURIComponent(loginErr.message || 'Session creation failed'));
        }
        
        console.log('✅ Session established for user:', user.email);
        console.log('✅ Session ID after login:', req.sessionID);
        console.log('✅ User is authenticated:', req.isAuthenticated());
        console.log('✅ Redirecting to dashboard...');
        
        // Save session before redirect
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error('⚠️ Session save warning:', saveErr);
          }
          // Redirect to dashboard - use relative path to stay on the same domain
          res.redirect('/dashboard');
        });
      });
    })(req, res, next);
  });

  // Also handle the API route for compatibility (same handler as above)
  app.get('/api/auth/google/callback', (req, res, next) => {
    console.log('🔄 OAuth callback received at /api/auth/google/callback');
    console.log('  - Redirecting to primary callback handler...');
    // Redirect to the main callback handler
    req.url = req.url.replace('/api/auth/google/callback', '/auth/google/callback');
    app._router.handle(req, res, next);
  });

  // Backward-compat route: support older Google Console configs pointing to /oauth2callback
  app.get('/oauth2callback', (req, res, next) => {
    console.log('🔄 OAuth callback received at /oauth2callback');
    console.log('  - Redirecting to primary callback handler...');
    req.url = req.url.replace('/oauth2callback', '/auth/google/callback');
    app._router.handle(req, res, next);
  });

  // Login route (redirects to Google OAuth)
  app.get('/api/login', (req, res) => {
    res.redirect('/api/auth/google');
  });

  // OAuth test/debug endpoint
  app.get('/api/auth/test', (req, res) => {
    const host = req.get('host');
    const protocol = req.get('x-forwarded-proto') || req.protocol || 'https';
    const fullUrl = `${protocol}://${host}`;
    
    res.json({
      status: 'OAuth Configuration',
      clientId: GOOGLE_CLIENT_ID ? `${GOOGLE_CLIENT_ID.substring(0, 30)}...` : 'Missing',
      hasSecret: !!GOOGLE_CLIENT_SECRET,
      currentHost: host,
      protocol: protocol,
      expectedCallbackUrl: `${fullUrl}/auth/google/callback`,
      alternateCallbackUrl: `${fullUrl}/api/auth/google/callback`,
      sessionStatus: {
        hasSession: !!req.session,
        sessionId: req.sessionID,
        isAuthenticated: req.isAuthenticated()
      }
    });
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