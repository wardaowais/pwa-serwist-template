"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import TopBar from "../TopBar";

export default function Choose() {
  const [selectedColor, setSelectedColor] = useState("#E0F2F7"); // Default light blue
  const [time, setTime] = useState(4.0);
  const { t, i18n } = useTranslation();

  const colors = [
    { name: "Light Green", hex: "#D1EDC2" },
    { name: "Light Peach", hex: "#F7E0D1" },
    { name: "Peach", hex: "#EDC2B0" },
    { name: "Orange", hex: "#D18C61" },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <TopBar />

      <div className="w-full max-w-md  flex justify-center  flex-col mx-auto  p-6">
        <div className="text-center mb-6">
          <p className="text-md text-gray-600">{t("chooseSubtitle")}</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3 text-center">
              {t("chooseSkinColor")}
            </h2>
            <div className="flex justify-around gap-3">
              {colors.map((color) => (
                <div
                  key={color.hex}
                  className={`p-[3px] rounded-full border-1  ${
                    selectedColor === color.hex
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedColor(color.hex)}
                >
                  <div
                    className="w-16 h-16 rounded-full"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 text-center top-438px">
              {t("chooseTime")}
            </h2>

            {/* Time + Slider Wrapper */}
            <div className="relative w-[323px] h-[80px]">
              {/* Moving Time Value */}
              <div
                className="absolute top-4 text-sm font-bold text-white pointer-events-none flex items-center justify-center"
                style={{
                  left: `${((time - 0.1) / (10 - 0.1)) * 100}%`,
                  transform: "translateX(-50%)",
                  backgroundColor: "#494949",
                  width: "57px",
                  height: "24px",
                  borderRadius: "15px",
                }}
              >
                {time.toFixed(1)}
              </div>

              {/* Slider */}
              <input
                type="range"
                min="0.1"
                max="10.0"
                step="0.1"
                value={time}
                onChange={(e) => setTime(parseFloat(e.target.value))}
                className="absolute bottom-0 w-full appearance-none rounded-lg cursor-pointer custom-slider"
                style={{
                  background: selectedColor,
                }}
              />
            </div>

            {/* Min/Max Labels */}
            <div className="flex justify-between text-xs text-gray-500 mt-1 w-[323px] mx-auto">
              <span>0.1</span>
              <span>10.0</span>
            </div>
          </div>

          <Link
            href={`/simulation?color=${selectedColor.substring(
              1
            )}&time=${time}`}
          >
            <button className="bg-[#5D5D5D] hover:bg-[#5D5D5D]  text-white   rounded-full font-bold text-[18.45px] leading-[100%] tracking-[0%] text-center align-middle font-kameron h-[54px] w-[301.6px]">
              {t("chooseStart")}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
