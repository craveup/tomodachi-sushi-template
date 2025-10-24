import type { Metadata } from "next";
import { Geist, Geist_Mono, Forum, Yuji_Mai } from "next/font/google";

import "./globals.css";
import { ErrorBoundary } from "./components/error-boundary";
import { Toaster } from "@/components/ui/sonner";

const themeInitScript = `
(() => {
  const storageKey = "tomodachi-theme";
  const root = document.documentElement;
  const apply = (isDark) => {
    root.classList.toggle("dark", isDark);
    root.dataset.theme = isDark ? "dark" : "light";
  };
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored === "dark" || stored === "light") {
      apply(stored === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      apply(prefersDark);
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) => {
      try {
        if (localStorage.getItem(storageKey)) {
          return;
        }
      } catch (error) {
        // ignore storage access errors
      }
      apply(event.matches);
    };
    media.addEventListener("change", handleChange);
  } catch (error) {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    apply(media.matches);
    media.addEventListener("change", (event) => {
      apply(event.matches);
    });
  }
})();
`;

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${forum.variable} ${yujiMai.variable} ${wdxlLubrifont.variable} antialiased`}
      >
        <ErrorBoundary>
          {children}
          <Toaster position="top-center" />
        </ErrorBoundary>
      </body>
    </html>
  );
}
