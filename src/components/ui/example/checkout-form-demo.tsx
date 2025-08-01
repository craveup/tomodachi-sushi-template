"use client"

import { useState } from "react"
import { Check, CreditCard, MapPin, Phone, Mail, User, Clock, Truck, TagIcon, X, Loader } from "lucide-react"

// Mock components
interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm";
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

function Button({ children, className = "", variant = "default", size = "default", ...props }: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
  const variants: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-border bg-background text-foreground hover:bg-muted/50 focus:ring-ring",
    ghost: "hover:bg-gray-100 focus:ring-gray-500"
  }
  const sizes: Record<string, string> = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-xs"
  }
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

function Input({ className = "", ...props }: InputProps) {
  return (
    <input 
      className={`flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  className?: string;
}

function Label({ children, className = "", ...props }: LabelProps) {
  return (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>
      {children}
    </label>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
  className?: string;
}

function Select({ children, className = "", ...props }: SelectProps) {
  return (
    <select 
      className={`flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea 
      className={`flex min-h-[60px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

const mockOrderItems = [
  {
    id: "1",
    name: "Margherita Pizza",
    quantity: 1,
    price: 16.99,
    modifiers: ["Extra Cheese", "Thin Crust"]
  },
  {
    id: "2",
    name: "Caesar Salad",
    quantity: 1,
    price: 9.99
  }
]

const mockTotals = {
  subtotal: 26.98,
  tax: 2.43,
  deliveryFee: 3.99,
  discount: 0,
  total: 33.40
}

export default function CheckoutFormDemo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [orderType, setOrderType] = useState("delivery")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [appliedPromoCode, setAppliedPromoCode] = useState<{
    id: string;
    code: string;
    type: "percentage" | "free-shipping";
    value: number;
    description: string;
    discount: number;
  } | null>(null)
  const [promoCode, setPromoCode] = useState("")
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const [promoError, setPromoError] = useState("")
  
  const steps = [
    { id: "contact", title: "Contact", icon: User },
    { id: "delivery", title: "Delivery", icon: Truck },
    { id: "payment", title: "Payment", icon: CreditCard }
  ]

  interface StepIndicatorProps {
    step: { id: string; title: string; icon: React.ComponentType<{ className?: string }> };
    index: number;
    currentStep: number;
  }

  const StepIndicator = ({ step, index, currentStep }: StepIndicatorProps) => {
    const Icon = step.icon
    const isActive = index === currentStep
    const isCompleted = index < currentStep
    
    return (
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
          isCompleted 
            ? 'bg-green-500 border-green-500 text-white' 
            : isActive 
              ? 'border-blue-500 bg-blue-500 text-white' 
              : 'border-gray-300 text-gray-400'
        }`}>
          {isCompleted ? (
            <Check className="w-4 h-4" />
          ) : (
            <Icon className="w-4 h-4" />
          )}
        </div>
        <span className={`ml-2 text-sm font-medium ${
          isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
        }`}>
          {step.title}
        </span>
      </div>
    )
  }

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!promoCode.trim() || isApplyingPromo) return

    setIsApplyingPromo(true)
    setPromoError("")

    // Simulate API call
    setTimeout(() => {
      if (promoCode.toUpperCase() === "SAVE10") {
        setAppliedPromoCode({
          id: "promo_1",
          code: "SAVE10",
          type: "percentage",
          value: 0.1,
          description: "10% off your order",
          discount: 2.70
        })
        setPromoCode("")
      } else if (promoCode.toUpperCase() === "FREESHIP") {
        setAppliedPromoCode({
          id: "promo_2",
          code: "FREESHIP",
          type: "free-shipping",
          value: 0,
          description: "Free delivery",
          discount: 3.99
        })
        setPromoCode("")
      } else {
        setPromoError("Invalid promo code")
      }
      setIsApplyingPromo(false)
    }, 1000)
  }

  const handleRemovePromo = () => {
    setAppliedPromoCode(null)
    setPromoCode("")
    setPromoError("")
  }

  const calculateTotal = () => {
    const discount = appliedPromoCode ? appliedPromoCode.discount : 0
    return (mockTotals.subtotal + mockTotals.tax + mockTotals.deliveryFee - discount).toFixed(2)
  }

  const OrderSummary = () => (
    <div className="bg-muted/50 rounded-lg p-4">
      <h3 className="font-semibold mb-3">Order Summary</h3>
      <div className="space-y-2">
        {mockOrderItems.map(item => (
          <div key={item.id} className="flex justify-between text-sm">
            <div>
              <div className="font-medium">{item.name}</div>
              {item.modifiers && (
                <div className="text-muted-foreground text-xs">
                  {item.modifiers.join(", ")}
                </div>
              )}
            </div>
            <div>${item.price.toFixed(2)}</div>
          </div>
        ))}
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${mockTotals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${mockTotals.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery Fee</span>
            <span>${mockTotals.deliveryFee.toFixed(2)}</span>
          </div>
          {appliedPromoCode && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Promo Code ({appliedPromoCode.code})</span>
              <span>-${appliedPromoCode.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
            <span>Total</span>
            <span>${calculateTotal()}</span>
          </div>
        </div>

        {/* Promo Code Input */}
        <div className="border-t pt-4 mt-4">
          {appliedPromoCode ? (
            <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 p-3">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-green-900 dark:text-green-100">
                      {appliedPromoCode.code}
                    </span>
                    <span className="text-sm text-green-700 dark:text-green-300">
                      -${appliedPromoCode.discount.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    {appliedPromoCode.description}
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={handleRemovePromo}
                className="h-8 w-8 p-0 text-green-700 hover:bg-green-100 hover:text-green-900 dark:text-green-300 dark:hover:bg-green-900 dark:hover:text-green-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <div className="relative">
                <TagIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  value={promoCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPromoCode(e.target.value)
                    setPromoError("")
                  }}
                  placeholder="Enter promo code"
                  className="pl-10 pr-20"
                  disabled={isApplyingPromo}
                />
                <div className="absolute right-1 top-1">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!promoCode.trim() || isApplyingPromo}
                    className="h-8 px-3"
                  >
                    {isApplyingPromo ? (
                      <Loader className="h-3 w-3 animate-spin" />
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>
              </div>
              {promoError && (
                <div className="text-sm text-red-600">
                  {promoError}
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                Try: SAVE10 or FREESHIP
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )

  const ContactStep = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Contact Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" placeholder="John" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" placeholder="Doe" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input id="email" className="pl-10" placeholder="john@example.com" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input id="phone" className="pl-10" placeholder="(555) 123-4567" />
        </div>
      </div>
    </div>
  )

  const DeliveryStep = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Delivery Information</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setOrderType("delivery")}
          className={`p-4 border rounded-lg text-left transition-colors ${
            orderType === "delivery" 
              ? "border-primary bg-primary/10 dark:bg-primary/5 text-primary" 
              : "border-border hover:border-primary/50"
          }`}
        >
          <Truck className="h-5 w-5 mb-2" />
          <div className="font-medium">Delivery</div>
          <div className="text-sm text-muted-foreground">25-35 min • $3.99</div>
        </button>
        
        <button
          onClick={() => setOrderType("pickup")}
          className={`p-4 border rounded-lg text-left transition-colors ${
            orderType === "pickup" 
              ? "border-primary bg-primary/10 dark:bg-primary/5 text-primary" 
              : "border-border hover:border-primary/50"
          }`}
        >
          <MapPin className="h-5 w-5 mb-2" />
          <div className="font-medium">Pickup</div>
          <div className="text-sm text-muted-foreground">15-20 min • Free</div>
        </button>
      </div>

      {orderType === "delivery" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Input id="address" placeholder="123 Main Street" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="San Francisco" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input id="zipCode" placeholder="94102" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
            <Textarea id="instructions" placeholder="Ring doorbell, leave at door, etc." />
          </div>
        </div>
      )}

      {orderType === "pickup" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pickupTime">Pickup Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Select id="pickupTime" className="pl-10">
                <option>ASAP (15-20 min)</option>
                <option>6:00 PM</option>
                <option>6:30 PM</option>
                <option>7:00 PM</option>
                <option>7:30 PM</option>
              </Select>
            </div>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="font-medium">Pickup Location</div>
            <div className="text-sm text-muted-foreground">
              Downtown Pizza Co.<br />
              123 Market Street<br />
              San Francisco, CA 94102
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const PaymentStep = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Payment Information</h2>
      
      <div className="space-y-3">
        <button
          onClick={() => setPaymentMethod("card")}
          className={`w-full p-4 border rounded-lg text-left transition-colors ${
            paymentMethod === "card" 
              ? "border-primary bg-primary/10 dark:bg-primary/5" 
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5" />
              <div>
                <div className="font-medium">Credit/Debit Card</div>
                <div className="text-sm text-muted-foreground">Visa, MasterCard, American Express</div>
              </div>
            </div>
            <div className="text-2xl">💳</div>
          </div>
        </button>
        
        <button
          onClick={() => setPaymentMethod("cash")}
          className={`w-full p-4 border rounded-lg text-left transition-colors ${
            paymentMethod === "cash" 
              ? "border-blue-500 bg-blue-50" 
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 flex items-center justify-center">💵</div>
              <div>
                <div className="font-medium">Cash on {orderType === "delivery" ? "Delivery" : "Pickup"}</div>
                <div className="text-sm text-muted-foreground">Pay when you receive your order</div>
              </div>
            </div>
          </div>
        </button>
      </div>

      {paymentMethod === "card" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input id="expiry" placeholder="MM/YY" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input id="cvv" placeholder="123" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cardName">Name on Card</Label>
            <Input id="cardName" placeholder="John Doe" />
          </div>
        </div>
      )}
    </div>
  )

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ContactStep />
      case 1:
        return <DeliveryStep />
      case 2:
        return <PaymentStep />
      default:
        return <ContactStep />
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <StepIndicator
                key={step.id}
                step={step}
                index={index}
                currentStep={currentStep}
              />
            ))}
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={() => console.log("Order placed!")}
                className="bg-green-600 hover:bg-green-700"
              >
                Place Order
              </Button>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  )
}