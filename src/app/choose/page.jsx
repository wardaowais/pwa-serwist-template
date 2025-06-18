"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

export default function Choose() {
  const [selectedColor, setSelectedColor] = useState("#E0F2F7"); // Default light blue
  const [time, setTime] = useState(4.0);
  const { t, i18n } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);
  const [showLang, setShowLang] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setShowLang(false);
  };

  const colors = [
    { name: "Light Green", hex: "#D1EDC2" },
    { name: "Light Peach", hex: "#F7E0D1" },
    { name: "Peach", hex: "#EDC2B0" },
    { name: "Orange", hex: "#D18C61" },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden">
      <div className="relative z-10 flex flex-col justify-between min-h-screen">
        {/* Top Bar */}
      <div className="flex justify-between items-center px-4 pt-12 pb-4">
               <button onClick={() => setShowLang(v => !v)} className="  rounded-full p-2">
                 <Image src="/language.svg" alt="Language" width={28} height={28} />
               </button>
               {showLang && (
                 <div className="absolute left-4 top-20 bg-white rounded-lg shadow-lg p-2 z-20 text-sm min-w-32">
                   <button className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded" onClick={() => changeLanguage('en')}>English</button>
                   <button className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded" onClick={() => changeLanguage('de')}>German</button>
                 </div>
               )}
               <h1 className="text-6xl font-bold text-black" style={{ fontFamily: 'Jersey10, monospace', letterSpacing: '2px' }}>
                 SimCRT
               </h1>
               <button onClick={() => setShowInfo(v => !v)} className=" rounded-full p-2">
                 <Image src="/info.svg" alt="Info" width={28} height={28} />
               </button>
               {showInfo && (
                 <div className="absolute right-4 top-20 bg-white rounded-lg shadow-lg p-4 z-20 w-64 text-gray-800 text-center text-sm">
                   {t('infoText')}
                 </div>
               )}
             </div>

        <div className=" w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-800">{t("title")}</h1>
            <p className="text-md text-gray-600">{t("chooseSubtitle")}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              {t("chooseSkinColor")}
            </h2>
            <div className="flex justify-around">
              {colors.map((color) => (
                <div
                  key={color.hex}
                  className={`w-16 h-16 rounded-full cursor-pointer border-4 ${
                    selectedColor === color.hex
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => setSelectedColor(color.hex)}
                ></div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              {t("chooseTime")}
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-lg font-bold text-gray-800">
                {time.toFixed(1)}
              </span>
              <input
                type="range"
                min="0.1"
                max="10.0"
                step="0.1"
                value={time}
                onChange={(e) => setTime(parseFloat(e.target.value))}
                className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.1</span>
              <span>10.0</span>
            </div>
          </div>

          <Link
            href={`/simulation?color=${selectedColor.substring(
              1
            )}&time=${time}`}
          >
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-full shadow-lg">
              {t("chooseStart")}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
