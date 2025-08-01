export const siteConfig = {
  name: "Crave.js shadcn/ui Library",
  url: "https://shadcn-online-ordering-kit.vercel.app",
  ogImage: "https://shadcn-online-ordering-kit.vercel.app/og.jpg",
  description:
    "A comprehensive online ordering component kit built on top of shadcn/ui for restaurants and food delivery services.",
  links: {
    github: "https://github.com/shadcn/shadcn-online-ordering-kit",
    docs: "https://shadcn-online-ordering-kit.vercel.app/docs",
  },
  // Example restaurant concept used throughout the demos
  exampleRestaurant: {
    name: "Sakura & Stone",
    tagline: "Japanese • European • Fusion",
    description: "Where Tokyo meets Paris in the heart of New York",
    cuisine: "Japanese-European Fusion",
    location: "Midtown Manhattan, New York",
    priceRange: "$$$",
    phone: "(212) 555-SAKE",
    address: "142 W 57th St, New York, NY 10019",
    note: "This is a fictional restaurant used to demonstrate the UI components"
  },
};

export type SiteConfig = typeof siteConfig;
