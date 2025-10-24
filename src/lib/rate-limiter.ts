import { NextRequest } from 'next/server'

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
}

interface RequestLog {
  count: number
  resetTime: number
}

// In-memory storage (consider Redis for production)
const requestLog = new Map<string, RequestLog>()

export function createRateLimiter(config: RateLimitConfig) {
  return async (request: NextRequest): Promise<{ success: boolean; error?: string; headers: Record<string, string> }> => {
    // Get client identifier (IP address)
    const clientId = getClientIdentifier(request)
    
    const now = Date.now()
    const windowStart = now - config.windowMs
    
    // Clean up old entries
    cleanupOldEntries(windowStart)
    
    // Get or create request log for this client
    let log = requestLog.get(clientId)
    
    if (!log || log.resetTime <= now) {
      // Create new window
      log = {
        count: 1,
        resetTime: now + config.windowMs
      }
      requestLog.set(clientId, log)
    } else {
      // Increment count in current window
      log.count++
    }
    
    const remaining = Math.max(0, config.maxRequests - log.count)
    const resetTime = Math.ceil(log.resetTime / 1000)
    
    const headers = {
      'X-RateLimit-Limit': config.maxRequests.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': resetTime.toString(),
    }
    
    if (log.count > config.maxRequests) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.',
        headers: {
          ...headers,
          'Retry-After': Math.ceil((log.resetTime - now) / 1000).toString()
        }
      }
    }
    
    return { success: true, headers }
  }
}

function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from headers (for deployments behind proxies)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  // Use the first available IP
  const ip = cfConnectingIp || realIp || forwarded?.split(',')[0] || 'unknown'
  
  return ip.trim()
}

function cleanupOldEntries(cutoffTime: number): void {
  const now = Date.now()
  
  for (const [clientId, log] of requestLog.entries()) {
    if (log.resetTime <= now) {
      requestLog.delete(clientId)
    }
  }
}

// Predefined rate limiters
export const paymentRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10 // 10 payment attempts per 15 minutes
})

export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100 // 100 requests per minute
})

export const strictRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute  
  maxRequests: 20 // 20 requests per minute
})