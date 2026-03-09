// app/layout.js
// import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "./clientProvider";
import RegisterSW from "@/hooks/RegisterSW";

// const inter = Inter({ subsets: ["latin"] });

// Metadata export (only works in server components)
export const metadata = {
  
  title: "SVH Food - Veg & Non Veg Restaurants",
  description:
    "SVH Food - Veg & Non Veg Restaurants",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: [
    "SVH Food",
    "SVH Food - Veg & Non Veg Restaurants",
  ],
  authors: [{ name: "SVH Food" }],
  icons: [
    { rel: "apple-touch-icon", url: "/svh.png" },
    { rel: "icon", url: "/svh.png" },
  ],
  openGraph: {
    type: "website",
    title: "SVH Food - Veg & Non Veg Restaurants",
    description:
      "SVH Food - Veg & Non Veg Restaurants",
    siteName: "SVH Food",
    url: "https://svhfood.com",
    images: [
      {
        url: "https://svhfood.com/svh.png",
        width: 192,
        height: 192,
        alt: "SVH Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "SVH Food - Veg & Non Veg Restaurants",
    description:
      "SVH Food - Veg & Non Veg Restaurants",
    images: ["https://svhfood.com/svh.png"],
  },
};

// Viewport export (separated from metadata)
export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#000000" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  shrinkToFit: "no",
  viewportFit: "cover",
};

// Client component for providers
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="SVH Food" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SVH Food" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Icons */}
        <link rel="apple-touch-icon" href="/svh.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/svh.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/svh.png" />
        <link
          rel="icon"
          type="image/x-icon"
          sizes="32x32"
          href="/svh.png"
        />
        <link
          rel="icon"
          type="image/x-icon"
          sizes="16x16"
          href="/svh.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/svh.png" color="#5bbad5" />
        <link rel="shortcut icon" href="/svh.png" />
      </head>
      <body>
        <ClientProviders>
          <RegisterSW />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
