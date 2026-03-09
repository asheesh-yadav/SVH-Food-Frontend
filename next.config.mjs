import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV === "production";

const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  clientsClaim: true, 
  disable: isDev, 

  buildExcludes: [
    /middleware-manifest\.json$/,
    /middleware-build-manifest\.json$/,
  ],

  fallbacks: {
    document: "/offline.html",
  },

  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts",
        expiration: { maxEntries: 4, maxAgeSeconds: 31536000 },
      },
    },

    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts-static",
        expiration: { maxEntries: 4, maxAgeSeconds: 31536000 },
      },
    },

    {
      urlPattern: /\.(?:jpg|jpeg|png|gif|svg|ico|webp)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "images",
        expiration: { maxEntries: 64, maxAgeSeconds: 86400 },
      },
    },

    {
      urlPattern: /\/_next\/image\?url=.+$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "next-images",
        expiration: { maxEntries: 64, maxAgeSeconds: 86400 },
      },
    },

    {
      urlPattern: /\.(?:js|css)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-assets",
        expiration: { maxEntries: 64, maxAgeSeconds: 86400 },
      },
    },

    {
      urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "next-data",
        expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
      },
    },

    {
      urlPattern: ({ url }) => {
        const sameOrigin = self.location.origin === url.origin;
        if (!sameOrigin) return false;

        return (
          !url.pathname.startsWith("/api/auth") &&
          !url.pathname.startsWith("/api/db-connect")
        );
      },
      handler: "NetworkFirst",
      options: {
        cacheName: "pages",
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
      },
    },
  ],
});

const nextConfig = {


  turbopack: {}, 

  reactStrictMode: false,
  trailingSlash: false,

  // ✅ Only enable Turbopack in development (when PWA is disabled)
  ...(isDev && { turbopack: {} }),
  

  experimental: {
    serverActions: {
      allowedOrigins: ["*.devtunnels.ms", "localhost:3000"],
    },
  },

  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },

  async rewrites() {
    return [{ source: "/sitemap.xml", destination: "/api/sitemap" }];
  },

  compiler: {
    removeConsole: false,
  },
};

// ✅ Apply PWA config (it will be no-op in development)
export default pwaConfig(nextConfig);