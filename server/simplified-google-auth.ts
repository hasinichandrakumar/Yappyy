import { Express, Request, Response } from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { google } from 'googleapis';
import crypto from 'crypto';
import { storage } from './storage';

// Define proper session interface
interface AuthenticatedSession extends session.Session {
  oauth_state?: string;
  access_token?: string;
  user_id?: string;
}

interface AuthenticatedRequest extends Request {
  session: AuthenticatedSession;
}

export function setupSimplifiedGoogleAuth(app: Express) {
  // Validate required environment variables
  const requiredEnvVars = {
    GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars);
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Session configuration with proper error handling
  const PgStore = connectPgSimple(session);
  let sessionStore;

  try {
    sessionStore = new PgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true, // Create table if it doesn't exist
      ttl: 7 * 24 * 60 * 60, // 7 days
      tableName: 'sessions',
      pruneSessionInterval: 60, // Clean up expired sessions every minute
    });
    console.log('✅ Session store configured with PostgreSQL');
  } catch (error) {
    console.error('❌ Failed to configure session store:', error);
    // Fallback to memory store for development
    sessionStore = new session.MemoryStore();
    console.log('⚠️ Using memory store as fallback');
  }

  app.use(session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    name: 'yappyy.sid', // Custom session name
  }));

  // Create OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    '' // Will be set dynamically
  );

  // Scopes
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'openid',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];

  // Generate cryptographically secure state
  function generateSecureState(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Get current domain for callback URL
  function getCurrentDomain(req: Request): string {
    // For development, ALWAYS use localhost:5000 to ensure consistency
    // This prevents issues with Replit domains and other development environments
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Using localhost:5000 for development (forced)');
      return 'http://localhost:5000';
    }
    
    // For production, use the actual domain
    const host = req.get('host');
    const protocol = req.get('x-forwarded-proto') || (req.secure ? 'https' : 'http');
    
    console.log('🔧 Host:', host, 'Protocol:', protocol, 'NODE_ENV:', process.env.NODE_ENV);
    
    // In production, avoid Replit domains and use yappyy.com
    if (host && !host.includes('replit.dev')) {
      return `${protocol}://${host}`;
    }
    
    // Fallback for production
    return 'https://yappyy.com';
  }

  // Sign in route
  app.get('/api/auth/google', (req: AuthenticatedRequest, res: Response) => {
    try {
      // Generate secure state
      const state = generateSecureState();
      
      // Store state in session
      req.session.oauth_state = state;
      
      // Dynamic callback URL
      const baseUrl = getCurrentDomain(req);
      const redirectUri = `${baseUrl}/api/auth/google/callback`;
      
      // Set the redirect URI on the OAuth client
      oauth2Client.setCredentials({ redirect_uris: [redirectUri] });
      
      // Generate auth URL
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        state: state,
        prompt: 'consent', // Force consent screen to get refresh token
        redirect_uri: redirectUri,
      });

      console.log('🔄 Redirecting to Google OAuth:', redirectUri);
      res.redirect(authUrl);
    } catch (error) {
      console.error('❌ OAuth initiation error:', error);
      res.redirect('/?error=auth_error');
    }
  });

  // Callback route
  app.get('/api/auth/google/callback', async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { code, state, error } = req.query;
      
      if (error) {
        console.error('❌ OAuth error:', error);
        return res.redirect('/?error=oauth_error');
      }

      if (!code) {
        return res.redirect('/?error=oauth_error');
      }

      // Validate state
      const sessionState = req.session.oauth_state;
      if (!sessionState || state !== sessionState) {
        console.error('❌ Invalid state parameter');
        return res.redirect('/?error=oauth_error');
      }

      // Clear state from session
      delete req.session.oauth_state;

      // Set redirect URI for token exchange
      const callbackBaseUrl = getCurrentDomain(req);
      const redirectUri = `${callbackBaseUrl}/api/auth/google/callback`;
      
      // Set the redirect URI on the OAuth client for token exchange
      oauth2Client.setCredentials({ redirect_uris: [redirectUri] });

      // Exchange code for token with explicit redirect URI
      const { tokens } = await oauth2Client.getToken({
        code: code as string,
        redirect_uri: redirectUri
      });
      
      if (!tokens.access_token) {
        console.error('❌ No access token received');
        return res.redirect('/?error=oauth_error');
      }

      // Store access token in session
      req.session.access_token = tokens.access_token;
      
      // Get user info
      const userInfo = await getUserInfo(tokens.access_token);
      if (!userInfo) {
        console.error('❌ Failed to get user info');
        return res.redirect('/?error=oauth_error');
      }

      // Store user in database
      if (userInfo.sub) {
        try {
          await storage.upsertUser({
            id: userInfo.sub,
            email: userInfo.email,
            firstName: userInfo.given_name || '',
            lastName: userInfo.family_name || '',
            profileImageUrl: userInfo.picture || '',
          });
          req.session.user_id = userInfo.sub;
        } catch (dbError) {
          console.error('❌ Database error:', dbError);
          // Continue anyway, don't fail the auth
        }
      }
      
      console.log('✅ OAuth successful for user:', userInfo.email);
      
      // Redirect to dashboard after successful authentication
      res.redirect('/dashboard');
    } catch (error) {
      console.error('❌ OAuth callback error:', error);
      res.redirect('/?error=oauth_error');
    }
  });

  // Get user info function
  async function getUserInfo(accessToken: string) {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error('❌ User info request failed:', response.status, response.statusText);
        return null;
      }
      
      const userInfo = await response.json();
      
      // Validate required fields
      if (!userInfo.sub || !userInfo.email) {
        console.error('❌ Invalid user info received:', userInfo);
        return null;
      }
      
      return userInfo;
    } catch (error) {
      console.error('❌ Failed to fetch user info:', error);
      return null;
    }
  }

  // User info route
  app.get('/api/auth/user', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.session.access_token) {
        return res.json({ 
          isAuthenticated: false, 
          user: null 
        });
      }

      const userInfo = await getUserInfo(req.session.access_token);
      
      if (!userInfo) {
        // Clear invalid session
        delete req.session.access_token;
        delete req.session.user_id;
        return res.json({ 
          isAuthenticated: false, 
          user: null 
        });
      }

      // Return user data
      res.json({
        isAuthenticated: true,
        user: {
          id: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          firstName: userInfo.given_name,
          lastName: userInfo.family_name,
          profileImageUrl: userInfo.picture,
          authType: 'google'
        }
      });
    } catch (error) {
      console.error('❌ Error fetching user:', error);
      res.json({ 
        isAuthenticated: false, 
        user: null 
      });
    }
  });

  // Logout route with proper cleanup
  app.get('/api/auth/logout', async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Revoke Google access token if available
      if (req.session.access_token) {
        try {
          oauth2Client.setCredentials({ access_token: req.session.access_token });
          await oauth2Client.revokeCredentials();
          console.log('✅ Google access token revoked');
        } catch (revokeError) {
          console.warn('⚠️ Failed to revoke Google token:', revokeError);
        }
      }

      // Clear session
      delete req.session.access_token;
      delete req.session.user_id;
      delete req.session.oauth_state;

      // Destroy session
      req.session.destroy((err) => {
        if (err) {
          console.error('❌ Error destroying session:', err);
        }
        res.redirect('/');
      });
    } catch (error) {
      console.error('❌ Logout error:', error);
      res.redirect('/');
    }
  });

  // Health check route
  app.get('/api/auth/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      googleClientId: process.env.GOOGLE_CLIENT_ID ? 'configured' : 'missing',
      sessionSecret: process.env.SESSION_SECRET ? 'configured' : 'missing',
      databaseUrl: process.env.DATABASE_URL ? 'configured' : 'missing',
      environment: process.env.NODE_ENV || 'development'
    });
  });

  console.log('✅ Simplified Google OAuth configured successfully');
}