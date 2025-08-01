"use client"

import { useState } from "react"
import { X } from "lucide-react"

// Mock Button component
interface ButtonProps {
  children: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
  onClick?: () => void;
}

function Button({ children, variant = "default", className = "", ...props }: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
  const variants: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600",
    outline: "border border-border bg-background text-foreground hover:bg-muted/50 focus:ring-ring"
  }
  const sizeClasses = "h-10 px-4 py-2"
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// Simple Modal component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground dark:text-gray-100">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

// Mock nutritional data
const nutritionalData = {
  calories: 650,
  protein: 28,
  carbs: 45,
  fat: 38,
  fiber: 4,
  sugar: 8,
  sodium: 1200,
  cholesterol: 85,
  vitamins: [
    { name: "Vitamin A", amount: "15%", daily: true },
    { name: "Vitamin C", amount: "25%", daily: true },
    { name: "Iron", amount: "20%", daily: true },
    { name: "Calcium", amount: "30%", daily: true }
  ],
  allergens: [
    "Contains Gluten",
    "Contains Dairy", 
    "Contains Eggs",
    "May contain Nuts"
  ],
  dietary: [
    "High Protein",
    "Contains Gluten"
  ],
  ingredients: [
    "Beef patty (ground beef, salt, pepper)",
    "Sesame seed bun",
    "Lettuce",
    "Tomato",
    "Onion",
    "Pickles",
    "Special sauce (mayo, ketchup, mustard, relish)",
    "American cheese"
  ]
}

function NutritionalInfoModal() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <Button 
        variant="outline" 
        className="mx-auto block"
        onClick={() => setIsOpen(true)}
      >
        View Nutritional Information
      </Button>
      
      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        title="Nutritional Information - Classic Burger"
      >
        
        <div className="space-y-6">
          {/* Calories */}
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{nutritionalData.calories}</div>
            <div className="text-sm text-muted-foreground dark:text-gray-400">Calories</div>
          </div>

          {/* Macronutrients */}
          <div>
            <h3 className="font-semibold mb-3 text-foreground dark:text-gray-100">Macronutrients</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-between p-3 bg-muted/50 rounded">
                <span className="text-gray-700 dark:text-gray-300">Protein</span>
                <span className="font-medium text-foreground dark:text-gray-100">{nutritionalData.protein}g</span>
              </div>
              <div className="flex justify-between p-3 bg-muted/50 rounded">
                <span className="text-gray-700 dark:text-gray-300">Carbs</span>
                <span className="font-medium text-foreground dark:text-gray-100">{nutritionalData.carbs}g</span>
              </div>
              <div className="flex justify-between p-3 bg-muted/50 rounded">
                <span className="text-gray-700 dark:text-gray-300">Fat</span>
                <span className="font-medium text-foreground dark:text-gray-100">{nutritionalData.fat}g</span>
              </div>
              <div className="flex justify-between p-3 bg-muted/50 rounded">
                <span className="text-gray-700 dark:text-gray-300">Fiber</span>
                <span className="font-medium text-foreground dark:text-gray-100">{nutritionalData.fiber}g</span>
              </div>
            </div>
          </div>

          {/* Additional Nutrients */}
          <div>
            <h3 className="font-semibold mb-3 text-foreground dark:text-gray-100">Additional Nutrients</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Sugar</span>
                <span className="text-foreground dark:text-gray-100">{nutritionalData.sugar}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Sodium</span>
                <span className="text-foreground dark:text-gray-100">{nutritionalData.sodium}mg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Cholesterol</span>
                <span className="text-foreground dark:text-gray-100">{nutritionalData.cholesterol}mg</span>
              </div>
            </div>
          </div>

          {/* Vitamins */}
          <div>
            <h3 className="font-semibold mb-3 text-foreground dark:text-gray-100">Vitamins & Minerals</h3>
            <div className="grid grid-cols-2 gap-2">
              {nutritionalData.vitamins.map((vitamin, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">{vitamin.name}</span>
                  <span className="text-foreground dark:text-gray-100">{vitamin.amount}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-2">*% Daily Value based on 2000 calorie diet</p>
          </div>

          {/* Allergens */}
          <div>
            <h3 className="font-semibold mb-3 text-foreground dark:text-gray-100">Allergens</h3>
            <div className="flex flex-wrap gap-2">
              {nutritionalData.allergens.map((allergen, index) => (
                <span key={index} className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full text-sm">
                  {allergen}
                </span>
              ))}
            </div>
          </div>

          {/* Dietary */}
          <div>
            <h3 className="font-semibold mb-3 text-foreground dark:text-gray-100">Dietary Information</h3>
            <div className="flex flex-wrap gap-2">
              {nutritionalData.dietary.map((diet, index) => (
                <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-sm">
                  {diet}
                </span>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="font-semibold mb-3 text-foreground dark:text-gray-100">Ingredients</h3>
            <div className="text-sm text-muted-foreground dark:text-gray-400 space-y-1">
              {nutritionalData.ingredients.map((ingredient, index) => (
                <div key={index}>• {ingredient}</div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default function NutritionalInfoModalDemo() {
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="text-center space-y-4">
        <div className="p-4 border border-border rounded-lg bg-background">
          <h3 className="font-semibold mb-2 text-foreground dark:text-gray-100">Classic Burger</h3>
          <p className="text-sm text-muted-foreground dark:text-gray-400 mb-4">
            Juicy beef patty with lettuce, tomato, onion, pickles, and our special sauce
          </p>
          <div className="flex justify-center w-full">
            <NutritionalInfoModal />
          </div>
        </div>
      </div>
    </div>
  )
}