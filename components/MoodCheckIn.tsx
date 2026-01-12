
import React, { useState } from 'react';
import { Mood, MoodLog } from '../types';
import { MOOD_CONFIG } from '../constants';
import { Heart } from 'lucide-react';
import { playChimeSound, playClickSound } from './SoundEffects';

interface MoodCheckInProps {
  onSave: (log: MoodLog) => void;
}

const MoodCheckIn: React.FC<MoodCheckInProps> = ({ onSave }) => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [stress, setStress] = useState(5);
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (!selectedMood) return;
    
    const newLog: MoodLog = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      mood: selectedMood,
      stressLevel: stress,
      note
    };
    
    playChimeSound();
    onSave(newLog);
    setSelectedMood(null);
    setStress(5);
    setNote('');
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-50 animate-fade-in">
      <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
        <Heart className="text-pink-400" fill="currentColor" size={20} />
        How are you feeling?
      </h2>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {(Object.keys(MOOD_CONFIG) as Mood[]).map((mood) => (
          <button
            key={mood}
            onClick={() => { setSelectedMood(mood); playClickSound(); }}
            className={`flex flex-col items-center p-3 rounded-2xl transition-all border-2 ${
              selectedMood === mood 
                ? 'border-pink-300 bg-pink-50 scale-105' 
                : 'border-transparent bg-gray-50'
            }`}
          >
            {MOOD_CONFIG[mood].icon}
            <span className="text-xs font-semibold text-gray-600 mt-2">{mood}</span>
          </button>
        ))}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-bold text-gray-600">Stress Level</label>
          <span className="text-pink-500 font-bold">{stress}</span>
        </div>
        <input 
          type="range" 
          min="1" 
          max="10" 
          value={stress}
          onChange={(e) => setStress(parseInt(e.target.value))}
          className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-400"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>Chill</span>
          <span>Overwhelmed</span>
        </div>
      </div>

      <div className="mb-6">
        <textarea
          placeholder="What's on your mind? (Optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 text-sm h-24 transition-all"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={!selectedMood}
        className={`w-full py-4 rounded-2xl font-bold text-white transition-all transform active:scale-95 ${
          selectedMood 
            ? 'bg-gradient-to-r from-pink-400 to-pink-500 shadow-md shadow-pink-200' 
            : 'bg-gray-200 cursor-not-allowed'
        }`}
      >
        Log Check-in
      </button>
    </div>
  );
};

export default MoodCheckIn;
