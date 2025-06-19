"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
export default function TopBar() {
  const { t, i18n } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);
  const [showLang, setShowLang] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setShowLang(false);
  };

  return (
    <div className="flex justify-between items-center px-4 pt-12 pb-4 relative">
          {/* Language Selector */}
          <button
            onClick={() => setShowLang((v) => !v)}
            className="rounded-full p-2"
          >
            <Image src="/language.svg" alt="Language" width={28} height={28} />
          </button>

          {/* Language Dropdown */}
          {showLang && (
            <div className="absolute left-4 top-[100px]  border-gray-400 border-[1px] bg-white rounded-lg shadow-lg p-2 z-20 text-sm min-w-32">
              <button
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                onClick={() => changeLanguage("en")}
              >
                English
              </button>
              <button
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                onClick={() => changeLanguage("de")}
              >
                German
              </button>
            </div>
          )}

          {/* SimCRT Logo (clickable to go home) */}
          <Link href="/">
            <h1
              className="text-6xl font-bold text-black cursor-pointer"
              style={{
                fontFamily: "Jersey10, monospace",
                letterSpacing: "2px",
              }}
            >
              SimCRT
            </h1>
          </Link>

          {/* Info Button */}
          <button
            onClick={() => setShowInfo((v) => !v)}
            className="rounded-full p-2"
          >
            <Image src="/info.svg" alt="Info" width={28} height={28} />
          </button>

          {/* Info Popup */}
          {showInfo && (
            <div className="absolute right-4 top-[100px] border-gray-400 border-[1px]  bg-white rounded-lg shadow-lg p-4 z-20 w-64 text-gray-800 text-center text-sm">
              {t("infoText")}
            </div>
          )}
        </div>
  );
}
