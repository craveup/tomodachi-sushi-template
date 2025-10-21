import type { Metadata } from "next";
import { Geist, Geist_Mono, Forum, Yuji_Mai } from "next/font/google";

import "./globals.css";
import "./styles/leclerc-fonts.css";

// Providers
import { CartProvider } from "./providers/cart-provider";
import { RestaurantThemeProvider } from "./hooks/use-restaurant-theme";
import { ErrorBoundary } from "./components/error-boundary";
import { CartWrapper } from "./components/cart-wrapper";
import { Toaster } from "@/components/ui/sonner";

// Load Google Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const forum = Forum({
  variable: "--font-forum",
  subsets: ["latin"],
  weight: "400",
});

// Yuji Mai for Japanese text
const yujiMai = Yuji_Mai({
  variable: "--font-yuji-mai",
  subsets: ["latin"],
  weight: "400",
});

// WDXL Lubrifont JP N for Japanese text (using Google Fonts)
// Import via CSS since it's available on Google Fonts
const wdxlLubrifont = {
  variable: "--font-wdxl-jp",
};

// App Metadata
export const metadata: Metadata = {
  title: "Tomodachi Sushi - Authentic Japanese Cuisine",
  description:
    "Experience authentic Japanese sushi and rolls at Tomodachi Sushi. Fresh ingredients, traditional flavors, and a modern dining experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${forum.variable} ${yujiMai.variable} ${wdxlLubrifont.variable} antialiased`}
      >
        <ErrorBoundary>
          <RestaurantThemeProvider defaultThemePath="/themes/leclerc-theme.json">
            <CartProvider>
              {children}
              <CartWrapper />
            </CartProvider>
            <Toaster position="top-center" />
          </RestaurantThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
