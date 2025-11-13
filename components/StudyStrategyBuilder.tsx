import React, { useState, useMemo } from 'react';
import type { StudentInfo, StudyPlannerInput, StudyPlannerResult, StudySubject, StudyQuote, StudyTime } from '../types';

interface Props {
  subjects: StudySubject[];
  quotes: StudyQuote[];
  onComplete: (result: StudyPlannerResult) => void;
  lang: 'en' | 'ar';
  studentInfo?: StudentInfo;
}

type PlannerStep = 'subjects' | 'habits' | 'schedule' | 'plan';
type GeneratedPlan = (({ type: 'study'; subject: StudySubject } | { type: 'break' }) | null)[][];

const StudyStrategyBuilder: React.FC<Props> = ({ subjects, quotes, onComplete, lang, studentInfo }) => {
  const [step, setStep] = useState<PlannerStep>('subjects');
  const [plannerInput, setPlannerInput] = useState<StudyPlannerInput>({
    subjects: [],
    focusDuration: 45,
    studyTimes: ['afternoon'],
    examDays: 14,
  });
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);

  const content = {
    en: {
      title: "Study Strategy Builder",
      back: "Back",
      next: "Next",
      generate: "Generate My Plan!",
      finish: "Finish & Save Plan",
      // Steps
      step1: "Your Subjects",
      step1_desc: "First, tell us what you're studying for.",
      step2: "Your Study Style",
      step2_desc: "How do you study best?",
      step3: "Your Timeline",
      step3_desc: "When are your exams?",
      // Form Labels
      selectSubjects: "Which subjects do you need to study for?",
      difficulty: "Difficulty",
      goal: "My goal is to...",
      goals: ["Pass", "Improve Grade", "Master Topic"],
      focus: "I can focus for about",
      minutes: "minutes.",
      bestTime: "I study best in the...",
      times: { morning: "Morning ☀️", afternoon: "Afternoon 🏙️", evening: "Evening 🌆" },
      examDays: "My first exam is in",
      days: "days.",
      // Plan View
      planTitle: "Your Personalized Study Plan",
      planDesc: "Here's a balanced schedule to help you prepare. You can do it!",
      motivation: "A little motivation for you:",
      break: "Break! ☕️",
      daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    },
    ar: {
      title: "منشئ استراتيجية الدراسة",
      back: "رجوع",
      next: "التالي",
      generate: "أنشئ خطتي!",
      finish: "إنهاء وحفظ الخطة",
      // Steps
      step1: "موادك الدراسية",
      step1_desc: "أولاً، أخبرنا بما تدرسه.",
      step2: "أسلوب دراستك",
      step2_desc: "كيف تدرس بأفضل شكل؟",
      step3: "جدولك الزمني",
      step3_desc: "متى اختباراتك؟",
      // Form Labels
      selectSubjects: "ما هي المواد التي تحتاج لدراستها؟",
      difficulty: "الصعوبة",
      goal: "هدفي هو...",
      goals: ["النجاح", "تحسين الدرجة", "إتقان المادة"],
      focus: "أستطيع التركيز لمدة",
      minutes: "دقيقة.",
      bestTime: "أدرس بشكل أفضل في...",
      times: { morning: "الصباح ☀️", afternoon: "بعد الظهر 🏙️", evening: "المساء 🌆" },
      examDays: "أول اختبار لي بعد",
      days: "أيام.",
      // Plan View
      planTitle: "خطة دراستك المخصصة",
      planDesc: "إليك جدول متوازن لمساعدتك على الاستعداد. أنت تستطيع!",
      motivation: "القليل من التحفيز لك:",
      break: "استراحة! ☕️",
      daysOfWeek: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
    }
  };
  
  const handleSubjectToggle = (subjectId: string) => {
    setPlannerInput(prev => {
      const isSelected = prev.subjects.some(s => s.subjectId === subjectId);
      if (isSelected) {
        return { ...prev, subjects: prev.subjects.filter(s => s.subjectId !== subjectId) };
      } else {
        return { ...prev, subjects: [...prev.subjects, { subjectId, difficulty: 5, goal: content.en.goals[0] }] };
      }
    });
  };

  const handleSubjectDetailChange = (subjectId: string, field: 'difficulty' | 'goal', value: number | string) => {
    setPlannerInput(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => s.subjectId === subjectId ? { ...s, [field]: value } : s),
    }));
  };

  const handleStudyTimeToggle = (time: StudyTime) => {
    setPlannerInput(prev => {
        const newTimes = prev.studyTimes.includes(time)
            ? prev.studyTimes.filter(t => t !== time)
            : [...prev.studyTimes, time];
        // Ensure at least one time is selected
        return { ...prev, studyTimes: newTimes.length > 0 ? newTimes : prev.studyTimes };
    });
  }
  
  const generatePlan = () => {
    const goalMultipliers: { [key: string]: number } = { [content.en.goals[0]]: 1, [content.en.goals[1]]: 1.5, [content.en.goals[2]]: 2 };
    
    // 1. Create a weighted list of study sessions needed
    const studyQueue = plannerInput.subjects.flatMap(s => {
      const subject = subjects.find(sub => sub.id === s.subjectId);
      if (!subject) return [];
      const weight = s.difficulty * (goalMultipliers[s.goal] || 1);
      return Array(Math.ceil(weight)).fill({ type: 'study', subject });
    }).sort(() => Math.random() - 0.5); // Shuffle for variety

    // 2. Define available slots
    const slotsPerDay = plannerInput.studyTimes.length;
    if (slotsPerDay === 0 || studyQueue.length === 0) {
        setGeneratedPlan(Array(1).fill(Array(7).fill(null)));
        setStep('plan');
        return;
    }

    // 3. Create the schedule grid
    const totalSlots = slotsPerDay * 7;
    const plan: GeneratedPlan = Array(slotsPerDay).fill(0).map(() => Array(7).fill(null));
    let queueIndex = 0;
    let sessionCounter = 0;

    for (let day = 0; day < 7; day++) {
      for (let slot = 0; slot < slotsPerDay; slot++) {
        // Insert a break every 2 sessions or if near the end of the queue
        if (sessionCounter > 0 && (sessionCounter % 2 === 0 || queueIndex >= studyQueue.length)) {
          plan[slot][day] = { type: 'break' };
          sessionCounter = 0;
          continue;
        }

        if (queueIndex < studyQueue.length) {
          plan[slot][day] = studyQueue[queueIndex];
          queueIndex++;
          sessionCounter++;
        }
      }
    }
    
    setGeneratedPlan(plan);
    setStep('plan');
  };

  const randomQuote = useMemo(() => {
    if (quotes.length === 0) return { text: { en: "You got this!", ar: "أنت تستطيع!" } };
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, [quotes]);
  
  const renderForm = () => {
    switch(step) {
      case 'subjects':
        return (
          <div className="animate-fade-in">
            <h3 className="text-2xl font-bold mb-1 text-[#458489]">{content[lang].step1}</h3>
            <p className="text-[#5c7078] mb-6">{content[lang].step1_desc}</p>
            <div className="mb-4">
              <label className="font-semibold block mb-3">{content[lang].selectSubjects}</label>
              <div className="flex flex-wrap gap-3">
                {subjects.map(s => (
                  <button key={s.id} onClick={() => handleSubjectToggle(s.id)} 
                    className={`px-4 py-2 rounded-full border-2 transition-colors ${plannerInput.subjects.some(ps => ps.subjectId === s.id) ? 'bg-[#458489] text-white border-transparent' : 'bg-transparent border-[#a0b2be] hover:bg-[#a0b2be]'}`}>
                    {s.icon} {s.name[lang]}
                  </button>
                ))}
              </div>
            </div>
            {plannerInput.subjects.map(selectedSub => {
              const subjectDetails = subjects.find(s => s.id === selectedSub.subjectId);
              if (!subjectDetails) return null;
              return (
                <div key={selectedSub.subjectId} className="p-4 bg-[#cfc6bb] rounded-lg mb-3">
                  <h4 className="font-bold text-lg">{subjectDetails.icon} {subjectDetails.name[lang]}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="text-sm font-medium">{content[lang].difficulty}: {selectedSub.difficulty}</label>
                      <input type="range" min="1" max="10" value={selectedSub.difficulty} 
                        onChange={e => handleSubjectDetailChange(selectedSub.subjectId, 'difficulty', parseInt(e.target.value))}
                        className="w-full h-2 bg-[#a0b2be] rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">{content[lang].goal}</label>
                      <select value={selectedSub.goal}
                         onChange={e => handleSubjectDetailChange(selectedSub.subjectId, 'goal', e.target.value)}
                         className="w-full p-2 mt-1 border rounded bg-white">
                         {content.en.goals.map((g, i) => <option key={g} value={g}>{content[lang].goals[i]}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        );
      case 'habits':
         return (
          <div className="animate-fade-in">
             <h3 className="text-2xl font-bold mb-1 text-[#458489]">{content[lang].step2}</h3>
             <p className="text-[#5c7078] mb-6">{content[lang].step2_desc}</p>
             <div className="p-4 bg-[#cfc6bb] rounded-lg mb-4">
                 <label className="font-semibold block">{content[lang].focus}</label>
                 <div className="flex items-center gap-4">
                   <input type="range" min="15" max="90" step="15" value={plannerInput.focusDuration}
                     onChange={e => setPlannerInput(p => ({...p, focusDuration: parseInt(e.target.value)}))}
                     className="w-full h-2 bg-[#a0b2be] rounded-lg appearance-none cursor-pointer" />
                   <span className="font-bold w-24 text-center">{plannerInput.focusDuration} {content[lang].minutes}</span>
                 </div>
             </div>
             <div className="p-4 bg-[#cfc6bb] rounded-lg">
                <label className="font-semibold block mb-3">{content[lang].bestTime}</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(Object.keys(content.en.times) as StudyTime[]).map(time => (
                        <button key={time} onClick={() => handleStudyTimeToggle(time)}
                          className={`p-4 rounded-lg border-2 transition-colors ${plannerInput.studyTimes.includes(time) ? 'bg-[#458489] text-white border-transparent' : 'bg-white border-gray-200 hover:bg-gray-100'}`}>
                          {content[lang].times[time]}
                        </button>
                    ))}
                </div>
             </div>
          </div>
        );
       case 'schedule':
         return (
          <div className="animate-fade-in">
             <h3 className="text-2xl font-bold mb-1 text-[#458489]">{content[lang].step3}</h3>
             <p className="text-[#5c7078] mb-6">{content[lang].step3_desc}</p>
              <div className="p-4 bg-[#cfc6bb] rounded-lg">
                <label className="font-semibold block">{content[lang].examDays}</label>
                 <div className="flex items-center gap-4 mt-2">
                   <input type="range" min="1" max="60" value={plannerInput.examDays}
                     onChange={e => setPlannerInput(p => ({...p, examDays: parseInt(e.target.value)}))}
                     className="w-full h-2 bg-[#a0b2be] rounded-lg appearance-none cursor-pointer" />
                   <span className="font-bold w-20 text-center">{plannerInput.examDays} {content[lang].days}</span>
                 </div>
             </div>
          </div>
        );
      default: return null;
    }
  }
  
  const renderPlan = () => {
    if (!generatedPlan) return <p>Generating your plan...</p>
    const timeSlots = plannerInput.studyTimes.map(time => content[lang].times[time].split(' ')[0]);

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-[#458489]">{content[lang].planTitle}</h1>
                <p className="text-[#5c7078] mt-1">{content[lang].planDesc}</p>
            </div>
            <div className="mb-6 p-4 bg-[#a0b2be] rounded-lg text-center text-white">
                <p className="font-semibold">{content[lang].motivation}</p>
                <p className="italic">"{randomQuote.text[lang]}"</p>
            </div>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-8 gap-1 min-w-[700px]">
                  {/* Header Row */}
                  <div className="font-bold p-2"></div>
                  {content[lang].daysOfWeek.map(day => <div key={day} className="font-bold text-center p-2 text-sm">{day}</div>)}
                  
                  {/* Data Rows */}
                  {timeSlots.map((slotLabel, slotIndex) => (
                      <React.Fragment key={slotIndex}>
                          <div className="font-bold p-2 text-sm whitespace-nowrap">{slotLabel}</div>
                          {generatedPlan[slotIndex].map((cell, dayIndex) => (
                            <div key={`${slotIndex}-${dayIndex}`} 
                              className={`p-2 rounded-md min-h-[80px] text-xs flex flex-col items-center justify-center text-center
                                ${!cell ? 'bg-[#cfc6bb]' : ''}
                                ${cell?.type === 'study' ? 'bg-[#74836e] text-white' : ''}
                                ${cell?.type === 'break' ? 'bg-[#a19988] text-white' : ''}
                              `}>
                                {cell?.type === 'study' && (
                                    <>
                                        <span className="text-2xl">{cell.subject.icon}</span>
                                        <span className="font-semibold">{cell.subject.name[lang]}</span>
                                    </>
                                )}
                                {cell?.type === 'break' && <span className="font-semibold">{content[lang].break}</span>}
                            </div>
                          ))}
                      </React.Fragment>
                  ))}
              </div>
            </div>
             <div className="text-center mt-8">
                <button onClick={() => onComplete(plannerInput)} className="bg-[#458489] hover:bg-[#74836e] text-white font-bold py-3 px-8 rounded-lg text-lg">
                    {content[lang].finish}
                </button>
            </div>
        </div>
    )
  }

  const handleNext = () => {
    if (step === 'subjects') setStep('habits');
    else if (step === 'habits') setStep('schedule');
    else if (step === 'schedule') generatePlan();
  };
  
  const handleBack = () => {
    if (step === 'plan') setStep('schedule');
    else if (step === 'schedule') setStep('habits');
    else if (step === 'habits') setStep('subjects');
    else onComplete(plannerInput); // Back from first step
  }
  
  const isNextDisabled = step === 'subjects' && plannerInput.subjects.length === 0;

  return (
    <div className="max-w-4xl mx-auto">
        {step !== 'plan' ? (
          <div className="p-8 bg-[#a0b2be] rounded-2xl shadow-xl">
              <div className="text-center mb-6">
                  <h1 className="text-4xl font-bold text-white">{content[lang].title}</h1>
              </div>
              <div className="bg-white p-6 rounded-lg">
                  {renderForm()}
              </div>
              <div className="flex justify-between items-center mt-6">
                  <button onClick={handleBack} className="bg-[#74836e] hover:bg-[#a19988] text-white font-bold py-2 px-6 rounded-lg">
                      {content[lang].back}
                  </button>
                  <button onClick={handleNext} disabled={isNextDisabled}
                    className="bg-[#458489] hover:bg-[#74836e] text-white font-bold py-2 px-6 rounded-lg disabled:bg-gray-400">
                    {step === 'schedule' ? content[lang].generate : content[lang].next}
                  </button>
              </div>
          </div>
        ) : renderPlan()}
    </div>
  );
};

export default StudyStrategyBuilder;
