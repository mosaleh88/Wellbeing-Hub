import React, { useState, useEffect } from 'react';
import type { TimeSorterItem, TimeSorterItemType, StudentInfo } from '../types';

interface Props {
  items: TimeSorterItem[];
  onComplete: (score: number) => void;
  lang: 'en' | 'ar';
  studentInfo?: StudentInfo;
}

const TimeSorter: React.FC<Props> = ({ items: initialItems, onComplete, lang, studentInfo }) => {
  const [items, setItems] = useState(initialItems);
  const [boosters, setBoosters] = useState<TimeSorterItem[]>([]);
  const [wasters, setWasters] = useState<TimeSorterItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<TimeSorterItem | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<TimeSorterItemType | null>(null);

  useEffect(() => {
    setItems(initialItems.sort(() => Math.random() - 0.5));
    setBoosters([]);
    setWasters([]);
  }, [initialItems]);

  const handleDragStart = (item: TimeSorterItem) => {
    setDraggedItem(item);
  };

  const handleDrop = (targetType: TimeSorterItemType) => {
    if (!draggedItem) return;
    setItems(items.filter(i => i.id !== draggedItem.id));
    if (targetType === 'booster') {
      setBoosters([...boosters, draggedItem]);
    } else {
      setWasters([...wasters, draggedItem]);
    }
    setDraggedItem(null);
    setIsDraggingOver(null);
  };

  const calculateScore = () => {
    let score = 0;
    boosters.forEach(item => { if (item.type === 'booster') score++; });
    wasters.forEach(item => { if (item.type === 'waster') score++; });
    return score;
  };

  const content = {
      en: { title: "Energy Sorter", unsorted: "Activities to Sort", boosters: "Energy Boosters 👍", wasters: "Energy Wasters 👎", back: "Back to Activities", finish: "Finish & See Score", welcome: "Player" },
      ar: { title: "مصنف الطاقة", unsorted: "أنشطة للفرز", boosters: "معززات الطاقة 👍", wasters: "مستنزفات الطاقة 👎", back: "العودة إلى الأنشطة", finish: "إنهاء ورؤية النتيجة", welcome: "لاعب" }
  };
  
  if (!initialItems || initialItems.length === 0) {
    return (
       <div className="text-center p-8 bg-white rounded-lg shadow-md">
           <h2 className="text-xl font-semibold text-red-600">No Items Available</h2>
           <p className="text-gray-600 mt-2">Please ask a counsellor to configure the items in the admin panel.</p>
           <button onClick={() => onComplete(0)} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md">
               {content[lang].back}
           </button>
       </div>
   );
 }
  
  const allSorted = items.length === 0;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => onComplete(calculateScore())} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors">
            &larr; {content[lang].back}
        </button>
        <div className="text-lg font-semibold text-gray-600">{studentInfo?.name}</div>
      </div>
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">{content[lang].title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Unsorted Items */}
        <div className="p-4 bg-white rounded-lg shadow-md border-2 border-gray-200">
          <h2 className="text-xl font-bold text-gray-700 text-center mb-4">{content[lang].unsorted}</h2>
          <div className="space-y-3 min-h-[300px] p-2 bg-gray-50 rounded-md">
            {items.map(item => (
              <div 
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item)}
                onDragEnd={() => setDraggedItem(null)}
                className="p-3 bg-white rounded-md shadow-sm cursor-grab active:cursor-grabbing border border-gray-200 text-gray-700"
                dir="auto"
              >
                {item.text[lang]}
              </div>
            ))}
          </div>
        </div>

        {/* Drop Zones */}
        <div 
          onDrop={() => handleDrop('booster')} 
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDraggingOver('booster')}
          onDragLeave={() => setIsDraggingOver(null)}
          className={`p-4 rounded-lg border-4 border-dashed transition-colors ${isDraggingOver === 'booster' ? 'bg-emerald-100 border-emerald-400' : 'bg-emerald-50 border-emerald-200'}`}
        >
          <h2 className="text-xl font-bold text-emerald-800 text-center mb-4">{content[lang].boosters}</h2>
          <div className="space-y-3 min-h-[300px]">
             {boosters.map(item => <div key={item.id} className="p-3 bg-white rounded-md shadow-sm border border-gray-200" dir="auto">{item.text[lang]}</div>)}
          </div>
        </div>
        <div 
          onDrop={() => handleDrop('waster')} 
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDraggingOver('waster')}
          onDragLeave={() => setIsDraggingOver(null)}
          className={`p-4 rounded-lg border-4 border-dashed transition-colors ${isDraggingOver === 'waster' ? 'bg-red-100 border-red-400' : 'bg-red-50 border-red-200'}`}
        >
          <h2 className="text-xl font-bold text-red-800 text-center mb-4">{content[lang].wasters}</h2>
          <div className="space-y-3 min-h-[300px]">
             {wasters.map(item => <div key={item.id} className="p-3 bg-white rounded-md shadow-sm border border-gray-200" dir="auto">{item.text[lang]}</div>)}
          </div>
        </div>
      </div>
      
      {allSorted && (
         <div className="text-center mt-10 animate-fade-in">
           <button onClick={() => onComplete(calculateScore())} className="p-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md text-lg transform hover:scale-105 transition-transform">
             {content[lang].finish}
           </button>
         </div>
      )}
    </div>
  );
};

export default TimeSorter;