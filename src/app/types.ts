export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string | null
  category: "signature" | "seasonal" | "limited" | "cookies" | "pastries" | "breads"
  calories: number
  isNew?: boolean
  isPopular?: boolean
  isGlutenFree?: boolean
}

export interface ItemOptions {
  warming: "room-temp" | "warmed"
  packaging: "standard" | "gift"
  giftBox: boolean
}

export interface CartItem extends MenuItem {
  cartId: string
  quantity: number
  options: ItemOptions
}

export interface DeliveryData {
  type: "delivery" | "pickup" | "dine-in"
  address?: {
    street: string
    apt?: string
    city: string
    state: string
    zip: string
  }
  instructions?: string
  time?: string
}