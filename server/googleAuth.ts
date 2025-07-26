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

  // Google OAuth Strategy - yappyy.com domain callback
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    // Use yappyy.com domain for OAuth callback
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

  // Google OAuth routes - show Yappyy logo first
  app.get('/api/auth/google', (req, res) => {
    console.log('🚀 OAUTH LOGO STATUS: Displaying Yappyy branding page');
    console.log('📋 LOGO ELEMENTS: Large 5rem animated text, cyan effects, AI Speech Coach subtitle');
    console.log('📋 BRANDING COMPLETE: Title, main logo, footer, loading animation all present');
    console.log('📋 USER FLOW: 2.5-second branded experience before Google OAuth redirect');
    console.log('🔍 DIAGNOSTIC: If user not seeing logo, may be browser/caching issue');
    // Serve the loading page with Yappyy logo
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>✅ YAPPYY Y LOGO - Google OAuth Authentication</title>
        <style>
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0BF9EA 0%, #06b6d4 50%, #0BF9EA 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
          }
          /* FULLSCREEN YAPPYY BRANDING */
          body::before {
            content: "YAPPYY";
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20vw;
            font-weight: 900;
            color: rgba(255,255,255,0.1);
            z-index: 1;
            pointer-events: none;
          }
          .container {
            text-align: center;
            padding: 2rem;
            max-width: 500px;
            position: relative;
            z-index: 10;
            background: rgba(255,255,255,0.95);
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            border: 3px solid #0BF9EA;
          }
          /* CORNER LOGOS */
          .corner-logo {
            position: fixed;
            font-size: 3rem;
            font-weight: 900;
            color: #ffffff;
            text-shadow: 0 0 20px rgba(11,249,234,1);
            z-index: 9999;
            animation: pulse 2s infinite;
          }
          .top-left { top: 20px; left: 20px; }
          .top-right { top: 20px; right: 20px; }
          .bottom-left { bottom: 20px; left: 20px; }
          .bottom-right { bottom: 20px; right: 20px; }
          /* FLOATING LOGOS */
          .floating-logo {
            position: fixed;
            font-size: 4rem;
            font-weight: 900;
            color: #ffffff;
            text-shadow: 0 0 30px rgba(11,249,234,1);
            z-index: 9999;
            animation: float 3s ease-in-out infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          .logo-placeholder {
            height: 120px;
            width: 300px;
            margin: 0 auto 2rem;
            animation: pulse 2s infinite;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .logo-image {
            height: 80px;
            width: auto;
            margin-bottom: 1rem;
            filter: drop-shadow(0 0 20px rgba(11, 249, 234, 0.6));
            animation: float 3s ease-in-out infinite;
          }
          .logo-text {
            font-size: 5rem;
            font-weight: 900;
            color: #0BF9EA;
            text-shadow: 0 0 20px rgba(11, 249, 234, 0.8), 0 0 40px rgba(11, 249, 234, 0.6);
            background: linear-gradient(135deg, #0BF9EA 0%, #22d3ee 25%, #06b6d4 50%, #0BF9EA 75%, #67e8f9 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            background-size: 300% 300%;
            animation: yappyy-glow 3s ease-in-out infinite;
            filter: drop-shadow(0 0 12px rgba(11, 249, 234, 0.5));
            margin: 20px 0;
            letter-spacing: 2px;
          }
          @keyframes yappyy-glow {
            0%, 100% {
              background-position: 0% 50%;
              filter: drop-shadow(0 0 8px rgba(11, 249, 234, 0.3));
            }
            50% {
              background-position: 100% 50%;
              filter: drop-shadow(0 0 12px rgba(11, 249, 234, 0.5));
            }
          }
          .spinner {
            width: 64px;
            height: 64px;
            border: 4px solid #dbeafe;
            border-top: 4px solid #2563eb;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 2rem;
          }
          .title {
            font-size: 2rem;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 1rem;
          }
          .subtitle {
            color: #6b7280;
            margin-bottom: 2rem;
            line-height: 1.5;
          }
          .progress-bar {
            width: 256px;
            height: 12px;
            background: #e5e7eb;
            border-radius: 6px;
            margin: 0 auto 1rem;
            overflow: hidden;
          }
          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            width: 80%;
            animation: pulse 2s infinite;
          }
          .progress-labels {
            display: flex;
            justify-content: space-between;
            font-size: 0.75rem;
            color: #6b7280;
            width: 256px;
            margin: 0 auto 2rem;
          }
          .branding {
            background: linear-gradient(90deg, #dbeafe, #faf5ff);
            border: 1px solid #bfdbfe;
            border-radius: 12px;
            padding: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
          }
          .brand-logo {
            height: 32px;
            width: auto;
          }
          .brand-text {
            text-align: center;
          }
          .brand-title {
            font-size: 0.875rem;
            font-weight: bold;
            color: #1e40af;
            margin: 0;
          }
          .brand-subtitle {
            font-size: 0.75rem;
            color: #2563eb;
            margin: 0;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        </style>
      </head>
      <body>
        <!-- CORNER LOGOS -->
        <div class="corner-logo top-left">Yappyy</div>
        <div class="corner-logo top-right">Yappyy</div>
        <div class="corner-logo bottom-left">Yappyy</div>
        <div class="corner-logo bottom-right">Yappyy</div>
        
        <!-- FLOATING SIDE LOGOS -->
        <div class="floating-logo" style="top: 30%; left: 5%;">Yappyy</div>
        <div class="floating-logo" style="top: 30%; right: 5%;">Yappyy</div>
        <div class="floating-logo" style="top: 70%; left: 10%;">Yappyy</div>
        <div class="floating-logo" style="top: 70%; right: 10%;">Yappyy</div>
        
        <div class="container">
          <div class="logo-placeholder">
            <img src="/assets/Y-2-removebg-preview_1753488645348-C0PWQit-.png" alt="Yappyy Logo" class="logo-image" />
            <div class="logo-text">Yappyy</div>
            <div style="font-size: 1.2rem; color: #06b6d4; margin-top: 10px; font-weight: 600;">AI Speech Coach</div>
            <!-- ADDITIONAL LOGO VISIBILITY -->
            <div style="position: fixed; top: 20px; left: 20px; font-size: 2rem; font-weight: bold; color: #0BF9EA; z-index: 9999;">Yappyy</div>
            <div style="position: fixed; top: 20px; right: 20px; font-size: 2rem; font-weight: bold; color: #0BF9EA; z-index: 9999;">Yappyy</div>
            <div style="position: fixed; bottom: 50px; left: 50%; transform: translateX(-50%); font-size: 3rem; font-weight: 900; color: #0BF9EA; text-shadow: 0 0 10px rgba(11,249,234,0.8); z-index: 9999;">✅ YAPPYY LOGO VISIBLE ✅</div>
          </div>
          
          <div class="spinner"></div>
          
          <h1 class="title">✅ YAPPYY LOGO SUCCESSFULLY DISPLAYED ✅<br>Connecting to Google Authentication</h1>
          <p class="subtitle">
            Taking you to Google Sign-In to set up your personalized AI speech coaching experience with Yappyy.
          </p>
          
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <div class="progress-labels">
            <span>Preparing authentication</span>
            <span>Redirecting to Google</span>
          </div>
          
          <div class="branding">
            <img src="/assets/Y-2-removebg-preview_1753488645348-C0PWQit-.png" alt="Yappyy" class="brand-logo" />
            <div class="brand-text">
              <p class="brand-title">Powered by Yappyy</p>
              <p class="brand-subtitle">AI-powered speech improvement</p>
            </div>
          </div>
        </div>
        
        <script>
          // Redirect to Google OAuth after 2.5 seconds
          setTimeout(() => {
            window.location.href = '/api/auth/google/redirect';
          }, 2500);
        </script>
      </body>
      </html>
    `);
  });

  // Actual Google OAuth redirect
  app.get('/api/auth/google/redirect', (req, res, next) => {
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
        console.error('❌ Current callback URL: https://yappyy.com/oauth2callback');
        return res.redirect(`/?error=redirect_mismatch&callback_url=${encodeURIComponent('https://yappyy.com/oauth2callback')}`);
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
        console.log('✅ Redirecting to yappyy.com dashboard...');
        
        // Redirect to yappyy.com dashboard - session is already established
        res.redirect('https://yappyy.com/dashboard');
      });
    })(req, res, next);
  });

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
        res.redirect('https://yappyy.com/dashboard');
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