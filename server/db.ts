import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure WebSocket for Neon serverless
if (typeof WebSocket === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create pool with optimized configuration for Neon serverless
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 3,
  idleTimeoutMillis: 60000, // 1 minute
  connectionTimeoutMillis: 15000, // 15 seconds
  allowExitOnIdle: false,
});

// Add comprehensive error handling with auto-recovery
pool.on('error', (err) => {
  console.error('Database pool error:', err.message);
  console.log('🔄 Database will auto-reconnect on next query');
  // Don't throw here to prevent app crashes
});

pool.on('connect', () => {
  console.log('Database connected successfully');
});

// Create a resilient query wrapper
export async function resilientQuery(callback: () => Promise<any>) {
  try {
    return await callback();
  } catch (error: any) {
    console.error('Database query error:', error.message);
    
    // Check if it's a connection error
    if (error.code === '57P01' || error.message.includes('terminating connection')) {
      console.log('🔄 Connection terminated, retrying...');
      // Wait a bit and retry once
      await new Promise(resolve => setTimeout(resolve, 1000));
      try {
        return await callback();
      } catch (retryError) {
        console.error('Retry failed:', retryError.message);
        throw retryError;
      }
    }
    throw error;
  }
}

export const db = drizzle({ client: pool, schema });