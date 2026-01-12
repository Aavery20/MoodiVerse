
import React, { useRef, useEffect, useState } from 'react';
import { playSandSound } from './SoundEffects';

const ZenSandbox: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hue, setHue] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set initial background
    ctx.fillStyle = '#fdfbfb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Create sand texture
    for(let i = 0; i < 2000; i++) {
        ctx.fillStyle = '#e5e7eb';
        ctx.globalAlpha = 0.05;
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
    }
    ctx.globalAlpha = 1;
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) ctx.beginPath();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.strokeStyle = `hsla(${hue}, 70%, 80%, 0.8)`;
    ctx.shadowBlur = 15;
    ctx.shadowColor = `hsla(${hue}, 70%, 80%, 0.4)`;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    setHue(prev => (prev + 2) % 360);
    playSandSound();
  };

  const clearSandbox = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#fdfbfb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < 2000; i++) {
        ctx.fillStyle = '#e5e7eb';
        ctx.globalAlpha = 0.05;
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative border-4 border-white shadow-inner bg-white rounded-3xl overflow-hidden cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-[300px] touch-none"
        />
        <div className="absolute bottom-4 right-4 flex gap-2">
            <button 
                onClick={clearSandbox}
                className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-gray-400 hover:text-pink-400 shadow-sm transition-colors"
            >
                Reset Canvas
            </button>
        </div>
      </div>
      <p className="text-center text-[10px] text-gray-400 font-medium uppercase tracking-widest">Draw rainbow trails in the digital sand 🌈</p>
    </div>
  );
};

export default ZenSandbox;
