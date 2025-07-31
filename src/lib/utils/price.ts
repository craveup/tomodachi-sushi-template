import { formatCurrency } from "@/lib/i18n/formatters"
import { getBusinessConfig } from "@/lib/config/business-rules"
import type { CartItem, SelectedModifier } from "@/types/restaurant"

/**
 * Format price using business configuration
 */
export function formatPrice(amount: string | number): string {
  const config = getBusinessConfig()
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount
  return formatCurrency(numAmount, config.pricing.locale)
}

/**
 * Calculate total price for a cart item including modifiers
 */
export function calculateItemPrice(item: CartItem): number {
  const basePrice = Number(item.price || item.menuItem?.price || 0)
  const modifiersTotal = item.modifiers?.reduce((sum, mod) => {
    return sum + Number(mod.price || 0)
  }, 0) || 0
  
  return (basePrice + modifiersTotal) * item.quantity
}

/**
 * Calculate subtotal for an array of cart items
 */
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + calculateItemPrice(item), 0)
}

/**
 * Parse a price string to number (handles "$12.99" format)
 */
export function parsePrice(priceStr: string): number {
  if (typeof priceStr === "number") return priceStr
  
  // Remove currency symbols and parse
  const cleaned = priceStr.replace(/[^0-9.-]/g, "")
  return parseFloat(cleaned) || 0
}