// Magic Link Authentication System
import { randomBytes, createHash } from 'crypto';
import { eq, and, gt } from 'drizzle-orm';
import { db } from './db';
import { magicLinks, users } from '../shared/schema';

export interface MagicLinkService {
  generateMagicLink(email: string): Promise<{ token: string; expires: Date }>;
  validateMagicLink(token: string): Promise<{ valid: boolean; email?: string; user?: any }>;
  markMagicLinkUsed(token: string): Promise<void>;
}

class MagicLinkAuthService implements MagicLinkService {
  // Generate a secure magic link token
  private generateToken(): string {
    return randomBytes(32).toString('hex');
  }

  // Hash token for secure storage
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  // Generate magic link for email
  async generateMagicLink(email: string): Promise<{ token: string; expires: Date }> {
    try {
      const token = this.generateToken();
      const hashedToken = this.hashToken(token);
      const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Clean up old magic links for this email
      await db.delete(magicLinks).where(eq(magicLinks.email, email.toLowerCase()));

      // Store new magic link
      await db.insert(magicLinks).values({
        email: email.toLowerCase(),
        token: hashedToken,
        expiresAt: expires,
      });

      console.log(`🔗 Magic link generated for ${email}, expires at ${expires.toISOString()}`);
      return { token, expires };
    } catch (error) {
      console.error('❌ Error generating magic link:', error);
      throw new Error('Failed to generate magic link');
    }
  }

  // Validate magic link token
  async validateMagicLink(token: string): Promise<{ valid: boolean; email?: string; user?: any }> {
    try {
      const hashedToken = this.hashToken(token);
      const now = new Date();

      // Find valid magic link
      const [magicLink] = await db
        .select()
        .from(magicLinks)
        .where(
          and(
            eq(magicLinks.token, hashedToken),
            gt(magicLinks.expiresAt, now),
            eq(magicLinks.usedAt, null)
          )
        )
        .limit(1);

      if (!magicLink) {
        console.log('⚠️ Magic link validation failed: token not found or expired');
        return { valid: false };
      }

      // Find or create user
      let [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, magicLink.email))
        .limit(1);

      if (!user) {
        // Create new user
        const newUserId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        [user] = await db
          .insert(users)
          .values({
            id: newUserId,
            email: magicLink.email,
            firstName: magicLink.email.split('@')[0],
            lastName: '',
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        console.log(`✅ New user created via magic link: ${magicLink.email}`);
      } else {
        console.log(`✅ Existing user authenticated via magic link: ${magicLink.email}`);
      }

      return { valid: true, email: magicLink.email, user };
    } catch (error) {
      console.error('❌ Error validating magic link:', error);
      return { valid: false };
    }
  }

  // Mark magic link as used
  async markMagicLinkUsed(token: string): Promise<void> {
    try {
      const hashedToken = this.hashToken(token);
      await db
        .update(magicLinks)
        .set({ usedAt: new Date() })
        .where(eq(magicLinks.token, hashedToken));

      console.log('🔒 Magic link marked as used');
    } catch (error) {
      console.error('❌ Error marking magic link as used:', error);
    }
  }

  // Clean up expired magic links (should be run periodically)
  async cleanupExpiredLinks(): Promise<void> {
    try {
      const now = new Date();
      const result = await db
        .delete(magicLinks)
        .where(gt(now, magicLinks.expiresAt));

      console.log(`🧹 Cleaned up expired magic links`);
    } catch (error) {
      console.error('❌ Error cleaning up expired magic links:', error);
    }
  }
}

// Export singleton instance
export const magicLinkService = new MagicLinkAuthService();

// Email sending function with SendGrid integration
export async function sendMagicLinkEmail(email: string, token: string): Promise<boolean> {
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  const magicLink = `${baseUrl}/auth/verify?token=${token}`;
  
  try {
    // Check if SendGrid is configured
    if (process.env.SENDGRID_API_KEY) {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: email,
        from: 'noreply@yappyy.com', // Replace with your verified SendGrid sender
        subject: 'Sign in to Yappyy - Your Magic Link',
        html: `
          <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; font-size: 32px; margin: 0; background: linear-gradient(135deg, #2563eb 0%, #22d3ee 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                Yappyy
              </h1>
              <p style="color: #6b7280; font-size: 16px; margin: 5px 0 0 0;">AI-Powered Speech Training Platform</p>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 20px 0;">Welcome Back!</h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                Click the button below to sign in to your Yappyy account and continue your speaking improvement journey.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${magicLink}" style="background: linear-gradient(135deg, #2563eb 0%, #22d3ee 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
                  Sign In to Yappyy
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin: 20px 0 0 0;">
                This link will expire in 15 minutes for security. If you didn't request this, you can safely ignore this email.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #9ca3af; font-size: 12px;">
                © 2025 Yappyy. All rights reserved.
              </p>
            </div>
          </div>
        `,
        text: `Welcome to Yappyy!\n\nClick this link to sign in: ${magicLink}\n\nThis link expires in 15 minutes.\n\nIf you didn't request this, you can safely ignore this email.`
      };

      await sgMail.send(msg);
      console.log(`✅ Magic link email sent successfully to ${email}`);
      return true;
    } else {
      // Development mode - log to console
      console.log('🔗 MAGIC LINK (Development Mode):');
      console.log(`📧 Email: ${email}`);
      console.log(`🔗 Magic Link: ${magicLink}`);
      console.log('⏰ Expires in 15 minutes');
      console.log('💡 Configure SENDGRID_API_KEY to send actual emails');
      return true;
    }
  } catch (error) {
    console.error('❌ Failed to send magic link email:', error);
    // Still log to console as fallback
    console.log('🔗 MAGIC LINK (Fallback - Email Failed):');
    console.log(`📧 Email: ${email}`);
    console.log(`🔗 Magic Link: ${magicLink}`);
    return false;
  }
}