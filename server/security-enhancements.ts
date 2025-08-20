// Security Enhancements - Focused security improvements
import crypto from 'crypto';

// Generate a secure session secret if none is provided
export const getSecureSessionSecret = (): string => {
  const envSecret = process.env.SESSION_SECRET;
  
  if (!envSecret) {
    console.warn('⚠️ WARNING: No SESSION_SECRET set! Generating a secure one...');
    const generatedSecret = crypto.randomBytes(32).toString('base64');
    console.log('🔐 Generated secure session secret. Set SESSION_SECRET environment variable to:', generatedSecret);
    return generatedSecret;
  }
  
  if (envSecret.length < 32) {
    console.warn('⚠️ WARNING: SESSION_SECRET is too short! Should be at least 32 characters.');
  }
  
  return envSecret;
};

// Validate database URL for security
export const validateDatabaseUrl = (): void => {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    throw new Error('DATABASE_URL must be set');
  }
  
  if (process.env.NODE_ENV === 'production') {
    if (!dbUrl.includes('sslmode=require')) {
      console.warn('⚠️ WARNING: Database connection should use SSL in production. Add ?sslmode=require to DATABASE_URL');
    }
    
    if (dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1')) {
      console.warn('⚠️ WARNING: Using localhost database in production!');
    }
  }
};

// Security headers middleware
export const securityHeaders = (req: any, res: any, next: any) => {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Control referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Restrict permissions
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Remove server information
  res.removeHeader('X-Powered-By');
  
  next();
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[&]/g, '&amp;') // Escape ampersands
    .substring(0, 1000); // Limit length
};

// Mask sensitive data in logs
export const maskSensitiveData = (data: any): any => {
  if (typeof data === 'string') {
    // Mask email addresses
    return data.replace(/([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, 
      (match, user, domain) => `${user.substring(0, 2)}***@${domain}`);
  }
  
  if (typeof data === 'object' && data !== null) {
    const masked = { ...data };
    if (masked.email) masked.email = maskSensitiveData(masked.email);
    if (masked.password) masked.password = '***';
    if (masked.token) masked.token = '***';
    if (masked.secret) masked.secret = '***';
    return masked;
  }
  
  return data;
};

// Rate limiting helper
export class SimpleRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, [now]);
      return true;
    }
    
    const requests = this.requests.get(identifier)!;
    const recentRequests = requests.filter(time => time > windowStart);
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    return true;
  }

  cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    for (const [identifier, requests] of this.requests.entries()) {
      const recentRequests = requests.filter(time => time > windowStart);
      if (recentRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, recentRequests);
      }
    }
  }
}

// Secure session configuration
export const getSecureSessionConfig = () => {
  const isProd = process.env.NODE_ENV === 'production';
  
  return {
    secret: getSecureSessionSecret(),
    name: 'yappyy.sid',
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    },
    resave: true,
    saveUninitialized: true,
    rolling: true,
    proxy: true,
  };
};

// Validate environment variables
export const validateEnvironment = (): void => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required variables
  if (!process.env.DATABASE_URL) {
    errors.push('DATABASE_URL not set');
  }

  // Security warnings
  if (!process.env.SESSION_SECRET) {
    warnings.push('SESSION_SECRET not set - using generated secret');
  } else if (process.env.SESSION_SECRET.length < 32) {
    warnings.push('SESSION_SECRET is too short - should be at least 32 characters');
  }

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    warnings.push('Google OAuth credentials not configured');
  }

  // Log results
  if (warnings.length > 0) {
    console.warn('⚠️ Security Warnings:', warnings);
  }
  if (errors.length > 0) {
    console.error('❌ Security Errors:', errors);
    throw new Error('Critical environment variables missing');
  }

  console.log('✅ Environment validation passed');
};

// Export default security utilities
export default {
  getSecureSessionSecret,
  validateDatabaseUrl,
  securityHeaders,
  sanitizeInput,
  maskSensitiveData,
  SimpleRateLimiter,
  getSecureSessionConfig,
  validateEnvironment,
};
