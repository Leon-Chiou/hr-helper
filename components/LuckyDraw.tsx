import React, { useState, useEffect, useCallback } from 'react';
    import { Trophy, RefreshCw, History, Settings2, Play, Eraser } from 'lucide-react';
    import { Button } from './Button';
    import { Participant, DrawHistory } from '../types';
    import { triggerConfetti } from '../utils';
    import { motion, AnimatePresence } from 'framer-motion';
    
    interface LuckyDrawProps {
      participants: Participant[];
    }
    
    export const LuckyDraw: React.FC<LuckyDrawProps> = ({ participants }) => {
      const [isSpinning, setIsSpinning] = useState(false);
      const [currentName, setCurrentName] = useState('準備抽獎');
      const [history, setHistory] = useState<DrawHistory[]>([]);
      const [allowRepeats, setAllowRepeats] = useState(false);
      const [winnersIdSet, setWinnersIdSet] = useState<Set<string>>(new Set());
    
      // Filter eligible participants based on settings
      const getEligibleParticipants = useCallback(() => {
        if (allowRepeats) return participants;
        return participants.filter(p => !winnersIdSet.has(p.id));
      }, [participants, allowRepeats, winnersIdSet]);
    
      const startDraw = () => {
        const eligible = getEligibleParticipants();
        if (eligible.length === 0) {
          alert('沒有符合條件的參加者！(若設定為不重複，請重置中獎名單或增加人員)');
          return;
        }
    
        setIsSpinning(true);
      };
    
      const stopDraw = () => {
        const eligible = getEligibleParticipants();
        // Fallback safety
        if (eligible.length === 0) {
          setIsSpinning(false);
          return;
        }
    
        const winnerIndex = Math.floor(Math.random() * eligible.length);
        const winner = eligible[winnerIndex];
    
        setIsSpinning(false);
        setCurrentName(winner.name);
        triggerConfetti();
    
        const newRecord: DrawHistory = {
          id: Math.random().toString(36),
          participant: winner,
          timestamp: Date.now()
        };
    
        setHistory(prev => [newRecord, ...prev]);
        setWinnersIdSet(prev => new Set(prev).add(winner.id));
      };
    
      // Animation Loop
      useEffect(() => {
        let interval: any;
        if (isSpinning) {
          const eligible = getEligibleParticipants();
          interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * eligible.length);
            setCurrentName(eligible[randomIndex].name);
          }, 50); // Speed of text change
        }
        return () => clearInterval(interval);
      }, [isSpinning, getEligibleParticipants]);
    
      const resetHistory = () => {
        if (confirm('確定要清眼中獎紀錄嗎？')) {
          setHistory([]);
          setWinnersIdSet(new Set());
          setCurrentName('準備抽獎');
        }
      };
    
      return (
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8 animate-in fade-in zoom-in-95 duration-500">
          
          {/* Main Stage */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100 border border-indigo-50 p-8 md:p-12 text-center relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              
              <div className="mb-8">
                <h2 className="text-gray-400 font-medium tracking-widest text-sm uppercase mb-2">Lucky Winner</h2>
                <div className="h-32 flex items-center justify-center">
                  <AnimatePresence mode='wait'>
                    <motion.h1 
                      key={currentName}
                      initial={{ scale: 0.9, opacity: 0.5, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 1.1, opacity: 0 }}
                      transition={{ duration: 0.05 }}
                      className={`text-5xl md:text-7xl font-black ${isSpinning ? 'text-gray-300 blur-[1px]' : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600'}`}
                    >
                      {currentName}
                    </motion.h1>
                  </AnimatePresence>
                </div>
              </div>
    
              <div className="flex justify-center gap-4">
                {!isSpinning ? (
                  <Button 
                    onClick={startDraw} 
                    className="px-10 py-4 text-xl rounded-full shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-1"
                    icon={<Play className="w-6 h-6 fill-current" />}
                  >
                    開始抽獎
                  </Button>
                ) : (
                  <Button 
                    onClick={stopDraw} 
                    variant="danger"
                    className="px-10 py-4 text-xl rounded-full shadow-xl shadow-rose-200 animate-pulse"
                  >
                    停止 !
                  </Button>
                )}
              </div>
    
              <div className="mt-8 flex justify-center items-center gap-2 text-sm text-gray-500">
                 <Settings2 className="w-4 h-4" />
                 <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={allowRepeats}
                      onChange={(e) => setAllowRepeats(e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    允許重複中獎
                 </label>
              </div>
            </div>
          </div>
    
          {/* Sidebar: History */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  中獎名單
                </h3>
                {history.length > 0 && (
                   <button onClick={resetHistory} className="p-1 hover:bg-white rounded-md transition-colors text-gray-400 hover:text-rose-500" title="清空紀錄">
                     <Eraser className="w-4 h-4" />
                   </button>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[500px]">
                {history.length === 0 ? (
                  <div className="text-center text-gray-400 py-10">
                    <History className="w-10 h-10 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">尚未有中獎者</p>
                  </div>
                ) : (
                  history.map((record, index) => (
                    <motion.div 
                      key={record.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gradient-to-r from-amber-50 to-white p-3 rounded-lg border border-amber-100 flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">
                        {history.length - index}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-800">{record.participant.name}</div>
                        <div className="text-xs text-gray-400">{new Date(record.timestamp).toLocaleTimeString()}</div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
    
        </div>
      );
    };