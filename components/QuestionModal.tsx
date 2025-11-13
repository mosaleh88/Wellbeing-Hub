import React, { useState } from 'react';

interface QuestionModalProps {
  prompt: string;
  onSubmit: (answer: string) => void;
  lang: 'en' | 'ar';
}

const QuestionModal: React.FC<QuestionModalProps> = ({ prompt, onSubmit, lang }) => {
  const [answer, setAnswer] = useState('');

  const content = {
    en: {
      title: 'Reflection Time',
      submit: 'Submit Answer',
      placeholder: 'Your thoughts here...',
    },
    ar: {
      title: 'وقت التأمل',
      submit: 'إرسال الإجابة',
      placeholder: 'أفكارك هنا...',
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onSubmit(answer);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-indigo-300 transform scale-95 animate-modal-pop-in w-full max-w-lg">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 text-center">{content[lang].title}</h2>
          <p className="text-lg text-gray-700 mb-6 text-center" dir="auto">{prompt}</p>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50 min-h-[120px]"
            rows={4}
            dir="auto"
            placeholder={content[lang].placeholder}
            required
            aria-label="Your answer to the reflection prompt"
          />
          <div className="mt-6 text-center">
            <button
              type="submit"
              disabled={!answer.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              {content[lang].submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionModal;
