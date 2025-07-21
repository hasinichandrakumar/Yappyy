// Magic Link Authentication Routes
import type { Express, Request, Response, NextFunction } from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { z } from 'zod';
import { magicLinkService, sendMagicLinkEmail } from './auth-magic-link';
import { db } from './db';

const PgSession = connectPgSimple(session);

// Request interfaces
interface AuthenticatedRequest extends Request {
  user?: any;
  session: session.Session & {
    userId?: string;
    user?: any;
  };
}

// Validation schemas
const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

const verifyTokenSchema = z.object({
  token: z.string().min(1, 'Token is required')
});

// Setup magic link authentication
export async function setupMagicLinkAuth(app: Express): Promise<void> {
  // Session configuration
  app.use(session({
    store: new PgSession({
      pool: db,
      tableName: 'sessions',
      createTableIfMissing: false,
    }),
    secret: process.env.SESSION_SECRET || 'fallback-session-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    name: 'yappyy.session',
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    },
  }));

  // Request magic link
  app.post('/api/auth/request-magic-link', async (req: Request, res: Response) => {
    try {
      const { email } = emailSchema.parse(req.body);

      console.log(`🔗 Magic link requested for: ${email}`);
      
      // Generate magic link
      const { token, expires } = await magicLinkService.generateMagicLink(email);
      
      // Send email (in development, just log it)
      const emailSent = await sendMagicLinkEmail(email, token);
      
      if (!emailSent) {
        return res.status(500).json({ 
          error: 'Failed to send magic link email. Please try again.' 
        });
      }

      res.json({ 
        success: true, 
        message: 'Magic link sent to your email address!',
        expires: expires.toISOString(),
        // In development, include the token for testing
        ...(process.env.NODE_ENV === 'development' && { 
          developmentToken: token,
          developmentUrl: `/auth/verify?token=${token}`
        })
      });

    } catch (error) {
      console.error('❌ Error requesting magic link:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: error.errors[0].message 
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to request magic link. Please try again.' 
      });
    }
  });

  // Verify magic link and authenticate user
  app.get('/auth/verify', async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { token } = verifyTokenSchema.parse(req.query);

      console.log(`🔍 Verifying magic link token...`);
      
      // Validate magic link
      const validation = await magicLinkService.validateMagicLink(token);
      
      if (!validation.valid || !validation.user) {
        console.log('❌ Magic link validation failed');
        return res.redirect('/?error=invalid-or-expired-link');
      }

      // Mark magic link as used
      await magicLinkService.markMagicLinkUsed(token);
      
      // Set session
      req.session.userId = validation.user.id;
      req.session.user = validation.user;

      console.log(`✅ User authenticated via magic link: ${validation.email}`);
      
      // Redirect to dashboard
      res.redirect('/?auth=success');

    } catch (error) {
      console.error('❌ Error verifying magic link:', error);
      res.redirect('/?error=verification-failed');
    }
  });

  // Get current user
  app.get('/api/auth/user', (req: AuthenticatedRequest, res: Response) => {
    console.log('Auth check - req.session.user:', req.session.user ? 'exists' : 'null');
    console.log('Auth check - isAuthenticated():', isAuthenticated(req));
    
    if (isAuthenticated(req)) {
      res.json(req.session.user);
    } else {
      console.log('No authenticated user found, returning null');
      res.json(null);
    }
  });

  // Logout
  app.post('/api/auth/logout', (req: AuthenticatedRequest, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('❌ Error destroying session:', err);
        return res.status(500).json({ error: 'Failed to logout' });
      }
      
      res.clearCookie('yappyy.session');
      console.log('✅ User logged out successfully');
      res.json({ success: true });
    });
  });

  // Legacy logout route (for existing links)
  app.get('/api/auth/logout', (req: AuthenticatedRequest, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('❌ Error destroying session:', err);
      }
      
      res.clearCookie('yappyy.session');
      console.log('✅ User logged out successfully');
      res.redirect('/');
    });
  });

  console.log('🔗 Magic Link Authentication system initialized');
}

// Authentication middleware
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (isAuthenticated(req)) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
}

// Check if user is authenticated
export function isAuthenticated(req: AuthenticatedRequest): boolean {
  return !!(req.session && req.session.userId && req.session.user);
}

// Get authenticated user
export function getAuthenticatedUser(req: AuthenticatedRequest): any | null {
  if (isAuthenticated(req)) {
    return req.session.user;
  }
  return null;
}