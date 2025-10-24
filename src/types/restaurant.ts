export interface MenuItem {
  id?: string
  name: string
  description?: string
  price: number
  formattedPrice?: string // For display purposes
  rating?: string | number
  reviewCount?: string | number
  imageUrl?: string
  imageAlt?: string
  badge?: string
  category?: string
  modifiers?: MenuModifier[]
  nutritionalInfo?: NutritionalInfo
  available?: boolean
}

export interface MenuModifier {
  id: string
  name: string
  description?: string
  price?: string
  required?: boolean
  minSelect?: number
  maxSelect?: number
  options: ModifierOption[]
}

export interface ModifierGroup extends MenuModifier {
  // Alias for MenuModifier to maintain compatibility
}

export interface ModifierOption {
  id: string
  name: string
  price?: number
  formattedPrice?: string // For display purposes
  default?: boolean
  isDefault?: boolean
  description?: string
  available?: boolean
}

export interface NutritionalInfo {
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
  sugar?: number
  sodium?: number
}

export interface Restaurant {
  id: string
  name: string
  description?: string
  logo?: string
  coverImage?: string
  rating?: number
  reviewCount?: number
  priceRange?: string
  cuisineType?: string[]
  address?: Address
  hours?: BusinessHours
  deliveryFee?: string
  minimumOrder?: string
  estimatedDeliveryTime?: string
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

export interface BusinessHours {
  [key: string]: {
    open: string
    close: string
    isOpen?: boolean
  }
}

export interface CartItem {
  id: string
  menuItem?: MenuItem
  name?: string
  price?: number
  image?: string
  quantity: number
  modifiers?: SelectedModifier[]
  notes?: string
  specialInstructions?: string
  subtotal?: number
}

export interface SelectedModifier {
  id?: string
  modifierId?: string
  optionId?: string
  name: string
  price?: string | number
}

export interface Order {
  id: string
  restaurantId: string
  userId?: string
  items: CartItem[]
  subtotal: number
  tax: number
  deliveryFee: number
  tip?: number
  total: number
  deliveryAddress?: Address
  orderType: 'delivery' | 'pickup'
  status: OrderStatus
  estimatedDeliveryTime?: Date
  placedAt: Date
  completedAt?: Date
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

export interface User {
  id: string
  name: string
  email?: string
  phone?: string
  addresses?: Address[]
  paymentMethods?: PaymentMethod[]
  orderHistory?: Order[]
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay'
  last4?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault?: boolean
}