import React from 'react';
import AIReport from './AIReport';
import type { StudentData } from '../types';

interface Props {
  studentData: StudentData | null;
  onReset: () => void;
  lang: 'en' | 'ar';
}

const CompletionPage: React.FC<Props> = ({ studentData, onReset, lang }) => {
  const hasEnoughDataForReport = studentData && (studentData.quizAnswers || studentData.moodBoard || studentData.decisionPath);

  if (hasEnoughDataForReport) {
    return <AIReport studentData={studentData} onReset={onReset} lang={lang} />;
  }

  // Fallback if no data for a report
  const content = {
    en: {
      title: 'Well Done!',
      message: 'You have completed the session. Your reflections have been saved.',
      button: 'Back to Home',
    },
    ar: {
      title: 'أحسنت!',
      message: 'لقد أكملت الجلسة. تم حفظ تأملاتك.',
      button: 'العودة إلى الرئيسية',
    },
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] text-center">
      <div className="p-10 bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="text-7xl mb-4">🎉</div>
        <h1 className="text-4xl font-bold text-gray-800">{content[lang].title}</h1>
        <p className="mt-2 text-lg text-gray-600">{content[lang].message}</p>
        <button
          onClick={onReset}
          className="mt-8 px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {content[lang].button}
        </button>
      </div>
    </div>
  );
};

export default CompletionPage;