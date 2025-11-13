import React, { useState } from 'react';
import type { MoodBoardSelection, MoodBoardIcon, LocalizedString, StudentInfo } from '../types';

interface Props {
  icons: MoodBoardIcon[];
  onComplete: (selections: MoodBoardSelection[]) => void;
  lang: 'en' | 'ar';
  studentInfo?: StudentInfo;
}

const MoodBoard: React.FC<Props> = ({ icons, onComplete, lang, studentInfo }) => {
  const [selections, setSelections] = useState<MoodBoardSelection[]>([]);
  const [currentReason, setCurrentReason] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<{icon: string, label: LocalizedString} | null>(null);

  const handleIconClick = (icon: MoodBoardIcon) => {
    setSelectedIcon({icon: icon.icon, label: icon.label});
    setCurrentReason('');
  }

  const handleAddSelection = () => {
    if (selectedIcon && currentReason.trim()) {
      setSelections([...selections, { ...selectedIcon, reason: currentReason }]);
      setSelectedIcon(null);
      setCurrentReason('');
    }
  }
  
  const content = {
      en: { title: "How are you feeling?", subtitle: "Select an icon and share a bit about why.", placeholder: "I'm feeling this way because...", add: "Add to Board", finish: "Finish & Save Board", back: "Back to Activities", welcome: "Player" },
      ar: { title: "كيف تشعر؟", subtitle: "اختر رمزًا وشارك قليلاً عن السبب.", placeholder: "أشعر بهذا الشعور لأن...", add: "أضف إلى اللوحة", finish: "إنهاء وحفظ اللوحة", back: "العودة إلى الأنشطة", welcome: "لاعب" }
  };
  
  if (!icons || icons.length === 0) {
     return (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-red-600">No Icons Available</h2>
            <p className="text-gray-600 mt-2">Please ask a counsellor to configure the mood icons in the admin panel.</p>
            <button onClick={() => onComplete([])} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md">
                {content[lang].back}
            </button>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
       <div className="flex justify-between items-center mb-6">
          <button onClick={() => onComplete(selections)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors">
              &larr; {content[lang].back}
          </button>
          <div className="text-lg font-semibold text-gray-600">{content[lang].welcome}: {studentInfo?.name}</div>
      </div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">{content[lang].title}</h1>
        <p className="text-lg text-gray-600 mt-2">{content[lang].subtitle}</p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 mb-8 p-4 bg-gray-100 rounded-xl">
        {icons.map(item => (
          <button 
            key={item.id} 
            onClick={() => handleIconClick(item)} 
            className={`p-2 rounded-full transition-all transform hover:scale-110 duration-200 ${selectedIcon?.icon === item.icon ? 'bg-indigo-200 ring-4 ring-indigo-400' : 'bg-white'}`}
            aria-label={item.label[lang]}
          >
            <span className="text-4xl sm:text-5xl">{item.icon}</span>
          </button>
        ))}
      </div>

      {selectedIcon && (
        <div className="p-6 bg-white rounded-2xl shadow-lg animate-fade-in border border-gray-200 mb-8">
            <div className="text-center">
                <span className="text-6xl">{selectedIcon.icon}</span>
                <p className="text-xl font-semibold text-gray-800 mt-2">{selectedIcon.label[lang]}</p>
            </div>
            <textarea
              value={currentReason}
              onChange={(e) => setCurrentReason(e.target.value)}
              placeholder={content[lang].placeholder}
              className="w-full mt-4 p-3 border-2 border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
              dir="auto"
            />
            <div className="text-center">
                <button onClick={handleAddSelection} disabled={!currentReason.trim()} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-gray-400">
                    {content[lang].add}
                </button>
            </div>
        </div>
      )}
      
      {selections.length > 0 && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selections.map((sel, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{sel.icon}</span>
                    <span className="text-lg font-semibold text-gray-800">{sel.label[lang]}</span>
                </div>
                <p className="text-sm text-gray-600 italic" dir="auto">"{sel.reason}"</p>
              </div>
            ))}
          </div>
            <div className="text-center mt-8">
                <button onClick={() => onComplete(selections)} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-md">
                    {content[lang].finish}
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default MoodBoard;