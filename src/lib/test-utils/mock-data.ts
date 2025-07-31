import type { MenuItem, CartItem, Restaurant, Order, User } from "@/types/restaurant"

/**
 * Mock data generators for testing restaurant components
 */

export const createMockMenuItem = (overrides: Partial<MenuItem> = {}): MenuItem => ({
  id: "item-1",
  name: "Classic Burger",
  description: "Juicy beef patty with lettuce, tomato, and special sauce",
  price: 12.99,
  rating: 95,
  reviewCount: 42,
  imageUrl: "/images/food/placeholder-burger.svg",
  imageAlt: "Classic Burger",
  badge: "Popular",
  category: "mains",
  available: true,
  ...overrides
})

export const createMockCartItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: "cart-item-1",
  menuItem: createMockMenuItem(),
  quantity: 1,
  modifiers: [],
  subtotal: 12.99,
  ...overrides
})

export const createMockRestaurant = (overrides: Partial<Restaurant> = {}): Restaurant => ({
  id: "restaurant-1",
  name: "Test Restaurant",
  description: "A great place for testing",
  rating: 4.5,
  reviewCount: 156,
  priceRange: "$$",
  cuisineType: ["American"],
  deliveryFee: "2.99",
  minimumOrder: "15.00",
  estimatedDeliveryTime: "25-35 min",
  address: {
    street: "123 Test St",
    city: "Test City",
    state: "TS",
    zipCode: "12345"
  },
  ...overrides
})

export const createMockOrder = (overrides: Partial<Order> = {}): Order => ({
  id: "order-1",
  restaurantId: "restaurant-1",
  items: [createMockCartItem()],
  subtotal: 12.99,
  tax: 1.14,
  deliveryFee: 2.99,
  total: 17.12,
  orderType: "delivery",
  status: "pending",
  placedAt: new Date(),
  ...overrides
})

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: "user-1",
  name: "Test User",
  email: "test@example.com",
  phone: "+1234567890",
  addresses: [
    {
      street: "456 User St",
      city: "User City",
      state: "US",
      zipCode: "67890"
    }
  ],
  ...overrides
})

/**
 * Generate arrays of mock data
 */
export const createMockMenuItems = (count: number): MenuItem[] =>
  Array.from({ length: count }, (_, i) =>
    createMockMenuItem({
      id: `item-${i + 1}`,
      name: `Test Item ${i + 1}`,
      price: 10 + (i * 2.5)
    })
  )

export const createMockCartItems = (count: number): CartItem[] =>
  Array.from({ length: count }, (_, i) =>
    createMockCartItem({
      id: `cart-item-${i + 1}`,
      menuItem: createMockMenuItem({
        id: `item-${i + 1}`,
        name: `Test Item ${i + 1}`
      })
    })
  )