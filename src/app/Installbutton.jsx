"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } else {
      alert(
        "🔔 Already Installed."
      );
    }
  };

  return (
    <button
      onClick={handleInstall}
      className="fixed bottom-6 left-6 bg-white hover:bg-gray-100 p-3 rounded-full shadow-md transition z-50"
      title="Install App"
    >
      <Image src="/installicon.png" alt="Install" width={28} height={28} />
    </button>
  );
}
