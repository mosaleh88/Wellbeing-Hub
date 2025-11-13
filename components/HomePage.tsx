
import React from 'react';
import type { ActivityId, LocalizedString, StudentData } from '../types';

interface Props {
  onStart?: () => void;
  onViewAdmin?: () => void;
  onSelectActivity?: (activityId: ActivityId) => void;
  onFinish?: () => void;
  lang: 'en' | 'ar';
  studentData?: StudentData | null;
  isActivityHub?: boolean;
}

const activities: { id: ActivityId; title: LocalizedString; description: LocalizedString; icon: string; }[] = [
    { id: 'memory', title: { en: 'Reflection Match', ar: 'تطابق التأمل' }, description: { en: 'Match pairs to reveal thoughtful prompts.', ar: 'طابق الأزواج للكشف عن أسئلة تأملية.' }, icon: '🧠' },
    { id: 'quiz', title: { en: 'Wellbeing Quiz', ar: 'اختبار السلامة النفسية' }, description: { en: 'Explore key concepts for a healthy mindset.', ar: 'استكشف المفاهيم الأساسية لعقلية صحية.' }, icon: '❓' },
    { id: 'mood', title: { en: 'Mood Board', ar: 'لوحة المزاج' }, description: { en: 'A space to check in with your feelings.', ar: 'مساحة للتحقق من مشاعرك.' }, icon: '😊' },
    { id: 'decision', title: { en: 'Choice Navigator', ar: 'مستكشف الخيارات' }, description: { en: 'Navigate scenarios about daily challenges.', ar: 'تنقل في سيناريوهات حول التحديات اليومية.' }, icon: '🧭' },
    { id: 'habit', title: { en: 'Habit Builder', ar: 'باني العادات' }, description: { en: 'Commit to a new positive wellbeing habit.', ar: 'التزم بعادة إيجابية جديدة لصحتك النفسية.' }, icon: '🌱' },
    { id: 'future', title: { en: 'Path Explorer', ar: 'مستكشف المسارات' }, description: { en: 'Explore future paths based on your passions.', ar: 'استكشف المسارات المستقبلية بناءً على شغفك.' }, icon: '🚀' },
    { id: 'time', title: { en: 'Energy Sorter', ar: 'مصنف الطاقة' }, description: { en: 'Sort activities that boost or drain you.', ar: 'صنف الأنشطة التي تعزز طاقتك أو تستنزفها.' }, icon: '⏳' },
    { id: 'twentyFourHourChallenge', title: { en: '24-Hour Challenge', ar: 'تحدي الـ 24 ساعة' }, description: { en: 'Plan your ideal day for focus and balance.', ar: 'خطط ليومك المثالي للتركيز والتوازن.' }, icon: '🗓️' },
    { id: 'mindSnake', title: { en: 'Mind Snake', ar: 'ثعبان العقل' }, description: { en: 'Answer reflective questions to grow.', ar: 'أجب عن الأسئلة التأملية لتنمو.' }, icon: '🐍' },
    { id: 'goalRacer', title: { en: 'Goal Racer', ar: 'متسابق الأهداف' }, description: { en: 'Race towards goals with mindful pit stops.', ar: 'تسابق نحو الأهداف مع محطات تأمل واعية.' }, icon: '🏎️' },
    { id: 'runOfChoices', title: { en: 'Focus Runner', ar: 'عداء التركيز' }, description: { en: 'Dodge distractions and collect focus points.', ar: 'تفادى المشتتات واجمع نقاط التركيز.' }, icon: '🏃‍♂️' },
    { id: 'studyPlanner', title: { en: 'Study Planner', ar: 'مخطط الدراسة' }, description: { en: 'Build a mindful study schedule for exams.', ar: 'أنشئ جدول دراسة واعيًا للاختبارات.' }, icon: '📅' },
];

