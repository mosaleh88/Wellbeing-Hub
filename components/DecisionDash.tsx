import React, { useState } from 'react';
import type { StudentInfo, DecisionDashScenarioNode } from '../types';

interface Props {
  scenarios: DecisionDashScenarioNode[];
  onComplete: (path: string[]) => void;
  lang: 'en' | 'ar';
  studentInfo?: StudentInfo;
}

const DecisionDash: React.FC<Props> = ({ scenarios, onComplete, lang, studentInfo }) => {
  const [currentNodeId, setCurrentNodeId] = useState('START');
  const [path, setPath] = useState<string[]>(['START']);
  
  const content = {
      en: { title: "Choice Navigator", back: "Back to Activities", finish: "Finish Activity", welcome: "Player" },
      ar: { title: "مستكشف الخيارات", back: "العودة إلى الأنشطة", finish: "إنهاء النشاط", welcome: "لاعب" }
  };

  const currentNode = scenarios.find(node => node.id === currentNodeId);

  const handleChoice = (nextId: string) => {
    const newPath = [...path, nextId];
    setPath(newPath);
    setCurrentNodeId(nextId);
  };

  if (!scenarios || scenarios.length === 0 || !scenarios.find(s => s.id === 'START')) {
     return (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-red-600">No Scenarios Available</h2>
            <p className="text-gray-600 mt-2">Please ask a counsellor to configure the scenarios in the admin panel, ensuring a 'START' node exists.</p>
            <button onClick={() => onComplete(path)} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md">
                {content[lang].back}
            </button>
        </div>
    );
  }

  if (!currentNode) {
     return <div>Error: Scenario node "{currentNodeId}" not found. Check admin configuration.</div>
  }
  
  const isEndNode = currentNode.choices.length === 0;

  return (
    <div className="max-w-xl mx-auto text-center">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => onComplete(path)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors">
            &larr; {content[lang].back}
        </button>
        <div className="text-lg font-semibold text-gray-600">{studentInfo?.name}</div>
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-6">{content[lang].title}</h1>
      
      <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200 min-h-[300px] flex flex-col justify-center items-center">
        <div className="text-7xl mb-4">{currentNode.icon}</div>
        <p className="text-lg text-gray-700 font-medium" dir="auto">{currentNode.text[lang]}</p>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {!isEndNode ? currentNode.choices.map((choice, index) => (
          <button 
            key={index}
            onClick={() => handleChoice(choice.nextId)}
            className="p-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105"
            dir="auto"
          >
            {choice.text[lang]}
          </button>
        )) : (
            <div className="sm:col-span-2 mt-4">
               <button 
                onClick={() => onComplete(path)}
                className="p-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-md transition-transform transform hover:scale-105 text-lg"
              >
                {content[lang].finish}
              </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default DecisionDash;