// Shared style constants for consistent UI design

// Menu Item Card Styles
export const MENU_ITEM_CARD_STYLES = {
  VERTICAL: {
    container: "overflow-hidden hover:shadow-lg transition-shadow duration-200 max-w-sm shadow-2xs",
    button: "w-full h-auto p-0 text-left hover:bg-transparent focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    imageContainer: "relative w-full h-60",
    image: "object-cover w-full h-full",
    addToCartButton: "h-10 w-10 bg-white hover:bg-gray-50 shadow-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    contentContainer: "p-4 space-y-3",
    title: "font-semibold text-lg leading-tight text-gray-900",
    badge: "rounded-full border-transparent bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-200 hover:bg-orange-100 dark:hover:bg-orange-900",
    description: "text-sm text-gray-600 leading-relaxed line-clamp-4",
    price: "font-semibold text-gray-900",
    rating: "flex items-center gap-1 text-gray-600",
  },
  HORIZONTAL: {
    button: "w-full h-auto p-0 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden",
    container: "flex w-full p-4 gap-4",
    contentSection: "flex-1 space-y-3 min-w-0",
    title: "font-semibold text-lg leading-tight text-gray-900 text-left",
    badge: "rounded-full border-transparent bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-200 hover:bg-orange-100 dark:hover:bg-orange-900",
    description: "text-sm text-gray-600 leading-relaxed text-left line-clamp-2",
    price: "font-semibold text-gray-900",
    rating: "flex items-center gap-1 text-gray-600",
    imageSection: "flex-shrink-0",
    imageContainer: "w-20 h-20 rounded-lg overflow-hidden bg-muted border",
    image: "w-full h-full object-cover",
  }
}

// Menu Styles (for backward compatibility)
export const MENU_STYLES = {
  BADGE: "rounded-full p-2 border-transparent bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-200 hover:bg-orange-100 dark:hover:bg-orange-900"
}

// Cart Styles
export const CART_STYLES = {
  SIDEBAR: {
    container: "fixed right-0 top-0 h-full w-[430px] bg-white shadow-xl z-50 flex flex-col",
    header: "flex-shrink-0 border-b p-6",
    content: "flex-1 overflow-y-auto",
    footer: "flex-shrink-0 border-t bg-white",
  }
}

// Button Styles
export const BUTTON_STYLES = {
  PRIMARY: "bg-primary text-primary-foreground hover:bg-primary/90",
  SECONDARY: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  GHOST: "hover:bg-accent hover:text-accent-foreground",
  OUTLINE: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
}

// Text Colors
export const TEXT_COLORS = {
  PRIMARY: "text-gray-900",
  SECONDARY: "text-gray-600",
  MUTED: "text-gray-400",
  ERROR: "text-red-600",
  SUCCESS: "text-green-600",
}

// Border Styles
export const BORDER_STYLES = {
  DEFAULT: "border border-gray-200 dark:border-gray-800",
  FOCUS: "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
}

// Shadow Styles
export const SHADOW_STYLES = {
  SM: "shadow-sm",
  DEFAULT: "shadow",
  MD: "shadow-md",
  LG: "shadow-lg",
  XL: "shadow-xl",
  "2XS": "shadow-2xs",
}

// Spacing
export const SPACING = {
  CONTAINER: {
    PADDING: {
      SM: "p-2",
      MD: "p-4",
      LG: "p-6",
      XL: "p-8",
    },
    GAP: {
      SM: "gap-2",
      MD: "gap-4",
      LG: "gap-6",
      XL: "gap-8",
    }
  }
}

// Animation
export const ANIMATION = {
  TRANSITION: {
    DEFAULT: "transition-all duration-200",
    SLOW: "transition-all duration-300",
    FAST: "transition-all duration-150",
  }
}