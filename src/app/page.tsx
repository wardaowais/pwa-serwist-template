'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';

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

        {/* Centered Content */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 text-center h-52" style={{ backgroundImage: 'url(/bg.png)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center center' }}>
          <h2 className="text-white text-3xl font-bold mb-4 leading-tight" 
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            Capillary Refill Time<br />Trainer app
          </h2>
          <p className="text-white text-lg font-normal opacity-90 max-w-sm" 
             style={{ textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>
            {t('subtitle')}
          </p>
        </div>

        {/* Get Started Button */}
        <div className="flex justify-center pb-12 px-6">
          <Link href="/choose" className="w-full max-w-sm">
            <button className="w-full bg-gray-700 hover:bg-gray-800 active:bg-gray-900 text-white font-semibold py-4 px-8 rounded-full shadow-lg transition-all duration-200 text-lg">
              {t('getStarted')}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}