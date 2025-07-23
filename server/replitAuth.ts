import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

// Replit Auth configuration
const REPLIT_USER_ID = process.env.REPLIT_USERID || process.env.REPL_OWNER_ID || '';
const REPLIT_USER_NAME = process.env.REPLIT_USER || process.env.REPL_OWNER || '';
const REPLIT_APP_NAME = process.env.REPL_SLUG || 'yappyy';

interface ReplitUser {
  id: string;
  username: string;
  name?: string;
  avatar?: string;
  email?: string;
}

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
      secure: false, // Set to false for development
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  console.log('🔧 Replit Auth Setup - User ID:', REPLIT_USER_ID);
  console.log('🔧 Replit Auth Setup - Username:', REPLIT_USER_NAME);
  
  app.set("trust proxy", 1);
  app.use(getSession());

  // Replit Auth login endpoint
  app.get("/api/auth/replit", async (req: any, res) => {
    try {
      const replitUser = getReplitUser(req);
      
      if (replitUser) {
        // Create or update user with Replit data
        const user = await storage.upsertUser({
          id: replitUser.id,
          email: replitUser.email || `${replitUser.username}@replit.com`,
          firstName: replitUser.name?.split(' ')[0] || replitUser.username,
          lastName: replitUser.name?.split(' ').slice(1).join(' ') || '',
          profileImageUrl: replitUser.avatar || 'https://via.placeholder.com/150'
        });

        // Set session with Replit user data
        req.session.user = {
          replit: replitUser,
          claims: {
            sub: user.id,
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            profile_image_url: user.profileImageUrl
          }
        };

        console.log('✅ Replit Auth: User logged in:', replitUser.username);
        res.redirect('/dashboard');
      } else {
        // Fallback to demo user if no Replit user
        await setupDemoUser(req);
        console.log('⚠️ Replit Auth: Using demo mode');
        res.redirect('/dashboard');
      }
    } catch (error) {
      console.error("Replit Auth error:", error);
      // Fallback to demo user on error
      await setupDemoUser(req);
      res.redirect('/dashboard');
    }
  });

  // Demo login endpoint - creates a demo user session
  app.get("/api/login", async (req: any, res) => {
    await setupDemoUser(req);
    res.redirect('/dashboard');
  });

  app.get("/api/logout", (req: any, res) => {
    req.session.destroy(() => {
      res.redirect('/');
    });
  });

  // Auto-login middleware for seamless experience
  app.use(async (req: any, res, next) => {
    if (!req.session.user) {
      const replitUser = getReplitUser(req);
      if (replitUser) {
        try {
          // Auto-create session for Replit users
          const user = await storage.upsertUser({
            id: replitUser.id,
            email: replitUser.email || `${replitUser.username}@replit.com`,
            firstName: replitUser.name?.split(' ')[0] || replitUser.username,
            lastName: replitUser.name?.split(' ').slice(1).join(' ') || '',
            profileImageUrl: replitUser.avatar || 'https://via.placeholder.com/150'
          });
          
          req.session.user = {
            replit: replitUser,
            claims: {
              sub: user.id,
              email: user.email,
              first_name: user.firstName,
              last_name: user.lastName,
              profile_image_url: user.profileImageUrl
            }
          };
          
          // Reduced logging to prevent spam
          if (!req.session.loginLogged) {
            console.log('🔄 Auto-login successful for Replit user:', replitUser.username);
            req.session.loginLogged = true;
          }
        } catch (error) {
          console.error('Auto-login error:', error);
        }
      }
    }
    next();
  });
}

// Helper function to get Replit user from environment/headers
function getReplitUser(req: any): ReplitUser | null {
  try {
    // Check for Replit user ID in environment
    if (REPLIT_USER_ID) {
      // In Replit environment, user data is available
      return {
        id: REPLIT_USER_ID,
        username: REPLIT_USER_NAME || REPLIT_USER_ID,
        name: process.env.REPLIT_USER_DISPLAY_NAME || REPLIT_USER_NAME,
        avatar: process.env.REPLIT_USER_AVATAR,
        email: process.env.REPLIT_USER_EMAIL || `${REPLIT_USER_NAME}@replit.com`
      };
    }

    // Check for Replit headers (fallback)
    const replitUserId = req.headers['x-replit-user-id'] || req.headers['replit-user-id'];
    const replitUserName = req.headers['x-replit-user-name'] || req.headers['replit-user-name'];
    
    if (replitUserId) {
      return {
        id: replitUserId as string,
        username: (replitUserName as string) || replitUserId as string,
        name: req.headers['x-replit-user-display-name'] as string,
        avatar: req.headers['x-replit-user-avatar'] as string
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting Replit user:', error);
    return null;
  }
}

// Helper function to setup demo user
async function setupDemoUser(req: any) {
  try {
    const demoUser = await storage.upsertUser({
      id: 'demo-user',
      email: 'demo@example.com',
      firstName: 'Demo',
      lastName: 'User',
      profileImageUrl: 'https://via.placeholder.com/150'
    });

    req.session.user = {
      claims: {
        sub: demoUser.id,
        email: demoUser.email,
        first_name: demoUser.firstName,
        last_name: demoUser.lastName,
        profile_image_url: demoUser.profileImageUrl
      }
    };
  } catch (error) {
    console.error("Demo user setup error:", error);
  }
}

export const isAuthenticated: RequestHandler = async (req: any, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }
  
  return res.status(401).json({ message: "Unauthorized" });
};