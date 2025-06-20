// components/ShareButton.tsx
"use client";

import Image from "next/image";

const ShareButton = () => {
  const handleShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        const shareData = {
          title: "SimCRT App",
          text: "Check out this Capillary Refill Time Trainer app!",
          url: "https://simcrt.vercel.app",
        };

        await navigator.share(shareData); // ✅ real share call
      } catch (error) {
        console.error("Sharing failed:", error);
      }
    } else {
      alert("Sharing not supported on this device. Please copy the link manually.");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-500 text-white p-4 rounded-full shadow-lg z-50 transition duration-200"
    >
      <Image src="/share.svg" alt="Share" width={24} height={24} 
  className="invert"/>
    </button>
  );
};

export default ShareButton;
