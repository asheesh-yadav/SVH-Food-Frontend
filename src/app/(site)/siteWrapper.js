// app/(site)/components/SiteWrapper.js
"use client";

import React from "react";

import { useCrisp } from "@/hooks/CrispIntergration";
import "@/app/globals.css";
import { Header } from "@/components/header";
import Footer from "@/mini components/footer";
 function SiteWrapper({ children }) {

  // Crisp integration
  useCrisp();

  return (
    <div className="min-h-screen  flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default SiteWrapper;