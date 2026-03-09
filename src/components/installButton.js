"use client";

import { useEffect, useState } from "react";
import { Check, Download } from "lucide-react";

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      console.log("PWA was installed");
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Check if the app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // The PWA installation API is not available
      // You can show a message or redirect to the manual installation instructions
      //   alert("To install the app, use the browser's 'Add to Home Screen' option in the menu.");
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }
  };

  if (isInstalled) {
    return (
      <>
      </>
      // <button
      //   disabled
      //   className="bg-blue-950 cursor-pointer text-sm text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
      // >
      //   App <Check className="text-green-600 font-bold" size={18} />
      // </button>
    );
  }

  return (
    <button
      onClick={handleInstallClick}
      className="bg-blue-950 cursor-pointer font-semibold text-sm text-white  py-[6px] px-3 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
    >
      <Download size={14} />
       App
    </button>
  );
};

export default InstallButton;
