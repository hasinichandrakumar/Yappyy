import { Express, Request, Response } from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { google } from 'googleapis';
import { storage } from './storage';

export function setupSimplifiedGoogleAuth(app: Express) {
  // Session configuration (similar to Flask's session)
  const PgStore = connectPgSimple(session);
  const sessionStore = new PgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: 7 * 24 * 60 * 60, // 7 days
    tableName: 'sessions',
  });

  app.use(session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  }));

  // Create OAuth2 client (similar to Flask's oauth_flow)
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    '' // Will be set dynamically
  );

  // Scopes (same as Flask)
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'openid',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];

  // Sign in route (equivalent to Flask's /signin)
  app.get('/api/auth/google', (req: Request, res: Response) => {
    try {
      // Dynamic callback URL (like Flask's url_for with https replacement)
      const baseUrl = req.get('host') ? `https://${req.get('host')}` : 'http://localhost:5000';
      const redirectUri = `${baseUrl}/api/auth/google/callback`;
      
      oauth2Client.redirectUri = redirectUri;
      
      // Generate auth URL with state (like Flask)
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        state: Math.random().toString(36).substring(2, 15), // Generate random state
      });

      // Store state in session (like Flask's session['state'])
      (req.session as any).oauth_state = authUrl.split('state=')[1]?.split('&')[0];
      
      console.log('🔄 Redirecting to Google OAuth:', redirectUri);
      res.redirect(authUrl);
    } catch (error) {
      console.error('❌ OAuth initiation error:', error);
      res.redirect('/?error=auth_error&details=' + encodeURIComponent('Failed to initiate OAuth'));
    }
  });

  // Callback route (equivalent to Flask's /oauth2callback)
  app.get('/api/auth/google/callback', async (req: Request, res: Response) => {
    try {
      const { code, state, error } = req.query;
      
      if (error) {
        console.error('❌ OAuth error:', error);
        return res.redirect('/?error=oauth_error&details=' + encodeURIComponent(error as string));
      }

      if (!code) {
        return res.redirect('/?error=oauth_error&details=' + encodeURIComponent('No authorization code received'));
      }

      // Validate state (like Flask's state validation)
      const sessionState = (req.session as any).oauth_state;
      if (state !== sessionState) {
        return res.redirect('/?error=oauth_error&details=' + encodeURIComponent('Invalid state parameter'));
      }

      // Set redirect URI for token exchange
      const baseUrl = req.get('host') ? `https://${req.get('host')}` : 'http://localhost:5000';
      oauth2Client.redirectUri = `${baseUrl}/api/auth/google/callback`;

      // Exchange code for token (like Flask's oauth_flow.fetch_token)
      const { tokens } = await oauth2Client.getToken(code as string);
      
      // Store access token in session (exactly like Flask)
      (req.session as any).access_token = tokens.access_token;
      
      console.log('✅ OAuth successful, access token stored in session');
      res.redirect('/'); // Redirect to home page like Flask
    } catch (error) {
      console.error('❌ OAuth callback error:', error);
      res.redirect('/?error=oauth_error&details=' + encodeURIComponent('Authentication failed'));
    }
  });

  // Get user info function (like Flask's get_user_info)
  async function getUserInfo(accessToken: string) {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      return null;
    }
  }

  // User info route (like Flask's welcome route)
  app.get('/api/auth/user', async (req: Request, res: Response) => {
    try {
      const session = req.session as any;
      
      if (!session.access_token) {
        return res.json({ 
          isAuthenticated: false, 
          user: null 
        });
      }

      const userInfo = await getUserInfo(session.access_token);
      
      if (!userInfo) {
        // Clear invalid session
        session.access_token = null;
        return res.json({ 
          isAuthenticated: false, 
          user: null 
        });
      }

      // Store user in database if needed
      if (userInfo.sub) {
        await storage.upsertUser({
          id: userInfo.sub,
          email: userInfo.email,
          firstName: userInfo.given_name || '',
          lastName: userInfo.family_name || '',
          profileImageUrl: userInfo.picture || '',
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
      console.error('Error fetching user:', error);
      res.json({ 
        isAuthenticated: false, 
        user: null 
      });
    }
  });

  // Logout route (like Flask's logout)
  app.get('/api/auth/logout', (req: Request, res: Response) => {
    (req.session as any).access_token = null;
    req.session.destroy(() => {
      res.redirect('/');
    });
  });

  console.log('✅ Simplified Google OAuth configured');
}