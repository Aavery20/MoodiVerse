
import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Music, CloudRain, Trees } from 'lucide-react';

const AmbientPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState<'rain' | 'forest'>('rain');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const soundUrls = {
    rain: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder for actual ambient loop
    forest: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  };

  // Note: Using placeholder sounds as real ambient loops are large.
  // In a real app, these would be short high-quality loops.

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="bg-green-50 rounded-3xl p-6 border border-green-100 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${isPlaying ? 'bg-green-200 animate-pulse' : 'bg-white shadow-sm'}`}>
          <Music size={20} className="text-green-600" />
        </div>
        <div>
          <h4 className="font-bold text-gray-700 text-sm">Zen Ambience</h4>
          <div className="flex gap-3 mt-1">
             <button onClick={() => setCurrentSound('rain')} className={`text-[10px] font-bold uppercase transition-colors ${currentSound === 'rain' ? 'text-green-600' : 'text-gray-400'}`}>
                Rain
             </button>
             <button onClick={() => setCurrentSound('forest')} className={`text-[10px] font-bold uppercase transition-colors ${currentSound === 'forest' ? 'text-green-600' : 'text-gray-400'}`}>
                Forest
             </button>
          </div>
        </div>
      </div>
      
      <button 
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-green-600 hover:scale-110 active:scale-95 transition-transform"
      >
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>

      <audio 
        ref={audioRef}
        loop
        src={soundUrls[currentSound]}
      />
    </div>
  );
};

export default AmbientPlayer;
