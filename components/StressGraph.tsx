
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { MoodLog } from '../types';

interface StressGraphProps {
  logs: MoodLog[];
}

const StressGraph: React.FC<StressGraphProps> = ({ logs }) => {
  const data = logs.slice(-7).map(log => ({
    name: new Date(log.timestamp).toLocaleDateString([], { weekday: 'short' }),
    stress: log.stressLevel,
    mood: log.mood
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-pink-100 rounded-xl shadow-lg">
          <p className="text-xs font-bold text-gray-500 mb-1">{payload[0].payload.name}</p>
          <p className="text-sm font-bold text-pink-600">Stress: {payload[0].value}</p>
          <p className="text-[10px] text-gray-400">Mood: {payload[0].payload.mood}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-50 h-[300px]">
      <h3 className="text-sm font-bold text-gray-600 mb-6 uppercase tracking-wider">Stress Trends</h3>
      {logs.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFD1DC" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#FFD1DC" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#9ca3af' }}
            />
            <YAxis 
              hide 
              domain={[0, 10]} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="stress" 
              stroke="#F472B6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorStress)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400 text-sm">
          Start logging to see your progress!
        </div>
      )}
    </div>
  );
};

export default StressGraph;
