"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n";
import ShareButton from "./ShareButton";
import TopBar from "./TopBar";

export default function Home() {
  const { t, i18n } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);
  const [showLang, setShowLang] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setShowLang(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden">
      {/* Content Container */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen">
        {/* Top Bar */}
        <TopBar/>

        {/* Centered Content */}
        <div
          className="flex-1 flex flex-col justify-center items-center px-6 text-center h-52"
          style={{
            backgroundImage: "url(/bg.png)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        >
          <p
            className="text-white text-3xl font-bold mb-4 leading-tigh"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.7)" }}
          >
            {t("subtitle")}
          </p>
        </div>

        {/* Get Started Button */}
        <div className="flex justify-center pb-12 pt-12">
          <Link href="/choose" className="">
            <button className="bg-[#5D5D5D] hover:bg-[#5D5D5D]  text-white   rounded-full font-bold text-[18.45px] leading-[100%] tracking-[0%] text-center align-middle font-kameron h-[54px] w-[301.6px]">
              {t("getStarted")}
            </button>
          </Link>
        </div>
        {/* Share Button – fixed at bottom right */}
        {/* Share Button – fixed at bottom right */}
        <ShareButton />
      </div>
    </div>
  );
}
