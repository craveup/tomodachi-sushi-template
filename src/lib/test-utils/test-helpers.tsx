import React from "react"
import { render, RenderOptions } from "@testing-library/react"
import { CartProvider } from "@/lib/contexts/cart-context"

/**
 * Test utilities for React components
 */

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  )
}

export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

/**
 * Mock functions for common component props
 */
// Simple mock function for testing
const mockFn = () => {};

export const mockHandlers = {
  onClick: mockFn,
  onAddToCart: mockFn,
  onChange: mockFn,
  onSubmit: mockFn,
  onClose: mockFn,
  onUpdateQuantity: mockFn,
  onRemoveItem: mockFn,
  onClearCart: mockFn,
  onCheckout: mockFn
}

/**
 * Reset all mock handlers
 */
export const resetMockHandlers = () => {
  // No-op for basic mock functions
}

/**
 * Helper to wait for async operations in tests
 */
export const waitFor = (ms: number) => 
  new Promise(resolve => setTimeout(resolve, ms))

/**
 * Common test scenarios
 */
export const testScenarios = {
  // Test accessibility
  checkAccessibility: async (component: React.ReactElement) => {
    const { container } = renderWithProviders(component)
    // Add axe-core testing here if needed
    return container
  },
  
  // Test responsive behavior
  checkResponsive: (component: React.ReactElement) => {
    // Mock different viewport sizes
    const viewports = [
      { width: 320, height: 568 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1920, height: 1080 } // Desktop
    ]
    
    return viewports.map(viewport => {
      // Set viewport size
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: viewport.width,
      })
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: viewport.height,
      })
      
      return renderWithProviders(component)
    })
  }
}

// Re-export everything from testing-library
export * from "@testing-library/react"
export { default as userEvent } from "@testing-library/user-event"