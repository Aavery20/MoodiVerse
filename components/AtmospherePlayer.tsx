
import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music, Heart, Zap, Coffee, CloudMoon, SkipForward, SkipBack, Sparkles, Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import { playClickSound, resumeAudioContext } from './SoundEffects';

interface Song {
  title: string;
  artist: string;
  url: string;
}

interface Playlist {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  glow: string;
  songs: Song[];
}

const AtmospherePlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaylistId, setCurrentPlaylistId] = useState('midnight');
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playlists: Playlist[] = [
    {
      id: 'midnight',
      name: 'Midnight Piano',
      icon: <CloudMoon size={16} />,
      color: 'bg-indigo-100 text-indigo-700',
      glow: 'shadow-indigo-100',
      songs: [
        { title: "Dreamy Night", artist: "Classical Zen", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
        { title: "Velvet Sky", artist: "Midnight Mirror", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" }
      ]
    },
    {
      id: 'garden',
      name: 'Garden Piano',
      icon: <Coffee size={16} />,
      color: 'bg-green-100 text-green-700',
      glow: 'shadow-green-100',
      songs: [
        { title: "Morning Dew", artist: "Garden Flow", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
        { title: "Sunlight Path", artist: "Nature Piano", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" }
      ]
    },
    {
      id: 'focus',
      name: 'Deep Focus',
      icon: <Zap size={16} />,
      color: 'bg-blue-100 text-blue-700',
      glow: 'shadow-blue-100',
      songs: [
        { title: "Steady Concentration", artist: "Focus Engine", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },
        { title: "Study Rhythms", artist: "Rhythmic Keys", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3" }
      ]
    },
    {
      id: 'heart',
      name: 'Soft Heart',
      icon: <Heart size={16} />,
      color: 'bg-pink-100 text-pink-700',
      glow: 'shadow-pink-100',
      songs: [
        { title: "Warm Embrace", artist: "Acoustic Soft", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3" },
        { title: "Kindred Spirits", artist: "Soul Melody", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3" }
      ]
    }
  ];

  const currentPlaylist = playlists.find(p => p.id === currentPlaylistId)!;
  const currentSong = currentPlaylist.songs[currentSongIndex];

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = async () => {
    await resumeAudioContext();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setHasError(false);
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (e) {
          console.error("Playback failed", e);
          setIsPlaying(false);
          setHasError(true);
        }
      }
    }
  };

  const switchPlaylist = async (id: string) => {
    playClickSound();
    await resumeAudioContext();
    setHasError(false);
    setCurrentPlaylistId(id);
    setCurrentSongIndex(0);
    setProgress(0);
  };

  const nextSong = () => {
    playClickSound();
    setHasError(false);
    setCurrentSongIndex((prev) => (prev + 1) % currentPlaylist.songs.length);
    setProgress(0);
  };

  const prevSong = () => {
    playClickSound();
    setHasError(false);
    setCurrentSongIndex((prev) => (prev - 1 + currentPlaylist.songs.length) % currentPlaylist.songs.length);
    setProgress(0);
  };

  const handleAudioError = () => {
    setHasError(true);
    setIsBuffering(false);
    setIsPlaying(false);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      if (!isNaN(total)) {
        setCurrentTime(current);
        setDuration(total);
        setProgress((current / total) * 100);
      }
    }
  };

  const onScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      const newTime = (newProgress / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(newProgress);
    }
  };

  const onVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentSong.url]);

  return (
    <div className="bg-white rounded-3xl p-6 border border-pink-50 shadow-sm space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1">
        {playlists.map(p => (
          <button
            key={p.id}
            onClick={() => switchPlaylist(p.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border-2 ${
              currentPlaylistId === p.id 
                ? `${p.color} border-white shadow-lg scale-105` 
                : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'
            }`}
          >
            {p.icon}
            {p.name}
          </button>
        ))}
      </div>

      <div className={`flex flex-col p-6 bg-gradient-to-b from-gray-50 to-white rounded-3xl border border-gray-100 transition-all duration-500 shadow-inner relative overflow-hidden ${isPlaying ? `shadow-2xl ${currentPlaylist.glow}` : ''}`}>
        
        {hasError && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <AlertCircle size={40} className="text-red-400 mb-2" />
            <p className="text-sm font-bold text-gray-800">Music Loading Error</p>
            <p className="text-[11px] text-gray-500 mt-1 mb-6 leading-relaxed px-4">The streaming source is currently unreachable. Please check your connection or try again.</p>
            <button 
              onClick={() => { setHasError(false); audioRef.current?.load(); }}
              className="flex items-center gap-2 px-8 py-3 bg-pink-500 text-white rounded-full text-xs font-bold shadow-xl shadow-pink-100 active:scale-95 transition-transform"
            >
              <RotateCcw size={16} />
              Reload Player
            </button>
          </div>
        )}

        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className={`w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center relative z-10 transition-transform duration-1000 ${isPlaying ? 'rotate-[360deg] animate-[spin_12s_linear_infinite]' : ''}`}>
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center overflow-hidden">
                {isBuffering ? (
                  <Loader2 size={12} className="animate-spin text-gray-400" />
                ) : (
                  <Music size={12} className={currentPlaylist.color.split(' ')[1]} />
                )}
              </div>
              <div className="absolute inset-0 border-[6px] border-black/10 rounded-full"></div>
            </div>
            {isPlaying && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-0.5 h-4 z-20">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1 rounded-full animate-[bounce_1.5s_ease-in-out_infinite] ${currentPlaylist.color.split(' ')[1].replace('text-', 'bg-')}`}
                    style={{ 
                      animationDelay: `${i * 0.25}s`, 
                      height: `${40 + Math.random() * 60}%`,
                      opacity: 0.7
                    }}
                  ></div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-hidden">
            <h4 className="text-base font-bold text-gray-800 truncate leading-tight tracking-tight">{currentSong.title}</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 opacity-80">{currentSong.artist}</p>
          </div>
        </div>

        <div className="w-full mb-6">
          <input 
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={onScrub}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-400 hover:h-1.5 transition-all"
          />
          <div className="flex justify-between mt-2 px-1">
            <span className="text-[9px] font-bold text-gray-400 font-mono tracking-tighter">{formatTime(currentTime)}</span>
            <span className="text-[9px] font-bold text-gray-400 font-mono tracking-tighter">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center gap-10">
            <button onClick={prevSong} className="text-gray-300 hover:text-pink-400 transition-colors">
              <SkipBack size={24} fill="currentColor" />
            </button>
            <button 
              onClick={togglePlay}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${isPlaying ? 'bg-pink-500 shadow-pink-200' : 'bg-pink-400 shadow-pink-100'}`}
            >
              {isPlaying ? <Volume2 size={32} /> : <VolumeX size={32} />}
            </button>
            <button onClick={nextSong} className="text-gray-300 hover:text-pink-400 transition-colors">
              <SkipForward size={24} fill="currentColor" />
            </button>
          </div>
          <div className="flex items-center gap-3 w-full px-8">
            <VolumeX size={12} className="text-gray-300" />
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={onVolumeChange}
              className="flex-1 h-0.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-400"
            />
            <Volume2 size={12} className="text-gray-300" />
          </div>
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={currentSong.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={nextSong}
        onError={handleAudioError}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onCanPlay={() => setIsBuffering(false)}
      />
      
      <div className="flex items-center justify-center gap-2 opacity-50">
        <Sparkles size={12} className="text-pink-300" />
        <p className="text-[9px] text-gray-400 font-bold tracking-widest uppercase">Safe Atmosphere Engine</p>
        <Sparkles size={12} className="text-pink-300" />
      </div>
    </div>
  );
};

export default AtmospherePlayer;
