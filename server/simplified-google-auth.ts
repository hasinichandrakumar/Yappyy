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
      oauth2Client.setCredentials(tokens);

      // Get user info (like Flask's get_user_info)
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const { data: userInfo } = await oauth2.userinfo.get();

      if (!userInfo.id || !userInfo.email) {
        return res.redirect('/?error=oauth_error&details=' + encodeURIComponent('Failed to retrieve user information'));
      }

      // Store user in database
      const userData = {
        id: userInfo.id,
        email: userInfo.email,
        firstName: userInfo.given_name || '',
        lastName: userInfo.family_name || '',
        profileImageUrl: userInfo.picture || '',
        firstLoginAt: new Date(),
      };

      const user = await storage.upsertUser(userData);
      
      // Store access token in session (like Flask's session['access_token'])
      (req.session as any).access_token = tokens.access_token;
      (req.session as any).user_id = user.id;
      
      console.log('✅ User authenticated successfully:', user.email);
      
      // Redirect to dashboard (like Flask's redirect("/"))
      res.redirect('/dashboard');
    } catch (error) {
      console.error('❌ OAuth callback error:', error);
      res.redirect('/?error=oauth_error&details=' + encodeURIComponent('Authentication failed'));
    }
  });

  // User info route
  app.get('/api/auth/user', async (req: Request, res: Response) => {
    try {
      const session = req.session as any;
      
      if (!session.access_token || !session.user_id) {
        return res.json({ 
          isAuthenticated: false, 
          user: null 
        });
      }

      const user = await storage.getUser(session.user_id);
      
      if (!user) {
        // Clear invalid session
        session.access_token = null;
        session.user_id = null;
        return res.json({ 
          isAuthenticated: false, 
          user: null 
        });
      }

      const userResponse = {
        id: user.id,
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
        username: user.email,
        profileImageUrl: user.profileImageUrl,
        isAuthenticated: true,
        authType: 'google'
      };

      res.json(userResponse);
    } catch (error) {
      console.error('❌ Error fetching user:', error);
      res.status(500).json({ error: 'Failed to fetch user data' });
    }
  });

  // Logout route (equivalent to Flask's /logout)
  app.get('/api/auth/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('❌ Logout error:', err);
      }
      res.redirect('/');
    });
  });

  console.log('✅ Simplified Google OAuth configured');
}