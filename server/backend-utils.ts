// Backend Utilities - Common helper functions for the server
import { Request, Response } from 'express';

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Response helpers
export const createSuccessResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
  success: true,
  data,
  message,
  timestamp: Date.now()
});

export const createErrorResponse = (error: string, message?: string): ApiResponse => ({
  success: false,
  error,
  message,
  timestamp: Date.now()
});

// Validation helpers
export const validateRequiredFields = (body: any, requiredFields: string[]): ValidationResult => {
  const errors: string[] = [];
  
  requiredFields.forEach(field => {
    if (!body[field] || (typeof body[field] === 'string' && body[field].trim() === '')) {
      errors.push(`${field} is required`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// Pagination helpers
export const getPaginationParams = (req: Request): PaginationParams => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
  const offset = (page - 1) * limit;
  
  return { page, limit, offset };
};

// Error handling helpers
export const handleAsyncError = (fn: Function) => {
  return (req: Request, res: Response, next: Function) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const logError = (error: any, context?: string) => {
  console.error(`❌ ${context || 'Backend Error'}:`, {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
};

// Data processing helpers
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[&]/g, '&amp;') // Escape ampersands
    .substring(0, 1000); // Limit length
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDate = (date: Date): string => {
  return date.toISOString();
};

// Rate limiting helpers
export class RateLimiter {
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

// File handling helpers
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const isValidFileType = (filename: string, allowedTypes: string[]): boolean => {
  const extension = getFileExtension(filename);
  return allowedTypes.includes(extension);
};

export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// Performance monitoring helpers
export class PerformanceMonitor {
  private startTime: number;
  private metrics: Map<string, number[]> = new Map();

  constructor() {
    this.startTime = Date.now();
  }

  startTimer(label: string): void {
    this.metrics.set(label, [Date.now()]);
  }

  endTimer(label: string): number {
    const start = this.metrics.get(label)?.[0];
    if (!start) return 0;
    
    const duration = Date.now() - start;
    const durations = this.metrics.get(label) || [];
    durations.push(duration);
    this.metrics.set(label, durations);
    
    return duration;
  }

  getAverageTime(label: string): number {
    const durations = this.metrics.get(label);
    if (!durations || durations.length === 0) return 0;
    
    const sum = durations.reduce((acc, time) => acc + time, 0);
    return Math.round(sum / durations.length);
  }

  getMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [label, durations] of this.metrics.entries()) {
      result[label] = this.getAverageTime(label);
    }
    return result;
  }
}

// Export default utilities object
export default {
  createSuccessResponse,
  createErrorResponse,
  validateRequiredFields,
  validateEmail,
  validatePhoneNumber,
  getPaginationParams,
  handleAsyncError,
  logError,
  sanitizeInput,
  generateId,
  formatDate,
  RateLimiter,
  getFileExtension,
  isValidFileType,
  formatFileSize,
  PerformanceMonitor
};
