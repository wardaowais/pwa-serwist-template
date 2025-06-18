'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Choose() {
  const [selectedColor, setSelectedColor] = useState('#E0F2F7'); // Default light blue
  const [time, setTime] = useState(4.0);

  const colors = [
    { name: 'Light Green', hex: '#D1EDC2' },
    { name: 'Light Peach', hex: '#F7E0D1' },
    { name: 'Peach', hex: '#EDC2B0' },
    { name: 'Orange', hex: '#D18C61' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">SimCRT</h1>
          <p className="text-md text-gray-600">Master CRT with Real-Time Touch Simulation</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Select The Skin Color</h2>
          <div className="flex justify-around">
            {colors.map((color) => (
              <div
                key={color.hex}
                className={`w-16 h-16 rounded-full cursor-pointer border-4 ${selectedColor === color.hex ? 'border-blue-500' : 'border-transparent'}`}
                style={{ backgroundColor: color.hex }}
                onClick={() => setSelectedColor(color.hex)}
              ></div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Choose the time</h2>
          <div className="flex items-center space-x-4">
            <span className="text-lg font-bold text-gray-800">{time.toFixed(1)}</span>
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

        <Link href={`/simulation?color=${selectedColor.substring(1)}&time=${time}`}>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-full shadow-lg">
            Start SimCRT
          </button>
        </Link>
      </div>
    </div>
  );
}
