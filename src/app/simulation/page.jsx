'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import TopBar from '../TopBar';


export default function Simulation() {
  const searchParams = useSearchParams();
  const initialColor = searchParams.get('color') || '000000'; // Default to black if no color
  const initialTime = parseFloat(searchParams.get('time')) || 5.0; // Default to 5.0 if no time
  const { t} = useTranslation();


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
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden">
      
          <TopBar/>

      <div className="w-full max-w-md text-center">
       

        <div
          className={`relative w-48 h-48 mx-auto mb-8 rounded-full flex items-center justify-center transition-all duration-300 ${thumbPressed ? 'scale-105' : ''}`}
          style={{ backgroundColor: thumbPressed ? thumbColor : '#E0E0E0' }}
          onMouseDown={() => setThumbPressed(true)}
          onMouseUp={() => setThumbPressed(false)}
          onMouseLeave={() => setThumbPressed(false)} // Handle case where mouse leaves while pressed
          onTouchStart={() => setThumbPressed(true)}
          onTouchEnd={() => setThumbPressed(false)}
        >
          <img src="/fingerprint.svg" alt="Fingerprint" className="w-24 h-24 opacity-50" />
        </div>

        <p className="text-xl font-semibold text-gray-700 mb-4"> {t('simulationPressHold')}</p>

        <div className="flex items-center justify-center space-x-4 mb-8">
          <button
            onClick={handleIncreaseTime}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full text-2xl"
          >
            +
          </button>
          <span className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg text-xl">
            {currentTime.toFixed(1)}{t('simulationSec')}
          </span>
          <button
            onClick={handleDecreaseTime}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full text-2xl"
          >
            -
          </button>
        </div>

        <p className="text-lg text-gray-600 mb-8">{t('simulationAdjustTime')}</p>

        <Link href="/">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-full shadow-lg">
          {t('simulationBack')}
          </button>
        </Link>
      </div>
    </div>
  );
}
