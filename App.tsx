import React, { useState } from 'react';
import { Users, PartyPopper, Dna, Github } from 'lucide-react';
import { DataManager } from './components/DataManager';
import { LuckyDraw } from './components/LuckyDraw';
import { GroupGenerator } from './components/GroupGenerator';
import { Participant, AppMode } from './types';

function App() {
  const [mode, setMode] = useState<AppMode>('data');
  const [participants, setParticipants] = useState<Participant[]>([]);

  const NavButton = ({ targetMode, icon: Icon, label }: { targetMode: AppMode, icon: any, label: string }) => (
    <button
      onClick={() => setMode(targetMode)}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 
        ${mode === targetMode 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
        }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
              H
            </div>
            <h1 className="font-bold text-xl text-slate-800 hidden sm:block">HR Tool</h1>
          </div>
          
          <nav className="flex items-center gap-2 md:gap-4">
             <NavButton targetMode="data" icon={Users} label="名單管理" />
             <NavButton targetMode="draw" icon={PartyPopper} label="幸運抽獎" />
             <NavButton targetMode="group" icon={Dna} label="自動分組" />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {mode === 'data' && (
          <DataManager 
            participants={participants} 
            setParticipants={setParticipants} 
            onNext={() => setMode('draw')}
          />
        )}
        
        {mode === 'draw' && (
           <>
             {participants.length === 0 ? (
                <div className="text-center py-20">
                  <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-10 h-10 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">尚未匯入名單</h3>
                  <p className="text-gray-500 mb-6">請先回到名單管理頁面加入參加者</p>
                  <button onClick={() => setMode('data')} className="text-indigo-600 font-medium hover:underline">
                    前往名單管理
                  </button>
                </div>
             ) : (
                <LuckyDraw participants={participants} />
             )}
           </>
        )}

        {mode === 'group' && (
           <>
             {participants.length === 0 ? (
                <div className="text-center py-20">
                  <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-10 h-10 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">尚未匯入名單</h3>
                  <p className="text-gray-500 mb-6">請先回到名單管理頁面加入參加者</p>
                  <button onClick={() => setMode('data')} className="text-indigo-600 font-medium hover:underline">
                    前往名單管理
                  </button>
                </div>
             ) : (
                <GroupGenerator participants={participants} />
             )}
           </>
        )}
      </main>

    </div>
  );
}

export default App;