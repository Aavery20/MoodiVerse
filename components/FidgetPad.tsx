
import React, { useState } from 'react';
import { playClickSound } from './SoundEffects';

const FidgetPad: React.FC = () => {
  const [active, setActive] = useState<number | null>(null);

  const buttons = Array.from({ length: 9 });

  const handlePress = (i: number) => {
    setActive(i);
    playClickSound();
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-6 bg-pink-50/50 rounded-3xl border border-pink-100">
      {buttons.map((_, i) => (
        <button
          key={i}
          onMouseDown={() => handlePress(i)}
          onMouseUp={() => setActive(null)}
          onMouseLeave={() => setActive(null)}
          onTouchStart={() => handlePress(i)}
          onTouchEnd={() => setActive(null)}
          className={`h-16 rounded-2xl transition-all duration-75 flex items-center justify-center ${
            active === i 
              ? 'bg-pink-300 scale-95 shadow-inner' 
              : 'bg-white shadow-[4px_4px_0px_#FFD1DC] active:shadow-none translate-y-[-2px] active:translate-y-[2px]'
          }`}
        >
          <div className={`w-3 h-3 rounded-full ${i % 2 === 0 ? 'bg-pink-100' : 'bg-green-100'}`} />
        </button>
      ))}
      <div className="col-span-3 text-center mt-2">
         <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Tactile Fidget Pad</p>
      </div>
    </div>
  );
};

export default FidgetPad;
