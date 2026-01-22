
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import MoodCheckIn from './components/MoodCheckIn';
import StressGraph from './components/StressGraph';
import BubblePop from './components/BubblePop';
import ZenSandbox from './components/ZenSandbox';
import FidgetPad from './components/FidgetPad';
import MandalaColoring from './components/MandalaColoring';
import { MoodLog, WellnessTip } from './types';
import { INITIAL_TIPS, MOOD_CONFIG } from './constants';
import { generateWellnessTips } from './services/geminiService';
import { dbService } from './services/dbService';
import { resumeAudioContext } from './components/SoundEffects';
import { Sparkles, Wind, Brain, Activity, RefreshCw, Palette, Gamepad2, Database, Trash2 } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [tips, setTips] = useState<WellnessTip[]>(INITIAL_TIPS);
  const [loadingTips, setLoadingTips] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Initial fetch from "Backend"
    const initDb = async () => {
      setIsSyncing(true);
      const data = await dbService.getLogs();
      setLogs(data);
      setIsSyncing(false);
      setIsInitialLoad(false);
    };

    initDb();

    // Modern browsers require a user gesture to activate audio context
    const handleGesture = () => {
      resumeAudioContext();
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };
    window.addEventListener('click', handleGesture);
    window.addEventListener('touchstart', handleGesture);

    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };
  }, []);

  const saveLog = async (newLog: MoodLog) => {
    setIsSyncing(true);
    const success = await dbService.saveLog(newLog);
    if (success) {
      setLogs(prev => [...prev, newLog]);
      setActiveTab('stats');
    }
    setIsSyncing(false);
  };

  const clearLogs = async () => {
    if (window.confirm("Are you sure you want to reset your personal orbit? This will clear all logs from the database.")) {
      setIsSyncing(true);
      await dbService.clearDatabase();
      setLogs([]);
      setIsSyncing(false);
    }
  };

  const refreshTips = async () => {
    setLoadingTips(true);
    try {
      const newTips = await generateWellnessTips(logs);
      if (newTips) setTips(newTips);
    } catch (e) {
      console.error("Gemini service error:", e);
    }
    setLoadingTips(false);
  };

  const renderContent = () => {
    if (isInitialLoad) {
      return (
        <div className="h-full flex flex-col items-center justify-center space-y-4 animate-pulse pt-20">
          <Database size={48} className="text-pink-200" />
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Waking up the Moodiverse...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome to <span className="text-pink-400 italic font-serif">Moodiverse</span> ✨
              </h1>
              <p className="text-gray-500 mt-2 text-sm">A peaceful orbit for your emotions.</p>
            </header>
            
            <MoodCheckIn onSave={saveLog} />

            <div className="bg-green-50 rounded-3xl p-6 border border-green-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-700">Zen Note</h4>
                <p className="text-xs text-gray-500 mt-1">Deep breaths are love notes to your body.</p>
              </div>
              <div className="p-3 bg-white rounded-2xl shadow-sm animate-float">
                <Wind size={20} className="text-green-400" />
              </div>
            </div>
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-6">
            <header>
              <h1 className="text-2xl font-bold text-gray-800">Emotional Orbit</h1>
              <p className="text-gray-500 text-sm">Visualizing your personal universe.</p>
            </header>
            
            <StressGraph logs={logs} />

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-3xl border border-pink-50 shadow-sm">
                <Activity size={18} className="text-pink-400 mb-2" />
                <div className="text-2xl font-bold text-gray-700">{logs.length}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase">Total Entries</div>
              </div>
              <div className="bg-white p-4 rounded-3xl border border-green-50 shadow-sm">
                <Brain size={18} className="text-green-400 mb-2" />
                <div className="text-2xl font-bold text-gray-700">
                  {logs.length > 0 ? (logs.reduce((a, b) => a + b.stressLevel, 0) / logs.length).toFixed(1) : '0'}
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase">Avg Stress</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-pink-50 shadow-sm">
              <h3 className="text-sm font-bold text-gray-600 mb-4 uppercase tracking-wider">History Vault</h3>
              <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {logs.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 text-xs">The vault is empty. Start your journey today.</div>
                ) : (
                  logs.slice().reverse().map(log => {
                    const moodConf = MOOD_CONFIG[log.mood] || MOOD_CONFIG['Neutral'];
                    return (
                      <div key={log.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-colors">
                        <div className={`p-2 rounded-full ${moodConf.color}`}>
                          {React.cloneElement(moodConf.icon as React.ReactElement<any>, { size: 16 })}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-700">{log.mood}</span>
                            <span className="text-[10px] text-gray-400">
                              {new Date(log.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1 italic">{log.note || 'A quiet moment recorded.'}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="bg-red-50/30 rounded-3xl p-6 border border-red-100/50">
              <h3 className="text-[10px] font-bold text-red-400 mb-3 uppercase tracking-widest">System Controls</h3>
              <button 
                onClick={clearLogs}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white text-red-400 border border-red-100 rounded-2xl text-xs font-bold hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} />
                Clear Local Database
              </button>
            </div>
          </div>
        );

      case 'tips':
        return (
          <div className="space-y-6">
             <header className="flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Wisdom Space</h1>
                <p className="text-gray-500 text-sm">Gentle science-backed advice.</p>
              </div>
              <button 
                onClick={refreshTips}
                disabled={loadingTips}
                className={`p-3 rounded-full bg-pink-100 text-pink-600 shadow-sm transition-all active:rotate-180 ${loadingTips ? 'animate-spin' : ''}`}
              >
                <RefreshCw size={18} />
              </button>
            </header>

            <div className="space-y-4">
              {tips.map((tip, idx) => (
                <div 
                  key={idx} 
                  className={`p-6 rounded-3xl border animate-fade-in ${
                    idx % 2 === 0 ? 'bg-pink-50 border-pink-100' : 'bg-green-50 border-green-100'
                  }`}
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{tip.category}</span>
                  </div>
                  <h4 className="font-bold text-gray-700 text-lg">{tip.title}</h4>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{tip.content}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'relax':
        return (
          <div className="space-y-8 pb-10">
            <header>
              <h1 className="text-2xl font-bold text-gray-800">The Chill Zone</h1>
              <p className="text-gray-500 text-sm">Satisfying activities to find your flow.</p>
            </header>

            <div className="space-y-10">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="text-pink-400" size={18} />
                  <h3 className="text-sm font-bold text-gray-600 uppercase tracking-widest">Rainbow Sandbox</h3>
                </div>
                <ZenSandbox />
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="text-green-400" size={18} />
                  <h3 className="text-sm font-bold text-gray-600 uppercase tracking-widest">Zen Mandala</h3>
                </div>
                <MandalaColoring />
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Gamepad2 className="text-blue-400" size={18} />
                  <h3 className="text-sm font-bold text-gray-600 uppercase tracking-widest">Satisfying Fidgets</h3>
                </div>
                <FidgetPad />
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="text-yellow-400" size={18} />
                  <h3 className="text-sm font-bold text-gray-600 uppercase tracking-widest">Bubble Pop</h3>
                </div>
                <BubblePop />
              </section>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} isSyncing={isSyncing}>
      {renderContent()}
    </Layout>
  );
};

export default App;
