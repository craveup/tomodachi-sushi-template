"use client"

import React, { createContext, useContext, useReducer, useEffect } from "react"
import { BusinessRules } from "@/lib/config/business-rules"
import { calculateItemPrice, calculateSubtotal } from "@/lib/utils/price"
import type { CartItem, MenuItem, SelectedModifier } from "@/types/restaurant"

interface CartState {
  items: CartItem[]
  isOpen: boolean
  loading: boolean
  error: string | null
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { menuItem: MenuItem; modifiers?: SelectedModifier[]; quantity?: number } }
  | { type: "UPDATE_QUANTITY"; payload: { itemId: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { itemId: string } }
  | { type: "CLEAR_CART" }
  | { type: "SET_OPEN"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "LOAD_CART"; payload: CartItem[] }

interface CartContextType {
  state: CartState
  actions: {
    addItem: (menuItem: MenuItem, modifiers?: SelectedModifier[], quantity?: number) => void
    updateQuantity: (itemId: string, quantity: number) => void
    removeItem: (itemId: string) => void
    clearCart: () => void
    openCart: () => void
    closeCart: () => void
  }
  computed: {
    totalItems: number
    subtotal: number
    tax: number
    total: number
    isEmpty: boolean
    meetsMinimumOrder: boolean
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { menuItem, modifiers = [], quantity = 1 } = action.payload
      
      // Check if item with same modifiers already exists
      const existingItemIndex = state.items.findIndex(item => 
        item.menuItem?.id === menuItem.id &&
        JSON.stringify(item.modifiers) === JSON.stringify(modifiers)
      )
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const newItems = [...state.items]
        const newQuantity = newItems[existingItemIndex].quantity + quantity
        
        if (!BusinessRules.isValidQuantity(newQuantity)) {
          return {
            ...state,
            error: `Maximum quantity per item is exceeded`
          }
        }
        
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newQuantity
        }
        
        return {
          ...state,
          items: newItems,
          error: null
        }
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${menuItem.id}-${Date.now()}`,
          menuItem,
          quantity,
          modifiers,
          subtotal: calculateItemPrice({
            id: '',
            menuItem,
            quantity,
            modifiers
          })
        }
        
        return {
          ...state,
          items: [...state.items, newItem],
          error: null
        }
      }
    }
    
    case "UPDATE_QUANTITY": {
      const { itemId, quantity } = action.payload
      
      if (quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: { itemId } })
      }
      
      if (!BusinessRules.isValidQuantity(quantity)) {
        return {
          ...state,
          error: `Invalid quantity: ${quantity}`
        }
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === itemId
            ? { ...item, quantity, subtotal: calculateItemPrice({ ...item, quantity }) }
            : item
        ),
        error: null
      }
    }
    
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.itemId),
        error: null
      }
    
    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        error: null
      }
    
    case "SET_OPEN":
      return {
        ...state,
        isOpen: action.payload
      }
    
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload
      }
    
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload
      }
    
    case "LOAD_CART":
      return {
        ...state,
        items: action.payload,
        loading: false
      }
    
    default:
      return state
  }
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  loading: false,
  error: null
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('restaurant-cart')
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: items })
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error)
      }
    }
  }, [])
  
  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (state.items.length > 0) {
      localStorage.setItem('restaurant-cart', JSON.stringify(state.items))
    } else {
      localStorage.removeItem('restaurant-cart')
    }
  }, [state.items])
  
  // Computed values
  const computed = React.useMemo(() => {
    const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = calculateSubtotal(state.items)
    const tax = BusinessRules.calculateTax(subtotal)
    const total = BusinessRules.calculateTotal(subtotal)
    
    return {
      totalItems,
      subtotal,
      tax,
      total,
      isEmpty: state.items.length === 0,
      meetsMinimumOrder: BusinessRules.meetsMinimumOrder(subtotal)
    }
  }, [state.items])
  
  const actions = {
    addItem: (menuItem: MenuItem, modifiers?: SelectedModifier[], quantity?: number) => {
      dispatch({ type: "ADD_ITEM", payload: { menuItem, modifiers, quantity } })
    },
    
    updateQuantity: (itemId: string, quantity: number) => {
      dispatch({ type: "UPDATE_QUANTITY", payload: { itemId, quantity } })
    },
    
    removeItem: (itemId: string) => {
      dispatch({ type: "REMOVE_ITEM", payload: { itemId } })
    },
    
    clearCart: () => {
      dispatch({ type: "CLEAR_CART" })
    },
    
    openCart: () => {
      dispatch({ type: "SET_OPEN", payload: true })
    },
    
    closeCart: () => {
      dispatch({ type: "SET_OPEN", payload: false })
    }
  }
  
  return (
    <CartContext.Provider value={{ state, actions, computed }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export default CartProvider