"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { DeliveryOption } from "../components/address-flow"

interface Address {
  street: string
  apartment?: string
}

interface AddressContextType {
  deliveryOption: DeliveryOption | null
  address: Address | null
  setDeliveryData: (data: { deliveryOption: DeliveryOption; address?: Address }) => void
  clearAddress: () => void
  getDisplayAddress: () => string
  getDeliveryFee: () => number
  getEstimatedTime: () => string
}

const AddressContext = createContext<AddressContextType | undefined>(undefined)

const defaultDeliveryOption: DeliveryOption = {
  id: "delivery",
  type: "delivery",
  title: "Delivery", 
  description: "Get it delivered to your door",
  icon: null,
  estimatedTime: "25-35 min",
  fee: 2.99,
  isAvailable: true
}

export function AddressProvider({ children }: { children: ReactNode }) {
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption | null>(null)
  const [address, setAddress] = useState<Address | null>(null)

  const setDeliveryData = (data: { deliveryOption: DeliveryOption; address?: Address }) => {
    setDeliveryOption(data.deliveryOption)
    if (data.address) {
      setAddress(data.address)
    } else if (data.deliveryOption.type !== "delivery") {
      // Clear address for pickup/dine-in
      setAddress(null)
    }
  }

  const clearAddress = () => {
    setDeliveryOption(null)
    setAddress(null)
  }

  const getDisplayAddress = () => {
    if (deliveryOption?.type === "delivery" && address) {
      return address.apartment 
        ? `${address.street}, ${address.apartment}`
        : address.street
    }
    
    if (deliveryOption?.type === "pickup") {
      return "Pickup at SoHo location"
    }
    
    if (deliveryOption?.type === "dine-in") {
      return "Dine in at SoHo location"
    }
    
    return "Choose delivery option" // Default fallback
  }

  const getDeliveryFee = () => {
    return deliveryOption?.fee || 0
  }

  const getEstimatedTime = () => {
    return deliveryOption?.estimatedTime || "Select option"
  }

  return (
    <AddressContext.Provider value={{
      deliveryOption,
      address,
      setDeliveryData,
      clearAddress,
      getDisplayAddress,
      getDeliveryFee,
      getEstimatedTime
    }}>
      {children}
    </AddressContext.Provider>
  )
}

export function useAddress() {
  const context = useContext(AddressContext)
  if (context === undefined) {
    throw new Error("useAddress must be used within an AddressProvider")
  }
  return context
}