const hasCompleted = (activityId: ActivityId, studentData: StudentData | null | undefined): boolean => {
    if (!studentData) return false;
    switch (activityId) {
        case 'quiz': return !!studentData.quizAnswers && studentData.quizAnswers.length > 0;
        case 'mood': return !!studentData.moodBoard && studentData.moodBoard.length > 0;
        case 'memory': return typeof studentData.gameMoves === 'number';
        case 'decision': return !!studentData.decisionPath && studentData.decisionPath.length > 0;
        case 'habit': return typeof studentData.habitProgress === 'number';
        case 'future': return !!studentData.futurePath;
        case 'time': return typeof studentData.timeSorterScore === 'number';
        case 'mindSnake': return !!studentData.mindSnakeResult;
        case 'goalRacer': return !!studentData.goalRacerResult;
        case 'runOfChoices': return !!studentData.runOfChoicesResult;
        case 'studyPlanner': return !!studentData.studyPlannerResult;
        case 'twentyFourHourChallenge': return !!studentData.twentyFourHourChallengeResult;
        default: return false;
    }
}

const HomePage: React.FC<Props> = ({ onStart, onViewAdmin, onSelectActivity, onFinish, lang, studentData, isActivityHub }) => {
  const content = {
    en: {
      title: "Student Wellbeing Hub",
      subtitle: "Engaging activities to foster reflection and growth.",
      startBtn: "Begin Your Session",
      adminBtn: "Counselor View",
      welcomeBack: "Welcome back",
      activitiesTitle: "Choose an Activity to Explore",
      finishBtn: "Finish Session & View Report"
    },
    ar: {
      title: "مركز السلامة النفسية للطالب",
      subtitle: "أنشطة تفاعلية لتعزيز التأمل والنمو.",
      startBtn: "ابدأ جلستك",
      adminBtn: "عرض المرشد",
      welcomeBack: "أهلاً بعودتك",
      activitiesTitle: "اختر نشاطًا لاستكشافه",
      finishBtn: "إنهاء الجلسة وعرض التقرير"
    }
  };

  if (!isActivityHub) {
    return (
      <div className="text-center flex flex-col items-center justify-center min-h-[80vh]">
        <div className="bg-white/50 backdrop-blur-sm p-8 rounded-full mb-6">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-emerald-500">
            {content[lang].title}
          </h1>
        </div>
        <p className="mt-4 text-xl text-gray-600 max-w-2xl">{content[lang].subtitle}</p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button onClick={onStart} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                {content[lang].startBtn}
            </button>
            <button onClick={onViewAdmin} className="bg-transparent border-2 border-gray-400 text-gray-600 font-bold py-4 px-10 rounded-lg text-lg transition-all duration-300 hover:bg-gray-600 hover:text-white hover:border-gray-600">
                {content[lang].adminBtn}
            </button>
        </div>
      </div>
    );
  }

  return (
     <div>
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800">{content[lang].welcomeBack}, {studentData?.studentInfo.name}!</h1>
            <p className="mt-2 text-xl text-gray-600">{content[lang].activitiesTitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map(activity => {
                const isCompleted = hasCompleted(activity.id, studentData);
                return (
                    <button 
                        key={activity.id} 
                        onClick={() => onSelectActivity && onSelectActivity(activity.id)}
                        className={`relative p-6 bg-white rounded-2xl text-center shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border-2 ${isCompleted ? 'border-emerald-400' : 'border-transparent'}`}
                    >
                        {isCompleted && (
                            <div className="absolute top-3 right-3 bg-emerald-100 text-emerald-600 rounded-full h-7 w-7 flex items-center justify-center text-sm font-bold shadow-sm">✓</div>
                        )}
                        <div className="text-6xl mb-4">{activity.icon}</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{activity.title[lang]}</h3>
                        <p className="text-sm text-gray-500">{activity.description[lang]}</p>
                    </button>
                )
            })}
        </div>
        <div className="text-center mt-12">
            <button onClick={onFinish} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-10 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 shadow-xl">
                 {content[lang].finishBtn}
            </button>
        </div>
     </div>
  );
};

export default HomePage;