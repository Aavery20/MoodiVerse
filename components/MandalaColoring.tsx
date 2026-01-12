
import React, { useState } from 'react';
import { playClickSound } from './SoundEffects';

const MandalaColoring: React.FC = () => {
  const [colors, setColors] = useState<Record<string, string>>({});
  const [activeColor, setActiveColor] = useState('#FFD1DC');

  const palette = [
    '#FFD1DC', '#F8C8DC', '#FFB7CE', // Pinks
    '#E2F0CB', '#B2C9AB', '#C5E1A5', // Greens
    '#FFF9C4', '#FFECB3', '#D1C4E9'  // Accents
  ];

  const handleRegionClick = (id: string) => {
    setColors(prev => ({ ...prev, [id]: activeColor }));
    playClickSound();
  };

  const resetColoring = () => {
    setColors({});
    playClickSound();
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-pink-50 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          {palette.map(c => (
            <button
              key={c}
              onClick={() => setActiveColor(c)}
              className={`w-8 h-8 rounded-full border-2 transition-transform active:scale-90 ${activeColor === c ? 'border-gray-400 scale-110 shadow-md' : 'border-white'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <button onClick={resetColoring} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-pink-400">Clear</button>
      </div>

      <div className="relative aspect-square max-w-[280px] mx-auto">
        <svg viewBox="0 0 200 200" className="w-full h-full cursor-pointer">
          {/* Outer Ring */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <path
              key={`outer-${i}`}
              d="M 100 20 A 80 80 0 0 1 156.5 43.5 L 100 100 Z"
              transform={`rotate(${angle} 100 100)`}
              fill={colors[`outer-${i}`] || '#F9FAFB'}
              stroke="#E5E7EB"
              strokeWidth="0.5"
              onClick={() => handleRegionClick(`outer-${i}`)}
            />
          ))}
          {/* Middle Petals */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <path
              key={`mid-${i}`}
              d="M 100 50 Q 130 50 100 100 Q 70 50 100 50"
              transform={`rotate(${angle} 100 100)`}
              fill={colors[`mid-${i}`] || '#F9FAFB'}
              stroke="#E5E7EB"
              strokeWidth="0.5"
              onClick={() => handleRegionClick(`mid-${i}`)}
            />
          ))}
          {/* Inner Circle */}
          <circle
            cx="100"
            cy="100"
            r="20"
            fill={colors['center'] || '#F9FAFB'}
            stroke="#E5E7EB"
            strokeWidth="0.5"
            onClick={() => handleRegionClick('center')}
          />
        </svg>
      </div>
      <p className="text-center text-[10px] text-gray-400 font-medium">Tap to fill the mandala with your favorite shades.</p>
    </div>
  );
};

export default MandalaColoring;
