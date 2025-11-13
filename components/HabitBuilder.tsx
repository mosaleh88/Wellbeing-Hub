import React, { useState } from 'react';
import type { StudentInfo, Habit } from '../types';

interface Props {
  challenges: Habit[];
  onComplete: (progress: number) => void;
  lang: 'en' | 'ar';
  studentInfo?: StudentInfo;
}

const HabitBuilder: React.FC<Props> = ({ challenges, onComplete, lang, studentInfo }) => {
  const [habitIndex, setHabitIndex] = useState(0);
  const [completedDays, setCompletedDays] = useState(0);

  const habit = challenges[habitIndex];

  const content = {
      en: { title: "Wellbeing Habit Builder", back: "Back to Activities", complete: "I'm Done!", welcome: "Player", nextHabit: "Try Another Habit" },
      ar: { title: "باني عادات السلامة النفسية", back: "العودة إلى الأنشطة", complete: "لقد انتهيت!", welcome: "لاعب", nextHabit: "جرب عادة أخرى" }
  };
  
  if (!challenges || challenges.length === 0) {
    return (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-red-600">No Habits Available</h2>
            <p className="text-gray-600 mt-2">Please ask a counsellor to configure the habits in the admin panel.</p>
            <button onClick={() => onComplete(0)} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md">
                {content[lang].back}
            </button>
        </div>
    );
  }

  const toggleDay = (dayIndex: number) => {
    if (dayIndex === completedDays) {
      setCompletedDays(completedDays + 1);
    } else if (dayIndex === completedDays - 1) {
      setCompletedDays(completedDays - 1);
    }
  };

  const changeHabit = () => {
    setHabitIndex((prevIndex) => (prevIndex + 1) % challenges.length);
    setCompletedDays(0);
  }

  return (
    <div className="max-w-3xl mx-auto text-center">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => onComplete(completedDays)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors">
            &larr; {content[lang].back}
        </button>
        <div className="text-lg font-semibold text-gray-600">{studentInfo?.name}</div>
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">{content[lang].title}</h1>
      <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200 mt-6">
        <p className="text-xl text-indigo-700 font-semibold mb-6" dir="auto">{habit.prompt[lang]}</p>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: habit.days }).map((_, index) => (
            <button
              key={index}
              onClick={() => toggleDay(index)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white transition-all duration-200
                ${index < completedDays ? 'bg-emerald-500 transform scale-110' : 'bg-gray-300'}
                ${index === completedDays ? 'cursor-pointer hover:bg-emerald-400' : ''}
                ${index === completedDays - 1 ? 'cursor-pointer hover:bg-gray-400' : ''}
                ${index !== completedDays && index !== completedDays -1 ? 'cursor-default' : ''}
              `}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      
       <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
           <button onClick={changeHabit} className="bg-white border-2 border-indigo-500 text-indigo-500 font-bold py-3 px-6 rounded-lg hover:bg-indigo-50 transition-colors">
             {content[lang].nextHabit}
           </button>
           <button 
            onClick={() => onComplete(completedDays)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-md text-lg"
          >
            {content[lang].complete}
          </button>
        </div>
    </div>
  );
};

export default HabitBuilder;