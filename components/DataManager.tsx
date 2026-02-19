import React, { useState, useRef } from 'react';
import { Upload, FileText, Trash2, Users, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';
import { parseCSV } from '../utils';
import { Participant } from '../types';

interface DataManagerProps {
  participants: Participant[];
  setParticipants: (p: Participant[]) => void;
  onNext: () => void;
}

export const DataManager: React.FC<DataManagerProps> = ({ participants, setParticipants, onNext }) => {
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      processText(text);
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processText = (text: string) => {
    const names = parseCSV(text);
    // Merge with existing or replace? Let's append new unique ones for better UX, or just replace.
    // Use case: user pastes a list, then realizes they missed one.
    // Implementation: Append unique names.
    
    const existingNames = new Set(participants.map(p => p.name));
    const newParticipants: Participant[] = [];
    
    names.forEach(name => {
      if (!existingNames.has(name)) {
        newParticipants.push({
          id: Math.random().toString(36).substr(2, 9),
          name: name
        });
        existingNames.add(name);
      }
    });

    if (newParticipants.length > 0) {
      setParticipants([...participants, ...newParticipants]);
      setInputText('');
    }
  };

  const handlePasteProcess = () => {
    if (!inputText.trim()) return;
    processText(inputText);
  };

  const clearAll = () => {
    if (confirm('確定要清空所有名單嗎？')) {
      setParticipants([]);
    }
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-600" />
              匯入名單
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  方法一：上傳 CSV 檔案
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors group"
                >
                  <FileText className="w-8 h-8 mx-auto text-gray-400 group-hover:text-indigo-500 mb-2" />
                  <p className="text-sm text-gray-500 group-hover:text-indigo-600">點擊上傳 CSV 檔案</p>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept=".csv,.txt"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>

              <div className="relative">
                 <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">或</span>
                  </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  方法二：貼上姓名 (一行一個)
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="王小明&#10;李大同&#10;陳小花"
                  className="w-full h-32 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                />
                <Button 
                  onClick={handlePasteProcess} 
                  disabled={!inputText.trim()}
                  className="w-full mt-3"
                >
                  加入名單
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* List Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                目前名單
                <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full ml-2">
                  {participants.length} 人
                </span>
              </h2>
              {participants.length > 0 && (
                <button 
                  onClick={clearAll}
                  className="text-sm text-rose-500 hover:text-rose-600 flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> 清空
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto max-h-[500px] bg-gray-50 rounded-xl p-4 border border-gray-100">
              {participants.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <Users className="w-12 h-12 mb-2 opacity-20" />
                  <p>尚未加入任何名單</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {participants.map((p) => (
                    <li key={p.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center group">
                      <span className="font-medium text-gray-700">{p.name}</span>
                      <button 
                        onClick={() => removeParticipant(p.id)}
                        className="text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {participants.length > 0 && (
         <div className="flex justify-center pt-6">
           <Button onClick={onNext} className="px-8 py-3 text-lg shadow-indigo-300 shadow-lg" icon={<CheckCircle2 className="w-5 h-5"/>}>
             準備完成，開始使用
           </Button>
         </div>
      )}
    </div>
  );
};