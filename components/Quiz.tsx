import React, { useState } from 'react';
import type { QuizAnswer, StudentInfo, Question } from '../types';

interface Props {
  questions: Question[];
  onComplete: (answers: QuizAnswer[]) => void;
  lang: 'en' | 'ar';
  studentInfo?: StudentInfo;
}

const Quiz: React.FC<Props> = ({ questions, onComplete, lang, studentInfo }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [reflectionAnswer, setReflectionAnswer] = useState('');
  
  const content = {
      en: { title: "Wellbeing Quiz", next: "Next", submit: "Submit & Finish", back: "Back to Activities", welcome: "Player", reflectionPlaceholder: "Take a moment to reflect..." },
      ar: { title: "اختبار السلامة النفسية", next: "التالي", submit: "إرسال وإنهاء", back: "العودة إلى الأنشطة", welcome: "لاعب", reflectionPlaceholder: "خذ لحظة للتفكير..." }
  };
  
  if (questions.length === 0) {
    return (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-red-600">No Questions Available</h2>
            <p className="text-gray-600 mt-2">Please ask a counsellor to configure the questions in the admin panel.</p>
            <button onClick={() => onComplete([])} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md">
                {content[lang].back}
            </button>
        </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = () => {
    let newAnswer: QuizAnswer;
    if (currentQuestion.type === 'mcq') {
      if (selectedOption === null) return;
      newAnswer = {
        question: currentQuestion.question,
        answer: selectedOption,
        isCorrect: selectedOption === currentQuestion.correctAnswer![lang],
      };
    } else {
      if (reflectionAnswer.trim() === '') return;
      newAnswer = {
        question: currentQuestion.question,
        answer: reflectionAnswer,
      };
    }

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setSelectedOption(null);
    setReflectionAnswer('');

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete(updatedAnswers);
    }
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const canProceed = (currentQuestion.type === 'mcq' && selectedOption !== null) || (currentQuestion.type === 'reflection' && reflectionAnswer.trim() !== '');

  return (
    <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <button onClick={() => onComplete(answers)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors">
                &larr; {content[lang].back}
            </button>
            <div className="text-lg font-semibold text-gray-600">{content[lang].welcome}: {studentInfo?.name}</div>
        </div>
        <div className="p-6 sm:p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">{content[lang].title}</h1>
            <p className="text-center text-gray-500 mb-6">Question {currentQuestionIndex + 1} of {questions.length}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
                <div className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
            </div>

            <div className="min-h-[250px] animate-fade-in">
                <h2 className="text-xl font-semibold mb-6 text-gray-800" dir="auto">{currentQuestion.question[lang]}</h2>
                {currentQuestion.type === 'mcq' && (
                    <div className="space-y-3">
                        {currentQuestion.options![lang].map((option, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedOption(option)}
                                className={`w-full text-left p-4 rounded-lg transition-all duration-200 border-2 ${selectedOption === option ? 'bg-indigo-100 border-indigo-500 text-indigo-800 shadow-md' : 'bg-white hover:bg-gray-50 border-gray-200'}`}
                                dir="auto"
                            >
                                <span className="font-semibold">{option}</span>
                            </button>
                        ))}
                    </div>
                )}
                {currentQuestion.type === 'reflection' && (
                    <textarea
                        value={reflectionAnswer}
                        onChange={(e) => setReflectionAnswer(e.target.value)}
                        className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50"
                        rows={5}
                        dir="auto"
                        placeholder={content[lang].reflectionPlaceholder}
                    />
                )}
            </div>
            
            <div className="mt-8 text-center">
                <button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-12 rounded-lg text-lg transition-all duration-300 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    {isLastQuestion ? content[lang].submit : content[lang].next}
                </button>
            </div>
        </div>
    </div>
  );
};

export default Quiz;