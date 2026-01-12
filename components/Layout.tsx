
import React from 'react';
import { Home, BarChart2, Lightbulb, Coffee } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'stats', icon: BarChart2, label: 'Stats' },
    { id: 'tips', icon: Lightbulb, label: 'Tips' },
    { id: 'relax', icon: Coffee, label: 'Relax' },
  ];

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto bg-[#FDFBFB] shadow-2xl relative overflow-hidden">
      {/* Soft Background Accents */}
      <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-pink-100 rounded-full blur-3xl opacity-50 z-0"></div>
      <div className="absolute bottom-[-20px] right-[-20px] w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-50 z-0"></div>
      
      <main className="relative z-10 p-6 pt-10">
        {children}
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[380px] bg-white/80 backdrop-blur-lg border border-pink-50 rounded-full shadow-lg p-2 flex justify-around items-center z-50">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center p-3 rounded-full transition-all duration-300 ${
              activeTab === id 
                ? 'bg-gradient-to-br from-pink-200 to-green-200 scale-110 shadow-sm' 
                : 'text-gray-400 hover:text-pink-400'
            }`}
          >
            <Icon size={24} className={activeTab === id ? 'text-pink-700' : ''} />
            <span className={`text-[10px] mt-1 font-bold ${activeTab === id ? 'text-pink-700' : 'hidden'}`}>
              {label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
