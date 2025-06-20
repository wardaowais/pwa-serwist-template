"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ShareButton from "../ShareButton";
import TopBar from "../TopBar";
import { useTranslation } from "react-i18next";

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
  const [capillaryProgress, setCapillaryProgress] = useState(100); // For SVG capillary fill

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
    const hex1 = color1.replace("#", "");
    const hex2 = color2.replace("#", "");

    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);

    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);

    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);

    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
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

      // Synchronize capillary fill with thumb refill
      setCapillaryProgress(easedProgress * 100);

      const newColor = interpolateColor(
        pressedColor,
        selectedSkinColor,
        easedProgress
      );
      setCurrentThumbColor(newColor);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsRefilling(false);
        setRefillProgress(1);
        setBreathingScale(1);
        setCapillaryProgress(100);
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
    setCapillaryProgress(0); // Empty capillaries instantly

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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between relative overflow-hidden">
      {/* Top Bar */}
      <TopBar />

      <div className="text-center flex justify-center flex-col mb-[40px]">
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
                background: `radial-gradient(ellipse at center, ${currentThumbColor} ${
                  refillProgress * 100
                }%, ${pressedColor} ${refillProgress * 100 + 2}%)`,
                transform: `scale(${breathingScale})`,
                transformOrigin: "center",
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

            {/* Enhanced SVG with animated capillary fill */}

            <svg
              width="79"
              height="124"
              viewBox="0 0 79 124"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-70"
            >
              <defs>
                {/* Gradient for blood effect */}
                <linearGradient
                  id="bloodGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#FF4444" />
                  <stop offset="100%" stopColor="#CC0000" />
                </linearGradient>

                {/* Radial mask for fill animation - creates inside-to-outside fill effect */}
                <mask id="fillMask">
                  <rect width="79" height="124" fill="black" />
                  <circle
                    cx="39.5"
                    cy="62"
                    r={`${(capillaryProgress / 100) * 80}`} // Grows from 0 to 80
                    fill="white"
                  />
                </mask>

                {/* Alternative linear mask for bottom-to-top fill */}
                <mask id="linearFillMask">
                  <rect width="79" height="124" fill="black" />
                  <rect
                    width="79"
                    height={`${(capillaryProgress / 100) * 124}`}
                    y={`${124 - (capillaryProgress / 100) * 124}`}
                    fill="white"
                  />
                </mask>
              </defs>

              <g opacity="0.8">
                {/* Background strokes - always visible in gray */}
                <path
                  d="M40.3347 0.151611C50.461 0.151679 59.6442 4.86907 66.4323 12.5452L67.0817 13.2971C73.9314 21.4162 78.1949 32.6363 78.3005 44.9963C78.3035 45.3664 78.3034 45.7368 78.3034 46.1038C78.3034 60.6963 75.7654 73.8264 71.7263 85.926C67.9393 97.2738 62.8375 107.72 57.2741 117.677L56.155 119.662C55.8007 120.288 55.1054 120.436 54.5964 120.034C54.0678 119.619 53.9179 118.761 54.2819 118.123V118.122C60.2286 107.658 65.6713 96.743 69.6169 84.9084C73.566 73.0696 76.0329 60.3124 76.0329 46.1038C76.0329 45.7443 76.0333 45.3877 76.03 45.0276C75.9304 33.4072 71.9296 22.8834 65.4909 15.2454C59.0488 7.61055 50.1841 2.88606 40.3347 2.88599C20.6803 2.88209 4.68339 21.7307 4.63837 44.7219V44.7317C4.59999 48.3963 3.92449 51.9582 2.89911 55.304C2.67526 56.0313 2.01973 56.3662 1.45477 56.1223H1.4538C0.872031 55.8745 0.544014 55.0925 0.766296 54.3596C1.72636 51.2427 2.33508 47.9859 2.36884 44.7151C2.4233 20.1468 19.4731 0.155226 40.3347 0.151611Z"
                  stroke="#E0E0E0"
                  strokeWidth="1.2"
                  fill="none"
                />

                <path
                  d="M40.3342 10.2666C48.4256 10.2628 55.7429 14.1579 61.0412 20.4414C66.3431 26.729 69.6421 35.4211 69.7316 44.9961C69.7347 45.2916 69.7385 45.5865 69.7385 45.877C69.7353 61.1905 66.052 76.0738 60.8781 89.3662C56.0252 101.825 49.8635 112.895 44.1418 121.627L43.0041 123.342C42.6097 123.926 41.9113 124.013 41.426 123.562C40.926 123.093 40.8401 122.222 41.2404 121.625C47.1798 112.786 53.7513 101.238 58.8254 88.2041C63.8961 75.1706 67.468 60.658 67.468 45.876L67.4611 45.0273C67.3806 36.1922 64.3412 28.1925 59.4533 22.3936C54.5554 16.5904 47.8252 13.001 40.3342 13.001C32.9501 12.9971 26.1587 16.5054 21.2189 22.1602C16.2763 27.8186 13.1936 35.5964 13.1935 44.1768L13.2033 44.8027V44.8037C13.2066 45.0673 13.2072 45.335 13.2072 45.6035C13.2072 51.9287 11.8814 57.8979 9.91229 63.2773C7.94312 68.657 5.33459 73.4573 2.72772 77.4805H2.72675C2.34379 78.0781 1.64351 78.1778 1.1535 77.7344C0.648099 77.2801 0.542928 76.409 0.937683 75.8008C3.45773 71.9112 5.96643 67.2879 7.83612 62.1777C9.70892 57.0636 10.9367 51.4681 10.9367 45.6045C10.9367 45.355 10.9371 45.1073 10.9338 44.8564C10.9275 44.6315 10.924 44.4064 10.924 44.1777C10.924 34.7985 14.3018 26.304 19.6545 20.1787C25.0071 14.0498 32.3535 10.2667 40.3342 10.2666Z"
                  stroke="#E0E0E0"
                  strokeWidth="1.0"
                  fill="none"
                />

                <path
                  d="M19.4991 44.9626L19.4962 44.7722C19.4962 38.0257 21.8647 31.9147 25.6475 27.5076C29.4269 23.1045 34.6364 20.3816 40.335 20.3816C46.064 20.3778 51.1954 23.1487 54.9141 27.6042H54.9151C58.6375 32.0608 60.9692 38.2078 61.1671 44.9656C61.1894 45.7206 61.1983 46.4758 61.1983 47.2351C61.195 61.9471 57.0498 76.4424 51.3995 89.3953C46.1021 101.538 39.4736 112.333 33.6182 120.677L32.4581 122.313C32.047 122.882 31.3449 122.947 30.8731 122.472H30.8721C30.3824 121.986 30.3202 121.111 30.7374 120.528C36.785 112.099 43.8535 100.82 49.3926 88.1267C54.9349 75.4305 58.935 61.3207 58.9317 47.2351C58.9317 46.5106 58.9197 45.7828 58.9005 45.0593V45.0583L58.878 44.4929C58.5885 38.662 56.5292 33.3895 53.3155 29.5427C49.9915 25.5711 45.4619 23.1161 40.335 23.116C35.2384 23.116 30.5934 25.5467 27.2237 29.4763C23.8543 33.402 21.7658 38.803 21.7657 44.7712V44.95C21.7657 45.0133 21.7668 45.0775 21.7676 45.1414C21.7685 45.2058 21.7696 45.2706 21.7696 45.3357C21.7663 55.2479 19.3081 64.3325 15.9083 72.1589C12.5051 79.9892 8.1611 86.5703 4.33405 91.532H4.33307C3.91104 92.0805 3.20636 92.1146 2.74518 91.6199C2.27109 91.1113 2.23741 90.2328 2.67389 89.6726V89.6716C6.39959 84.8437 10.6241 78.4306 13.8956 70.8933C17.1734 63.3523 19.4991 54.6962 19.4991 45.3357V44.9626Z"
                  stroke="#E0E0E0"
                  strokeWidth="0.8"
                  fill="none"
                />

                <path
                  d="M40.3843 44.324C40.9857 44.3564 41.496 44.972 41.4663 45.7537C40.9609 59.0835 37.1196 71.855 32.0366 83.1199C26.9473 94.388 20.6056 104.164 15.0288 111.517L15.0278 111.518C14.6109 112.074 13.9066 112.117 13.4438 111.627C12.9668 111.121 12.924 110.246 13.355 109.678V109.677C18.8332 102.454 25.0721 92.829 30.0444 81.8162C35.0166 70.8034 38.7181 58.4022 39.1997 45.6287C39.2295 44.8521 39.7786 44.2953 40.3843 44.324Z"
                  stroke="#E0E0E0"
                  strokeWidth="0.6"
                  fill="none"
                />

                <path
                  d="M40.3342 30.4929C47.0736 30.4967 52.5752 36.9401 52.6008 44.9646V44.9832L52.6028 45.0085C52.6026 45.0121 52.6017 45.0157 52.6018 45.0193C52.6177 45.5703 52.6272 46.1173 52.6272 46.6638C52.6206 60.2861 48.1604 74.0869 42.2405 86.5222C36.6821 98.1759 29.8255 108.632 24.0188 116.555L22.8723 118.106C22.4577 118.663 21.7555 118.711 21.2903 118.228H21.2893C20.8073 117.731 20.7585 116.851 21.1838 116.28C27.1443 108.294 34.4653 97.3491 40.2708 85.1599C46.0819 72.9757 50.3631 59.5488 50.3567 46.6628C50.3567 46.3953 50.3548 46.1269 50.3508 45.8591L50.3342 45.0593V45.0134L50.3215 44.407C50.1903 41.3961 49.1077 38.6962 47.4124 36.6902C45.6034 34.5539 43.1052 33.2273 40.3342 33.2273C37.5603 33.2274 35.0631 34.5539 33.2542 36.6902H33.2532C31.4446 38.83 30.3342 41.7594 30.3342 45.0134V45.0242C30.2447 56.7783 27.13 67.7739 22.8391 77.406C18.8163 86.4399 13.7551 94.2859 9.11841 100.468L8.19751 101.681C7.77809 102.233 7.07315 102.271 6.61255 101.78C6.16542 101.303 6.10721 100.501 6.45728 99.9373L6.53247 99.8279C11.3184 93.5926 16.6736 85.4725 20.842 76.116C25.0088 66.7596 27.9789 56.1859 28.0647 45.0134C28.0649 36.9703 33.5791 30.4969 40.3342 30.4929Z"
                  stroke="#E0E0E0"
                  strokeWidth="0.8"
                  fill="none"
                />

                {/* Blood-filled paths - these will be filled with red color and masked for animation */}
                <g mask="url(#fillMask)">
                  {" "}
                  {/* Use fillMask for radial inside-to-outside effect */}
                  <path
                    d="M40.3347 0.151611C50.461 0.151679 59.6442 4.86907 66.4323 12.5452L67.0817 13.2971C73.9314 21.4162 78.1949 32.6363 78.3005 44.9963C78.3035 45.3664 78.3034 45.7368 78.3034 46.1038C78.3034 60.6963 75.7654 73.8264 71.7263 85.926C67.9393 97.2738 62.8375 107.72 57.2741 117.677L56.155 119.662C55.8007 120.288 55.1054 120.436 54.5964 120.034C54.0678 119.619 53.9179 118.761 54.2819 118.123V118.122C60.2286 107.658 65.6713 96.743 69.6169 84.9084C73.566 73.0696 76.0329 60.3124 76.0329 46.1038C76.0329 45.7443 76.0333 45.3877 76.03 45.0276C75.9304 33.4072 71.9296 22.8834 65.4909 15.2454C59.0488 7.61055 50.1841 2.88606 40.3347 2.88599C20.6803 2.88209 4.68339 21.7307 4.63837 44.7219V44.7317C4.59999 48.3963 3.92449 51.9582 2.89911 55.304C2.67526 56.0313 2.01973 56.3662 1.45477 56.1223H1.4538C0.872031 55.8745 0.544014 55.0925 0.766296 54.3596C1.72636 51.2427 2.33508 47.9859 2.36884 44.7151C2.4233 20.1468 19.4731 0.155226 40.3347 0.151611Z"
                    stroke="none"
                    strokeWidth="1.2"
                    fill="url(#bloodGradient)"
                  />
                  <path
                    d="M40.3342 10.2666C48.4256 10.2628 55.7429 14.1579 61.0412 20.4414C66.3431 26.729 69.6421 35.4211 69.7316 44.9961C69.7347 45.2916 69.7385 45.5865 69.7385 45.877C69.7353 61.1905 66.052 76.0738 60.8781 89.3662C56.0252 101.825 49.8635 112.895 44.1418 121.627L43.0041 123.342C42.6097 123.926 41.9113 124.013 41.426 123.562C40.926 123.093 40.8401 122.222 41.2404 121.625C47.1798 112.786 53.7513 101.238 58.8254 88.2041C63.8961 75.1706 67.468 60.658 67.468 45.876L67.4611 45.0273C67.3806 36.1922 64.3412 28.1925 59.4533 22.3936C54.5554 16.5904 47.8252 13.001 40.3342 13.001C32.9501 12.9971 26.1587 16.5054 21.2189 22.1602C16.2763 27.8186 13.1936 35.5964 13.1935 44.1768L13.2033 44.8027V44.8037C13.2066 45.0673 13.2072 45.335 13.2072 45.6035C13.2072 51.9287 11.8814 57.8979 9.91229 63.2773C7.94312 68.657 5.33459 73.4573 2.72772 77.4805H2.72675C2.34379 78.0781 1.64351 78.1778 1.1535 77.7344C0.648099 77.2801 0.542928 76.409 0.937683 75.8008C3.45773 71.9112 5.96643 67.2879 7.83612 62.1777C9.70892 57.0636 10.9367 51.4681 10.9367 45.6045C10.9367 45.355 10.9371 45.1073 10.9338 44.8564C10.9275 44.6315 10.924 44.4064 10.924 44.1777C10.924 34.7985 14.3018 26.304 19.6545 20.1787C25.0071 14.0498 32.3535 10.2667 40.3342 10.2666Z"
                    stroke="none"
                    strokeWidth="1.0"
                    fill="url(#bloodGradient)"
                  />
                  <path
                    d="M19.4991 44.9626L19.4962 44.7722C19.4962 38.0257 21.8647 31.9147 25.6475 27.5076C29.4269 23.1045 34.6364 20.3816 40.335 20.3816C46.064 20.3778 51.1954 23.1487 54.9141 27.6042H54.9151C58.6375 32.0608 60.9692 38.2078 61.1671 44.9656C61.1894 45.7206 61.1983 46.4758 61.1983 47.2351C61.195 61.9471 57.0498 76.4424 51.3995 89.3953C46.1021 101.538 39.4736 112.333 33.6182 120.677L32.4581 122.313C32.047 122.882 31.3449 122.947 30.8731 122.472H30.8721C30.3824 121.986 30.3202 121.111 30.7374 120.528C36.785 112.099 43.8535 100.82 49.3926 88.1267C54.9349 75.4305 58.935 61.3207 58.9317 47.2351C58.9317 46.5106 58.9197 45.7828 58.9005 45.0593V45.0583L58.878 44.4929C58.5885 38.662 56.5292 33.3895 53.3155 29.5427C49.9915 25.5711 45.4619 23.1161 40.335 23.116C35.2384 23.116 30.5934 25.5467 27.2237 29.4763C23.8543 33.402 21.7658 38.803 21.7657 44.7712V44.95C21.7657 45.0133 21.7668 45.0775 21.7676 45.1414C21.7685 45.2058 21.7696 45.2706 21.7696 45.3357C21.7663 55.2479 19.3081 64.3325 15.9083 72.1589C12.5051 79.9892 8.1611 86.5703 4.33405 91.532H4.33307C3.91104 92.0805 3.20636 92.1146 2.74518 91.6199C2.27109 91.1113 2.23741 90.2328 2.67389 89.6726V89.6716C6.39959 84.8437 10.6241 78.4306 13.8956 70.8933C17.1734 63.3523 19.4991 54.6962 19.4991 45.3357V44.9626Z"
                    stroke="none"
                    strokeWidth="0.8"
                    fill="url(#bloodGradient)"
                  />
                  <path
                    d="M40.3843 44.324C40.9857 44.3564 41.496 44.972 41.4663 45.7537C40.9609 59.0835 37.1196 71.855 32.0366 83.1199C26.9473 94.388 20.6056 104.164 15.0288 111.517L15.0278 111.518C14.6109 112.074 13.9066 112.117 13.4438 111.627C12.9668 111.121 12.924 110.246 13.355 109.678V109.677C18.8332 102.454 25.0721 92.829 30.0444 81.8162C35.0166 70.8034 38.7181 58.4022 39.1997 45.6287C39.2295 44.8521 39.7786 44.2953 40.3843 44.324Z"
                    stroke="none"
                    strokeWidth="0.6"
                    fill="url(#bloodGradient)"
                  />
                  <path
                    d="M40.3342 30.4929C47.0736 30.4967 52.5752 36.9401 52.6008 44.9646V44.9832L52.6028 45.0085C52.6026 45.0121 52.6017 45.0157 52.6018 45.0193C52.6177 45.5703 52.6272 46.1173 52.6272 46.6638C52.6206 60.2861 48.1604 74.0869 42.2405 86.5222C36.6821 98.1759 29.8255 108.632 24.0188 116.555L22.8723 118.106C22.4577 118.663 21.7555 118.711 21.2903 118.228H21.2893C20.8073 117.731 20.7585 116.851 21.1838 116.28C27.1443 108.294 34.4653 97.3491 40.2708 85.1599C46.0819 72.9757 50.3631 59.5488 50.3567 46.6628C50.3567 46.3953 50.3548 46.1269 50.3508 45.8591L50.3342 45.0593V45.0134L50.3215 44.407C50.1903 41.3961 49.1077 38.6962 47.4124 36.6902C45.6034 34.5539 43.1052 33.2273 40.3342 33.2273C37.5603 33.2274 35.0631 34.5539 33.2542 36.6902H33.2532C31.4446 38.83 30.3342 41.7594 30.3342 45.0134V45.0242C30.2447 56.7783 27.13 67.7739 22.8391 77.406C18.8163 86.4399 13.7551 94.2859 9.11841 100.468L8.19751 101.681C7.77809 102.233 7.07315 102.271 6.61255 101.78C6.16542 101.303 6.10721 100.501 6.45728 99.9373L6.53247 99.8279C11.3184 93.5926 16.6736 85.4725 20.842 76.116C25.0088 66.7596 27.9789 56.1859 28.0647 45.0134C28.0649 36.9703 33.5791 30.4969 40.3342 30.4929Z"
                    stroke="none"
                    strokeWidth="0.8"
                    fill="url(#bloodGradient)"
                  />
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex flex-col gap-[19px]">
          <div className="mb-4 ">
            {thumbPressed && (
              <p className="text-sm text-red-600 font-semibold">
                {t("Pressedstatus")}
              </p>
            )}
            {isRefilling && (
              <p className="text-sm text-blue-600 font-semibold">
                {t("Refillstatus")}
              </p>
            )}
            {!thumbPressed && !isRefilling && (
              <p className="text-sm text-green-600 font-semibold">
                {t("FilledStatus")}
              </p>
            )}
          </div>

          {/* Instruction */}
          <p class="font-montserrat font-semibold text-[18px] leading-[1.1] text-center align-middle text-[#5D5D5D]  ">
            {t("Holdstatus")}
          </p>

          {/* Time Controls */}
          <div className="flex items-center justify-center space-x-4 mb-8 ">
            <button
              onClick={handleDecreaseTime}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full text-2xl"
              disabled={isRefilling}
            >
              -
            </button>
            <span className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg text-xl">
              {currentTime.toFixed(1)} Sec
            </span>
            <button
              onClick={handleIncreaseTime}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full text-2xl"
              disabled={isRefilling}
            >
              +
            </button>
          </div>

          <p class="font-montserrat font-semibold text-[18px] leading-[1.1] text-center align-middle text-[#5D5D5D]">
            {t("simulationAdjustTime")}
          </p>

          {/* Back Button */}
          <Link href="/">
            <button className="bg-[#5D5D5D] hover:bg-[#5D5D5D] text-white rounded-full font-bold text-[18.45px] leading-[100%] tracking-[0%] text-center align-middle h-[54px] w-[301.6px]">
              {t("Homestatus")}
            </button>
          </Link>
        </div>

        {/* Share Button */}
        <ShareButton />
      </div>
    </div>
  );
}
