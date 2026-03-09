// src/components/ClientProviders.js
"use client";

import React from "react";;
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";
import { ReduxProvider } from "@/lib/reduxProvider";

function ClientProviders({ children }) {
  return (
    <ReduxProvider>
      <Toaster richColors position="bottom-right" />
      {children}
      <Analytics />
    </ReduxProvider>
  );
}

export default ClientProviders;
