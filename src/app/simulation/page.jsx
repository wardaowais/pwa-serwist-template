"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import TopBar from "../TopBar";
import ShareButton from "../ShareButton";

export default function Simulation() {
  const searchParams = useSearchParams();
  const initialColor = searchParams.get("color") || "000000";
  const initialTime = parseFloat(searchParams.get("time")) || 5.0;
  const { t } = useTranslation();

  const [currentTime, setCurrentTime] = useState(initialTime);
  const [thumbPressed, setThumbPressed] = useState(false);
  const [thumbColor, setThumbColor] = useState(`#${initialColor}`);

  useEffect(() => {
    setThumbColor(`#${initialColor}`);
  }, [initialColor]);

  const handleIncreaseTime = () => {
    setCurrentTime((prevTime) => Math.min(prevTime + 0.1, 10.0));
  };

  const handleDecreaseTime = () => {
    setCurrentTime((prevTime) => Math.max(prevTime - 0.1, 0.1));
  };

  return (
    <div className="flex flex-col justify-between relative overflow-hidden">
      <TopBar />

      <div className="text-center flex justify-center flex-col">
        {/* Thumb Area */}
        <div
          className={`relative w-[109px] h-[190px] mx-auto mb-8 rounded-[69px] flex items-center justify-center transition-all duration-300 ${
            thumbPressed ? "scale-105" : ""
          }`}
          style={{
            backgroundColor: thumbPressed ? thumbColor : "transparent",
            boxShadow: thumbPressed ? `0 0 15px 0 ${thumbColor}` : "none",
          }}
          onMouseDown={() => setThumbPressed(true)}
          onMouseUp={() => setThumbPressed(false)}
          onMouseLeave={() => setThumbPressed(false)}
          onTouchStart={() => setThumbPressed(true)}
          onTouchEnd={() => setThumbPressed(false)}
        >
          <img
            src="/behind.png"
            alt=""
            className="w-[109px] h-[190px] rounded-[69px] opacity-50 select-none pointer-events-none"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />

          <img
            src="/print.png"
            alt="Print Overlay"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
          />
        </div>

        {/* Instruction */}
        <p className="text-xl font-semibold text-gray-700 mb-4">
          {t("simulationPressHold")}
        </p>

        {/* Time Controls */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <button
            onClick={handleIncreaseTime}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full text-2xl"
          >
            +
          </button>
          <span className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg text-xl">
            {currentTime.toFixed(1)} {t("simulationSec")}
          </span>
          <button
            onClick={handleDecreaseTime}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full text-2xl"
          >
            -
          </button>
        </div>

        <p className="text-lg text-gray-600 mb-8">
          {t("simulationAdjustTime")}
        </p>

        {/* Back Button */}
        <Link href="/">
          <button className="bg-[#5D5D5D] hover:bg-[#5D5D5D] text-white rounded-full font-bold text-[18.45px] leading-[100%] tracking-[0%] text-center align-middle font-kameron h-[54px] w-[301.6px]">
            {t("simulationBack")}
          </button>
        </Link>
      </div>
       <ShareButton/>
    </div>
  );
}
