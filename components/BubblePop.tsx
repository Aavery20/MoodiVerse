
import React, { useState, useEffect } from 'react';
import { playPopSound } from './SoundEffects';

const BubblePop: React.FC = () => {
  const [bubbles, setBubbles] = useState<{ id: number; top: number; left: number; popped: boolean; color: string }[]>([]);
  const [popCount, setPopCount] = useState(0);

  const colors = ['#FFD1DC', '#E2F0CB', '#B2C9AB', '#F8C8DC', '#FFF0F5'];

  const spawnBubble = () => {
    const id = Date.now();
    const top = Math.random() * 80 + 10;
    const left = Math.random() * 80 + 10;
    const color = colors[Math.floor(Math.random() * colors.length)];
    setBubbles(prev => [...prev, { id, top, left, popped: false, color }]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (bubbles.length < 15) spawnBubble();
    }, 1200);
    return () => clearInterval(interval);
  }, [bubbles]);

  const pop = (id: number) => {
    playPopSound();
    setBubbles(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));
    setPopCount(c => c + 1);
    setTimeout(() => {
      setBubbles(prev => prev.filter(b => b.id !== id));
    }, 300);
  };

  return (
    <div className="relative w-full h-[400px] bg-white rounded-3xl overflow-hidden border border-pink-50 shadow-inner p-4">
      <div className="absolute top-4 right-4 z-10 bg-white/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-pink-600">
        Pops: {popCount}
      </div>
      
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <p className="text-gray-300 text-sm font-medium">Tap to pop bubbles ✨</p>
      </div>

      {bubbles.map(bubble => (
        <button
          key={bubble.id}
          onClick={() => pop(bubble.id)}
          style={{
            top: `${bubble.top}%`,
            left: `${bubble.left}%`,
            backgroundColor: bubble.color,
            width: '60px',
            height: '60px',
          }}
          className={`absolute rounded-full shadow-lg border-2 border-white/40 transition-all duration-300 cursor-pointer transform hover:scale-110 active:scale-90 ${
            bubble.popped ? 'scale-150 opacity-0 blur-xl' : 'scale-100 opacity-80'
          }`}
        />
      ))}
    </div>
  );
};

export default BubblePop;
