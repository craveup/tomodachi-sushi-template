// Default values for menu items
export const DEFAULT_MENU_ITEM = {
  HORIZONTAL: {
    name: "Miso Glazed Eggplant",
    description: "Tender Japanese eggplant glazed with sweet miso and topped with crispy shallots.",
    price: 18.00,
    formattedPrice: "$18.00",
    rating: "96%",
    reviewCount: "89",
    imageUrl: "/images/food/miso-eggplant.jpg",
    imageAlt: "Miso Glazed Eggplant",
    badge: "Chef's Choice",
  },
  VERTICAL: {
    name: "Two Chip Chocolate Chip Cookie",
    description: 'Two types of chocolate in one (1) cookie! Not a nut fan? This "Two Chip" Chocolate Chip Cookie may be for you. Decadent and delicious, it\'s crispy on the outside with a satisfyingly thick and gooey center. Every bite is packed with two different types of rich chocolate chips. Please note: this is one cookie (not two, sorry, we know the name can be confusing!).',
    price: 6.33,
    formattedPrice: "$6.33",
    rating: "92%",
    reviewCount: "210",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/generation-8f7e0fd8-bb04-40de-8bea-de47a35d1ad1-oPUlYWoAwi7BUZg7CmQIxxhZLiH5kE.png",
    imageAlt: "Two Chip Chocolate Chip Cookie",
    badge: "#1 Most liked",
  },
  DEMO: {
    name: "Karaage Chicken Katsu Sando",
    description: "Crispy Japanese-style fried chicken thigh glazed with spicy miso-honey sauce, served on buttery brioche with pickled cabbage slaw, kewpie mayo, and shichimi togarashi. Inspired by Nashville heat with Japanese technique.",
    price: 18.00,
    formattedPrice: "$18.00",
    rating: "97%",
    reviewCount: "89",
    imageUrl: "/images/food/karaage-chicken-katsu-sando.jpg",
    imageAlt: "Karaage Chicken Katsu Sando",
    badge: "Chef's Fusion",
  }
}

// Default store/restaurant values
export const DEFAULT_STORE = {
  name: "Default Restaurant",
  rating: 4.5,
  reviewCount: 100,
  deliveryTime: "30-45 min",
  deliveryFee: "$2.99",
  minimumOrder: "$10.00",
}

// Default user values
export const DEFAULT_USER = {
  name: "Guest User",
  email: "guest@example.com",
}

// Default cart values
export const DEFAULT_CART = {
  MAX_ITEMS: 99,
  MIN_ITEMS: 1,
  TAX_RATE: 0.08, // 8% tax rate
}

// Default time slots
export const DEFAULT_TIME_SLOTS = {
  INTERVAL_MINUTES: 15,
  START_HOUR: 11, // 11 AM
  END_HOUR: 21, // 9 PM
  ADVANCE_NOTICE_MINUTES: 30,
}

// Default order values
export const DEFAULT_ORDER = {
  TIP_PERCENTAGES: [15, 18, 20, 25],
  DEFAULT_TIP_PERCENTAGE: 18,
}

// Placeholder images
export const PLACEHOLDER_IMAGES = {
  MENU_ITEM: "/images/food/placeholder-burger.svg",
  RESTAURANT: "/images/food/kaiseki-tasting.jpg",
  USER_AVATAR: "/placeholder.jpg",
}