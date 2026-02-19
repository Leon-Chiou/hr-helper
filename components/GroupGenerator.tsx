import React, { useState } from 'react';
import { Users, Shuffle, Grid, Copy } from 'lucide-react';
import { Button } from './Button';
import { Participant, Group } from '../types';
import { motion } from 'framer-motion';

interface GroupGeneratorProps {
  participants: Participant[];
}

export const GroupGenerator: React.FC<GroupGeneratorProps> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState<number>(3);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  // Fisher-Yates shuffle
  const shuffleArray = (array: Participant[]) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const generateGroups = () => {
    if (groupSize < 1) return;
    
    const shuffled = shuffleArray(participants);
    const newGroups: Group[] = [];
    let currentGroup: Participant[] = [];
    let groupIndex = 1;

    shuffled.forEach((person, index) => {
      currentGroup.push(person);
      
      if (currentGroup.length === groupSize || index === shuffled.length - 1) {
        // However, if the last group is very small (e.g., 1 person), sometimes we might want to distribute them.
        // For this simple requirement, we stick to the size chunks.
        newGroups.push({
          id: Math.random().toString(36),
          name: `第 ${groupIndex} 組`,
          members: currentGroup
        });
        currentGroup = [];
        groupIndex++;
      }
    });

    setGroups(newGroups);
    setIsGenerated(true);
  };

  const copyResults = () => {
    const text = groups.map(g => `${g.name}:\n${g.members.map(m => m.name).join(', ')}`).join('\n\n');
    navigator.clipboard.writeText(text);
    alert('分組結果已複製到剪貼簿');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
             <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">自動分組設定</h2>
            <p className="text-sm text-gray-500">總人數: {participants.length} 人</p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-1 justify-end">
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
             <span className="text-sm font-medium text-gray-600 whitespace-nowrap">每組人數</span>
             <input 
               type="number" 
               min="1"
               max={participants.length}
               value={groupSize}
               onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
               className="w-16 p-1 text-center font-bold text-lg border-b-2 border-indigo-200 focus:border-indigo-600 outline-none bg-transparent"
             />
          </div>

          <Button onClick={generateGroups} icon={<Shuffle className="w-4 h-4" />}>
            開始分組
          </Button>
        </div>
      </div>

      {/* Results */}
      {isGenerated && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Grid className="w-5 h-5 text-indigo-600" />
              分組結果 ({groups.length} 組)
            </h3>
            <Button variant="secondary" onClick={copyResults} icon={<Copy className="w-4 h-4"/>}>
              複製結果
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
             {groups.map((group, idx) => (
               <motion.div 
                 key={group.id}
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: idx * 0.05 }}
                 className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
               >
                 <div className="bg-gradient-to-r from-indigo-50 to-white px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                   <span className="font-bold text-indigo-900">{group.name}</span>
                   <span className="text-xs bg-white border border-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                     {group.members.length} 人
                   </span>
                 </div>
                 <div className="p-4">
                   <ul className="space-y-2">
                     {group.members.map(member => (
                       <li key={member.id} className="flex items-center gap-2 text-gray-700 text-sm">
                         <div className="w-1.5 h-1.5 rounded-full bg-indigo-300"></div>
                         {member.name}
                       </li>
                     ))}
                   </ul>
                 </div>
               </motion.div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};