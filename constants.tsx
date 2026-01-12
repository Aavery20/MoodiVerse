
import React from 'react';
import { Smile, Cloud, Meh, Frown, Zap, Ghost } from 'lucide-react';
import { Mood } from './types';

export const MOOD_CONFIG: Record<Mood, { color: string; icon: React.ReactNode }> = {
  Joyful: { color: 'bg-pink-200', icon: <Smile className="text-pink-600" size={32} /> },
  Calm: { color: 'bg-green-200', icon: <Cloud className="text-green-600" size={32} /> },
  Neutral: { color: 'bg-yellow-100', icon: <Meh className="text-yellow-600" size={32} /> },
  Sad: { color: 'bg-blue-100', icon: <Frown className="text-blue-600" size={32} /> },
  Angry: { color: 'bg-red-100', icon: <Zap className="text-red-600" size={32} /> },
  Anxious: { color: 'bg-purple-100', icon: <Ghost className="text-purple-600" size={32} /> },
};

export const INITIAL_TIPS = [
  {
    title: "Gentle Morning Sunlight",
    content: "Try to get 5-10 minutes of sunlight shortly after waking to reset your circadian rhythm and boost serotonin.",
    category: "Mindfulness" as const
  },
  {
    title: "The 20-20-20 Rule",
    content: "Every 20 minutes, look at something 20 feet away for 20 seconds. This reduces digital eye strain and mental fatigue.",
    category: "Physical" as const
  },
  {
    title: "Digital Sunset",
    content: "Put away screens 1 hour before bed. The blue light inhibits melatonin, making it harder to find deep rest.",
    category: "Self-Care" as const
  },
  {
    title: "Box Breathing",
    content: "Inhale for 4, hold for 4, exhale for 4, hold for 4. Repeat 4 times to instantly lower cortisol.",
    category: "Mindfulness" as const
  },
  {
    title: "Gratitude Savoring",
    content: "Don't just list things you're grateful for; spend 30 seconds truly imagining the feeling of one specific positive memory.",
    category: "Mindfulness" as const
  }
];
