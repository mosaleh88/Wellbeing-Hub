import React, { useState } from 'react';
import type { StudentInfo, FuturePathNode } from '../types';

interface Props {
  nodes: FuturePathNode[];
  onComplete: (path: string) => void;
  lang: 'en' | 'ar';
  studentInfo?: StudentInfo;
}

const FuturePathVisualizer: React.FC<Props> = ({ nodes, onComplete, lang, studentInfo }) => {
  const [currentNodeId, setCurrentNodeId] = useState('START');

  const content = {
      en: { title: "Path Explorer", back: "Back to Activities", finish: "Finish & Save Path", restart: "Explore Again", welcome: "Player" },
      ar: { title: "مستكشف المسارات", back: "العودة إلى الأنشطة", finish: "إنهاء وحفظ المسار", restart: "استكشف مرة أخرى", welcome: "لاعب" }
  };
  
  if (!nodes || nodes.length === 0 || !nodes.find(n => n.id === 'START')) {
     return (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-red-600">No Paths Available</h2>
            <p className="text-gray-600 mt-2">Please ask a counsellor to configure the paths in the admin panel, ensuring a 'START' node exists.</p>
            <button onClick={() => onComplete('')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md">
                {content[lang].back}
            </button>
        </div>
    );
  }

  const currentNode = nodes.find(node => node.id === currentNodeId);

  const handleChoice = (nextId: string) => {
    setCurrentNodeId(nextId);
  };
  
  const handleComplete = () => {
    if (currentNode) {
      onComplete(currentNode.text[lang]);
    }
  }
  
  const handleRestart = () => {
    setCurrentNodeId('START');
  }

  if (!currentNode) {
     return <div>Error: Node "{currentNodeId}" not found. Check admin configuration. The START node must exist.</div>
  }

  const isOutcomeNode = currentNode.type === 'outcome';

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="flex justify-between items-center mb-6">
         <button onClick={handleComplete} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors">
              &larr; {content[lang].back}
          </button>
        <div className="text-lg font-semibold text-gray-600">{studentInfo?.name}</div>
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">{content[lang].title}</h1>

      <div className={`p-8 rounded-2xl shadow-xl min-h-[400px] flex flex-col justify-center items-center transition-all duration-500 border-2 ${isOutcomeNode ? 'bg-gradient-to-br from-emerald-400 to-indigo-500 border-transparent' : 'bg-white border-gray-200'}`}>
        <div className={`text-7xl mb-4 transition-transform duration-500 ${isOutcomeNode ? 'scale-110' : ''}`}>{currentNode.icon}</div>
        <h2 className={`text-2xl font-bold mb-2 ${isOutcomeNode ? 'text-white animate-pulse' : 'text-gray-800'}`}>{currentNode.text[lang]}</h2>
        
        {isOutcomeNode && currentNode.message && (
            <p className="text-white mt-2 max-w-md" dir="auto">{currentNode.message[lang]}</p>
        )}

        {!isOutcomeNode && (
          <div className="mt-6 flex flex-col w-full max-w-sm gap-3">
            {currentNode.choices?.map((choice, index) => (
              <button 
                key={index}
                onClick={() => handleChoice(choice.nextId)}
                className="w-full p-4 bg-white hover:bg-gray-100 border-2 border-gray-300 text-gray-800 font-semibold rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105"
                dir="auto"
              >
                {choice.text[lang]}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {isOutcomeNode && (
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
           <button onClick={handleRestart} className="p-4 bg-white border-2 border-indigo-500 text-indigo-500 font-bold rounded-lg text-lg hover:bg-indigo-50 transition-colors">
            {content[lang].restart}
          </button>
           <button onClick={handleComplete} className="p-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md text-lg">
            {content[lang].finish}
          </button>
        </div>
      )}
    </div>
  );
};

export default FuturePathVisualizer;