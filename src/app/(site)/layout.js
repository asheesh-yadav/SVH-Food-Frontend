// app/(site)/layout.js

import Script from "next/script";
import SiteWrapper from "./siteWrapper";
import "@/app/globals.css";

const Adskey = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
// ✅ Google AdSense + SEO metadata (server-rendered, visible to crawler)
export const metadata = {
  title: "SVH Food - Veg & Non Veg Restaurants",
  description: "SVH Food - Veg & Non Veg Restaurants",
  other: {
    // AdSense verification
    "google-adsense-account": Adskey,

    // (optional) Add your Google site verification if you have it
    // "google-site-verification": "your_verification_code_here",
  },
};

export default function SiteLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-startup-image"
          href="/icons/svh-750-1334.jpg"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
        />

        <link
          rel="apple-touch-startup-image"
          href="/icons/svh-828-1792.jpg"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"
        />

        <link
          rel="apple-touch-startup-image"
          href="/icons/svh-1125-2436.jpg"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
        />

        <link
          rel="apple-touch-startup-image"
          href="/icons/svh-1170-2532.jpg"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
        />

        <link
          rel="apple-touch-startup-image"
          href="/icons/svh-1284-2778.jpg"
          media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)"
        />

        <link
          rel="apple-touch-startup-image"
          href="/icons/svh-1536-2048.jpg"
          media="(device-width: 768px) and (device-height: 1024px)"
        />

        <link
          rel="apple-touch-startup-image"
          href="/icons/svh-1668-2388.jpg"
          media="(device-width: 834px) and (device-height: 1194px)"
        />

        <link
          rel="apple-touch-startup-image"
          href="/icons/svh-2048-2732.jpg"
          media="(device-width: 1024px) and (device-height: 1366px)"
        />
        {/* ✅ Google AdSense global script */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${Adskey}`}
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {/* ✅ Wraps your client logic (Redux, Crisp, Auth check, etc.) */}
        <SiteWrapper>{children}</SiteWrapper>
      </body>
    </html>
  );
}
