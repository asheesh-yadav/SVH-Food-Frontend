import React from "react";
import HomeClient from "./homeClent";

export const metadata = {
  metadataBase: new URL("https://svhfood.com"),

  title: {
    default: "SVH Food - Veg & Non Veg Restaurants",
    template: "%s | SVH Food",
  },

  description:
    "SVH Food - Veg & Non Veg Restaurants",

  keywords: [
    "SVH Food",
    "SVH Food - Veg & Non Veg Restaurants",
  ],

  authors: [{ name: "SVH Team" }],
  creator: "SVH",
  publisher: "SVH",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: "SVH Food - Veg & Non Veg Restaurants",
    description:
      "SVH Food - Veg & Non Veg Restaurants",
    url: "https://svhfood.com",
    siteName: "Svh",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Svh Website Builder",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "SVH Food - Veg & Non Veg Restaurants",
    description:
      "Create a stunning website instantly. No coding required.",
    images: ["/og-image.jpg"],
    creator: "@svh",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  category: "technology",

  themeColor: "#102252",

  verification: {
    google: "your-google-site-verification-code",
  },
};

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Svh",
    url: "https://svhfood.com",
    description:
      "Build your website in minutes. No coding required.",
    publisher: {
      "@type": "Organization",
      name: "Svh",
      url: "https://svhfood.com",
      logo: {
        "@type": "ImageObject",
        url: "https://svhfood.com/svh.png",
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://svhfood.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <HomeClient />
    </>
  );
}