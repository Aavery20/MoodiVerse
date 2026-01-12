
export type Mood = 'Joyful' | 'Calm' | 'Neutral' | 'Sad' | 'Angry' | 'Anxious';

export interface MoodLog {
  id: string;
  timestamp: number;
  mood: Mood;
  stressLevel: number; // 1-10
  note: string;
}

export interface WellnessTip {
  title: string;
  content: string;
  category: 'Mindfulness' | 'Physical' | 'Social' | 'Self-Care';
}
