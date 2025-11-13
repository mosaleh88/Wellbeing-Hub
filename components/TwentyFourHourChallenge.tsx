
import React, { useState } from 'react';
import type { StudentInfo, ChallengeActivity, TwentyFourHourChallengeResult } from '../types';

interface Props {
  activities: ChallengeActivity[];
  onComplete: (result: TwentyFourHourChallengeResult) => void;
  lang: 'en' | 'ar';
  studentInfo?: StudentInfo;
}

type PlannerMode = 'current' | 'ideal';

const TwentyFourHourChallenge: React.FC<Props> = ({ activities, onComplete, lang, studentInfo }) => {
  const [mode, setMode] = useState<PlannerMode>('current');
  const [currentDay, setCurrentDay] = useState<(string | null)[]>(Array(24).fill(null));
  const [idealDay, setIdealDay] = useState<(string | null)[]>(Array(24).fill(null));
  const [draggedActivityId, setDraggedActivityId] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<number | null>(null);

  const plannerState = mode === 'current' ? currentDay : idealDay;
  const setPlannerState = mode === 'current' ? setCurrentDay : setIdealDay;
  
  const content = {
    en: {
      title: "The 24-Hour Challenge",
      instructions: "Drag activities to plan your day. How do you spend your time now vs. during exams?",
      currentDay: "My Current Day",
      idealDay: "My Ideal Exam Day",
      hoursFilled: "Hours Planned",
      back: "Back to Activities",
      finish: "Finish Challenge",
      clear: "Clear",
      remove: "Remove",
    },
    ar: {
      title: "تحدي الـ 24 ساعة",
      instructions: "اسحب الأنشطة لتخطيط يومك. كيف تقضي وقتك الآن مقارنة بوقت الاختبارات؟",
      currentDay: "يومي الحالي",
      idealDay: "يومي المثالي للاختبارات",
      hoursFilled: "الساعات المخططة",
      back: "العودة إلى الأنشطة",
      finish: "إنهاء التحدي",
      clear: "مسح",
      remove: "إزالة",
    }
  };

  const handleDragStart = (activityId: string) => {
    setDraggedActivityId(activityId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, hour: number) => {
    e.preventDefault();
    if (isDraggingOver !== hour) {
        setIsDraggingOver(hour);
    }
  };
  
  const handleDragLeave = () => {
    setIsDraggingOver(null);
  }

  const handleDrop = (hour: number) => {
    if (draggedActivityId) {
      const newPlanner = [...plannerState];
      newPlanner[hour] = draggedActivityId;
      setPlannerState(newPlanner);
    }
    setDraggedActivityId(null);
    setIsDraggingOver(null);
  };
  
  const handleRemoveHour = (hour: number) => {
     const newPlanner = [...plannerState];
     newPlanner[hour] = null;
     setPlannerState(newPlanner);
  }
  
  const handleClearPlanner = () => {
    setPlannerState(Array(24).fill(null));
  }

  const hoursFilled = plannerState.filter(Boolean).length;

  if (!activities || activities.length === 0) {
     return (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-red-600">No Activities Available</h2>
            <p className="text-gray-600 mt-2">Please ask a counsellor to configure the activities in the admin panel.</p>
            <button onClick={() => onComplete({ currentDay, idealDay })} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md">
                {content[lang].back}
            </button>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gradient-to-br from-sky-50 to-indigo-100 rounded-2xl shadow-lg">
       <div className="flex justify-between items-center mb-4">
        <button onClick={() => onComplete({ currentDay, idealDay })} className="bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-lg shadow-sm border border-gray-200">
            &larr; {content[lang].back}
        </button>
        <div className="text-lg font-semibold text-gray-600">{studentInfo?.name}</div>
      </div>
      <div className="text-center mb-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">{content[lang].title}</h1>
        <p className="mt-2 text-md sm:text-lg text-gray-600 max-w-2xl mx-auto">{content[lang].instructions}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Draggable Activities Panel */}
        <div className="lg:w-1/4">
            <div className="p-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-md border border-gray-200">
                 <div className="grid grid-cols-2 gap-3">
                     {activities.map(activity => (
                        <div key={activity.id} draggable onDragStart={() => handleDragStart(activity.id)}
                            className={`p-3 rounded-lg flex flex-col items-center justify-center text-center cursor-grab text-white shadow-md hover:scale-105 transition-transform ${activity.color}`}>
                            <div className="text-2xl">{activity.icon}</div>
                            <div className="text-xs font-bold">{activity.name[lang]}</div>
                        </div>
                     ))}
                 </div>
            </div>
            <div className="text-center mt-6">
              <button onClick={() => onComplete({ currentDay, idealDay })} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg text-lg transition-transform hover:scale-105">
                {content[lang].finish}
              </button>
            </div>
        </div>

        {/* Planner Panel */}
        <div className="flex-1">
          <div className="p-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-md border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <div className="flex bg-gray-200 p-1 rounded-full">
                    <button onClick={() => setMode('current')} className={`px-4 sm:px-6 py-2 rounded-full font-semibold transition-colors ${mode === 'current' ? 'bg-indigo-500 text-white shadow' : 'text-gray-600 hover:bg-white/50'}`}>
                        {content[lang].currentDay}
                    </button>
                    <button onClick={() => setMode('ideal')} className={`px-4 sm:px-6 py-2 rounded-full font-semibold transition-colors ${mode === 'ideal' ? 'bg-sky-500 text-white shadow' : 'text-gray-600 hover:bg-white/50'}`}>
                        {content[lang].idealDay}
                    </button>
                </div>
                <div className="text-center">
                    <div className="font-bold text-xl text-gray-800">{hoursFilled} / 24</div>
                    <div className="text-sm text-gray-600">{content[lang].hoursFilled}</div>
                </div>
                 <button onClick={handleClearPlanner} className="text-sm text-red-500 hover:text-red-700 font-semibold">
                    {content[lang].clear}
                </button>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {Array.from({ length: 24 }).map((_, hour) => {
                    const activityId = plannerState[hour];
                    const activity = activityId ? activities.find(a => a.id === activityId) : null;
                    return (
                        <div key={hour}
                            onDragOver={(e) => handleDragOver(e, hour)}
                            onDragLeave={handleDragLeave}
                            onDrop={() => handleDrop(hour)}
                            className={`relative h-24 rounded-lg flex flex-col items-center justify-center p-1 text-center transition-all duration-200 
                                ${activity ? `${activity.color} text-white shadow-md` : `bg-gray-200 hover:bg-gray-300`}
                                ${isDraggingOver === hour ? 'scale-110 ring-4 ring-indigo-400 z-10' : ''}
                            `}>
                            <div className={`absolute top-1 left-2 text-xs font-bold ${activity ? 'opacity-70' : 'text-gray-500'}`}>{hour}:00</div>
                             {activity ? (
                                <>
                                    <div className="text-3xl">{activity.icon}</div>
                                    <div className="text-xs font-semibold">{activity.name[lang]}</div>
                                    <button onClick={() => handleRemoveHour(hour)} className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full h-5 w-5 flex items-center justify-center text-xs shadow-md font-bold">&times;</button>
                                </>
                             ) : (
                                <div className="text-2xl text-gray-400">+</div>
                             )}
                        </div>
                    );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwentyFourHourChallenge;
