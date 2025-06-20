"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import TopBar from "../TopBar";
import ShareButton from "../ShareButton";

export default function Simulation() {
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState(5.0);
  const [selectedSkinColor, setSelectedSkinColor] = useState("#E0F2F7"); // Original skin color
  const [currentThumbColor, setCurrentThumbColor] = useState("#E0F2F7"); // Current display color
  const [hydrated, setHydrated] = useState(false);
  const [thumbPressed, setThumbPressed] = useState(false);
  const [isRefilling, setIsRefilling] = useState(false);
  const [refillProgress, setRefillProgress] = useState(0); // For circular fill animation
  const [breathingScale, setBreathingScale] = useState(1); // For breathing effect
  
  const refillTimeoutRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  // Default pressed color (pale/white color when pressed)
  const pressedColor = "#F5F5F5";

  useEffect(() => {
    const storedColor = localStorage.getItem("selectedColor");
    const storedTime = localStorage.getItem("selectedTime");

    if (storedColor) {
      setSelectedSkinColor(storedColor);
      setCurrentThumbColor(storedColor);
    }
    if (storedTime) setCurrentTime(parseFloat(storedTime));

    setHydrated(true);
  }, []);

  // Function to interpolate between two colors
  const interpolateColor = (color1, color2, factor) => {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    
    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);
    
    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);
    
    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Function to handle the refill animation with breathing effect
  const startRefillAnimation = () => {
    if (refillTimeoutRef.current) {
      clearTimeout(refillTimeoutRef.current);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setIsRefilling(true);
    const startTime = Date.now();
    const duration = currentTime * 1000; // Convert to milliseconds

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing function (ease-out)
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      // Slow subtle breathing effect only for the blood fill
      const breathingWave = Math.sin(elapsed * 0.003) * 0.03 + 1; // Very slow and subtle
      
      setRefillProgress(easedProgress);
      setBreathingScale(breathingWave);
      
      const newColor = interpolateColor(pressedColor, selectedSkinColor, easedProgress);
      setCurrentThumbColor(newColor);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsRefilling(false);
        setRefillProgress(1);
        setBreathingScale(1);
        setCurrentThumbColor(selectedSkinColor);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const handleThumbPress = () => {
    setThumbPressed(true);
    setCurrentThumbColor(pressedColor);
    setIsRefilling(false);
    setRefillProgress(0);
    setBreathingScale(1);
    
    // Clear any ongoing animations
    if (refillTimeoutRef.current) {
      clearTimeout(refillTimeoutRef.current);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const handleThumbRelease = () => {
    setThumbPressed(false);
    startRefillAnimation();
  };

  const handleIncreaseTime = () => {
    setCurrentTime((prevTime) => Math.min(prevTime + 0.1, 10.0));
  };

  const handleDecreaseTime = () => {
    setCurrentTime((prevTime) => Math.max(prevTime - 0.1, 0.1));
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refillTimeoutRef.current) {
        clearTimeout(refillTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (!hydrated) return null;

  return (
    <div className="flex flex-col justify-between relative overflow-hidden">
      <TopBar />

      <div className="text-center flex justify-center flex-col">
        {/* Thumb Area with Inside-to-Outside Fill Effect */}
        <div className="relative w-[109px] h-[190px] mx-auto mb-8">
          {/* Background Base (always pressed color) */}
          <div
            className="absolute inset-0 rounded-[69px] transition-transform duration-200"
            style={{
              backgroundColor: pressedColor,
              transform: thumbPressed ? "scale(1.05)" : "scale(1)",
            }}
          />
          
          {/* Blood Fill Overlay (inside to outside) */}
          <div
            className="absolute inset-0 rounded-[69px] overflow-hidden"
            style={{
              transform: thumbPressed ? "scale(1.05)" : "scale(1)",
            }}
          >
            {/* Radial fill effect - inside to outside */}
            <div
              className="absolute inset-0 rounded-[69px] transition-all duration-100"
              style={{
                background: `radial-gradient(ellipse at center, ${currentThumbColor} ${refillProgress * 100}%, ${pressedColor} ${refillProgress * 100 + 2}%)`,
                transform: `scale(${breathingScale})`,
                transformOrigin: 'center',
                boxShadow: isRefilling 
                  ? `0 0 20px 5px ${currentThumbColor}60, inset 0 0 15px 0 ${currentThumbColor}40` 
                  : thumbPressed 
                    ? `0 0 15px 0 ${currentThumbColor}` 
                    : `0 0 8px 0 ${currentThumbColor}40`,
              }}
            />
          </div>

          {/* Images */}
          <div
            className="relative w-full h-full rounded-[69px] flex items-center justify-center cursor-pointer z-10"
            onMouseDown={handleThumbPress}
            onMouseUp={handleThumbRelease}
            onMouseLeave={handleThumbRelease}
            onTouchStart={handleThumbPress}
            onTouchEnd={handleThumbRelease}
          >
            <img
              src="/behind.png"
              alt=""
              className="w-[109px] h-[190px] rounded-[69px] opacity-20 select-none pointer-events-none"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
            <img
              src="/print.png"
              alt="Print Overlay"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-70"
            />
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mb-4">
          {thumbPressed && (
            <p className="text-sm text-red-600 font-semibold">
              {t("simulationPressed")} 🔴
            </p>
          )}
          {isRefilling && (
            <p className="text-sm text-blue-600 font-semibold">
              {t("simulationRefilling")} 🩸
            </p>
          )}
          {!thumbPressed && !isRefilling && (
            <p className="text-sm text-green-600 font-semibold">
              {t("simulationNormal")} ✅
            </p>
          )}
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
            disabled={isRefilling}
          >
            +
          </button>
          <span className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg text-xl">
            {currentTime.toFixed(1)} {t("simulationSec")}
          </span>
          <button
            onClick={handleDecreaseTime}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full text-2xl"
            disabled={isRefilling}
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

      <ShareButton />
    </div>
  );
}