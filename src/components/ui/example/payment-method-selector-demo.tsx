"use client"

import { useState } from "react"

// Mock PaymentMethodSelector component
interface PaymentMethod {
  id: string;
  type: "card" | "wallet" | "cash";
  name: string;
  details?: string;
}

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  selectedMethod: string;
  onMethodSelect: (methodId: string) => void;
}

function PaymentMethodSelector({ methods, selectedMethod, onMethodSelect }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-medium mb-4">Payment Method</h3>
      {methods.map((method) => (
        <button
          key={method.id}
          onClick={() => onMethodSelect(method.id)}
          className={`w-full p-4 border rounded-lg text-left transition-colors ${
            selectedMethod === method.id 
              ? "border-primary bg-primary/10 dark:bg-primary/5" 
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                {selectedMethod === method.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                )}
              </div>
              <div>
                <div className="font-medium">{method.name}</div>
                {method.details && (
                  <div className="text-sm text-muted-foreground">{method.details}</div>
                )}
              </div>
            </div>
            <div className="text-2xl">
              {method.type === 'card' && '💳'}
              {method.type === 'wallet' && '📱'}
              {method.type === 'cash' && '💵'}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "card-1",
    type: "card",
    name: "Visa •••• 1234",
    details: "Expires 12/25"
  },
  {
    id: "apple-pay",
    type: "wallet",
    name: "Apple Pay",
    details: "Touch ID or Face ID"
  },
  {
    id: "cash",
    type: "cash",
    name: "Cash on Delivery",
    details: "Pay when your order arrives"
  }
]

export default function PaymentMethodSelectorDemo() {
  const [selectedMethod, setSelectedMethod] = useState("card-1")

  return (
    <div className="w-full max-w-md mx-auto">
      <PaymentMethodSelector
        methods={paymentMethods}
        selectedMethod={selectedMethod}
        onMethodSelect={setSelectedMethod}
      />
    </div>
  )
}