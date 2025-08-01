/**
 * Business configuration for restaurant ordering system
 * These values should be configurable per restaurant/environment
 */

export interface BusinessConfig {
  pricing: {
    taxRate: number
    defaultTipPercentages: number[]
    deliveryFee: number
    minimumOrderAmount: number
    currency: string
    locale: string
  }
  cart: {
    maxQuantityPerItem: number
    maxTotalItems: number
    sessionTimeoutMinutes: number
  }
  ordering: {
    advanceOrderDays: number
    orderCutoffMinutes: number
    deliveryRadiusKm: number
    enableScheduledOrders: boolean
  }
  ui: {
    maxRecentSearches: number
    defaultItemsPerPage: number
    imageQuality: 'low' | 'medium' | 'high'
    enableAnimations: boolean
  }
}

// Default configuration - can be overridden per restaurant
export const DEFAULT_BUSINESS_CONFIG: BusinessConfig = {
  pricing: {
    taxRate: 0.08875, // NYC tax rate
    defaultTipPercentages: [15, 18, 20, 25],
    deliveryFee: 2.99,
    minimumOrderAmount: 15.00,
    currency: 'USD',
    locale: 'en-US'
  },
  cart: {
    maxQuantityPerItem: 99,
    maxTotalItems: 50,
    sessionTimeoutMinutes: 30
  },
  ordering: {
    advanceOrderDays: 7,
    orderCutoffMinutes: 30,
    deliveryRadiusKm: 5,
    enableScheduledOrders: true
  },
  ui: {
    maxRecentSearches: 5,
    defaultItemsPerPage: 20,
    imageQuality: 'medium',
    enableAnimations: true
  }
}

// Environment-specific overrides
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

const ENV_OVERRIDES: Record<string, DeepPartial<BusinessConfig>> = {
  development: {
    ui: {
      enableAnimations: false // Faster development
    }
  },
  staging: {
    pricing: {
      deliveryFee: 0 // Free delivery for testing
    }
  }
}

/**
 * Get business configuration with environment overrides applied
 */
export function getBusinessConfig(): BusinessConfig {
  const env = process.env.NODE_ENV || 'development'
  const overrides = ENV_OVERRIDES[env] || {}
  
  return {
    ...DEFAULT_BUSINESS_CONFIG,
    ...overrides,
    pricing: {
      ...DEFAULT_BUSINESS_CONFIG.pricing,
      ...overrides.pricing
    },
    cart: {
      ...DEFAULT_BUSINESS_CONFIG.cart,
      ...overrides.cart
    },
    ordering: {
      ...DEFAULT_BUSINESS_CONFIG.ordering,
      ...overrides.ordering
    },
    ui: {
      ...DEFAULT_BUSINESS_CONFIG.ui,
      ...overrides.ui
    }
  } as BusinessConfig
}

/**
 * Convenience functions for common business rules
 */
export const BusinessRules = {
  calculateTax: (subtotal: number): number => {
    const config = getBusinessConfig()
    return subtotal * config.pricing.taxRate
  },
  
  calculateTotal: (subtotal: number, tip = 0): number => {
    const config = getBusinessConfig()
    const tax = BusinessRules.calculateTax(subtotal)
    return subtotal + tax + config.pricing.deliveryFee + tip
  },
  
  isValidQuantity: (quantity: number): boolean => {
    const config = getBusinessConfig()
    return quantity > 0 && quantity <= config.cart.maxQuantityPerItem
  },
  
  meetsMinimumOrder: (total: number): boolean => {
    const config = getBusinessConfig()
    return total >= config.pricing.minimumOrderAmount
  },
  
  isWithinDeliveryRadius: (distanceKm: number): boolean => {
    const config = getBusinessConfig()
    return distanceKm <= config.ordering.deliveryRadiusKm
  }
}