// hooks/useCrisp.js
"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Alternative simpler approach - add this after the existing hook
export function useCrisp() {
    const pathname = usePathname();
  
    useEffect(() => {
      const excludedRoutes = ['/user', '/helpdesk'];
      const shouldShowCrisp = !excludedRoutes.some(route => pathname.startsWith(route));
  
      if (typeof window === 'undefined') return;
  
      if (shouldShowCrisp) {
        // Always ensure Crisp is initialized and visible
        if (!window.CRISP_LOADED) {
          // First time initialization
          window.$crisp = [];
          window.CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
          
          const script = document.createElement("script");
          script.src = "https://client.crisp.chat/l.js";
          script.async = true;
          script.onload = () => {
            window.CRISP_LOADED = true;
            window.$crisp.push(["do", "chat:show"]);
          };
          document.head.appendChild(script);
        } else {
          // Crisp is loaded, just show it
          window.$crisp.push(["do", "chat:show"]);
        }
      } else {
        // Hide Crisp but don't remove it completely
        if (window.$crisp && window.CRISP_LOADED) {
          window.$crisp.push(["do", "chat:hide"]);
        }
      }
    }, [pathname]);
  }