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

// Email sending utility (mock for development, replace with real service in production)
export async function sendMagicLinkEmail(email: string, token: string): Promise<boolean> {
  try {
    const magicLinkUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/auth/verify?token=${token}`;
    
    // In development, just log the magic link
    if (process.env.NODE_ENV === 'development') {
      console.log('\n🔗 MAGIC LINK (Development Mode):');
      console.log(`📧 Email: ${email}`);
      console.log(`🔗 Magic Link: ${magicLinkUrl}`);
      console.log('⏰ Expires in 15 minutes\n');
      return true;
    }

    // In production, you would integrate with a real email service here
    // For example: SendGrid, AWS SES, Mailgun, etc.
    console.log(`📧 Magic link email would be sent to ${email} in production`);
    console.log(`🔗 Magic link URL: ${magicLinkUrl}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error sending magic link email:', error);
    return false;
  }
}