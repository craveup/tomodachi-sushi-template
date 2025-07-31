// Cart persistence in localStorage
export const CART_STORAGE_KEY = 'crave_cart_data';

export interface StoredCartData {
  cartId: string;
  locationId: string;
  timestamp: number;
}

export const getStoredCart = (): StoredCartData | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    // Check if cart data is less than 24 hours old
    const isExpired = Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000;
    
    if (isExpired) {
      localStorage.removeItem(CART_STORAGE_KEY);
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return null;
  }
};

export const storeCart = (cartId: string, locationId: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const cartData: StoredCartData = {
      cartId,
      locationId,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
  } catch (error) {
    console.error('Error storing cart in localStorage:', error);
  }
};

export const clearStoredCart = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing cart from localStorage:', error);
  }
};

// Auth token storage
export const AUTH_TOKEN_KEY = 'auth_token';

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error reading auth token from localStorage:', error);
    return null;
  }
};

export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error storing auth token in localStorage:', error);
  }
};

export const clearAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error clearing auth token from localStorage:', error);
  }
};