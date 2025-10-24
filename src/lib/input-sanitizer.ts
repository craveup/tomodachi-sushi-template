import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitizes user input to prevent XSS attacks and other malicious content
 */
export class InputSanitizer {
  /**
   * Sanitizes plain text input by removing HTML tags and dangerous characters
   */
  static sanitizeText(input: string): string {
    if (typeof input !== 'string') {
      return ''
    }
    
    // Remove HTML tags and decode entities
    const cleaned = DOMPurify.sanitize(input, { 
      ALLOWED_TAGS: [], 
      ALLOWED_ATTR: [] 
    })
    
    // Trim whitespace and limit length
    return cleaned.trim().slice(0, 1000)
  }

  /**
   * Sanitizes search queries with additional restrictions
   */
  static sanitizeSearchQuery(query: string): string {
    if (typeof query !== 'string') {
      return ''
    }

    // Remove HTML and script tags
    let cleaned = DOMPurify.sanitize(query, { 
      ALLOWED_TAGS: [], 
      ALLOWED_ATTR: [] 
    })

    // Remove special characters that could be used for injection
    cleaned = cleaned.replace(/[<>;"'(){}[\]\\]/g, '')
    
    // Limit length and trim
    return cleaned.trim().slice(0, 100)
  }

  /**
   * Sanitizes email addresses
   */
  static sanitizeEmail(email: string): string {
    if (typeof email !== 'string') {
      return ''
    }

    // Basic email sanitization
    const cleaned = email.toLowerCase().trim()
    
    // Simple email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(cleaned)) {
      return ''
    }

    return cleaned.slice(0, 254) // RFC 5321 limit
  }

  /**
   * Sanitizes phone numbers
   */
  static sanitizePhoneNumber(phone: string): string {
    if (typeof phone !== 'string') {
      return ''
    }

    // Remove all non-numeric characters except + and spaces
    const cleaned = phone.replace(/[^\d+\s()-]/g, '').trim()
    
    return cleaned.slice(0, 20)
  }

  /**
   * Sanitizes names (first name, last name, etc.)
   */
  static sanitizeName(name: string): string {
    if (typeof name !== 'string') {
      return ''
    }

    // Remove HTML and allow only letters, spaces, hyphens, and apostrophes
    let cleaned = DOMPurify.sanitize(name, { 
      ALLOWED_TAGS: [], 
      ALLOWED_ATTR: [] 
    })

    // Allow only letters, spaces, hyphens, apostrophes, and dots
    cleaned = cleaned.replace(/[^a-zA-Z\s\-'.]/g, '')
    
    return cleaned.trim().slice(0, 50)
  }

  /**
   * Sanitizes addresses
   */
  static sanitizeAddress(address: string): string {
    if (typeof address !== 'string') {
      return ''
    }

    // Remove HTML but allow alphanumeric, spaces, and common address characters
    let cleaned = DOMPurify.sanitize(address, { 
      ALLOWED_TAGS: [], 
      ALLOWED_ATTR: [] 
    })

    // Allow letters, numbers, spaces, and common address punctuation
    cleaned = cleaned.replace(/[^a-zA-Z0-9\s\-,.#/]/g, '')
    
    return cleaned.trim().slice(0, 200)
  }

  /**
   * Sanitizes promo codes
   */
  static sanitizePromoCode(code: string): string {
    if (typeof code !== 'string') {
      return ''
    }

    // Remove HTML and allow only alphanumeric characters
    let cleaned = DOMPurify.sanitize(code, { 
      ALLOWED_TAGS: [], 
      ALLOWED_ATTR: [] 
    })

    // Allow only letters and numbers
    cleaned = cleaned.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    
    return cleaned.slice(0, 20)
  }

  /**
   * Sanitizes menu item comments/special instructions
   */
  static sanitizeComments(comments: string): string {
    if (typeof comments !== 'string') {
      return ''
    }

    // Remove HTML but allow basic punctuation for food instructions
    let cleaned = DOMPurify.sanitize(comments, { 
      ALLOWED_TAGS: [], 
      ALLOWED_ATTR: [] 
    })

    // Allow letters, numbers, spaces, and basic punctuation
    cleaned = cleaned.replace(/[^a-zA-Z0-9\s\-,.'!?]/g, '')
    
    return cleaned.trim().slice(0, 500)
  }

  /**
   * Sanitizes URLs (for user-provided links)
   */
  static sanitizeUrl(url: string): string {
    if (typeof url !== 'string') {
      return ''
    }

    try {
      const parsedUrl = new URL(url)
      
      // Only allow HTTP and HTTPS protocols
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return ''
      }
      
      return parsedUrl.toString()
    } catch {
      return ''
    }
  }
}

/**
 * Validation schemas for common input types
 */
export const InputValidators = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 254
  },

  isValidPhoneNumber: (phone: string): boolean => {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,20}$/
    return phoneRegex.test(phone)
  },

  isValidPromoCode: (code: string): boolean => {
    const promoRegex = /^[A-Z0-9]{3,20}$/
    return promoRegex.test(code)
  },

  isValidAmount: (amount: number): boolean => {
    return typeof amount === 'number' && 
           amount >= 0 && 
           amount <= 999999 && 
           Number.isFinite(amount)
  }
}