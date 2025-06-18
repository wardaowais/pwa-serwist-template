'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';


export default function Simulation() {
  const searchParams = useSearchParams();
  const initialColor = searchParams.get('color') || '000000'; // Default to black if no color
  const initialTime = parseFloat(searchParams.get('time')) || 5.0; // Default to 5.0 if no time
  const { t} = useTranslation();
  const [showInfo, setShowInfo] = useState(false);
  const [showLang, setShowLang] = useState(false);


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
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-gray-100 p-4">
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
      <div className="w-full max-w-md    text-center">
       

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
