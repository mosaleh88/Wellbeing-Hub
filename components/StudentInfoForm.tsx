import React, { useState } from 'react';
import type { StudentInfo } from '../types';

interface Props {
  onSubmit: (info: StudentInfo) => void;
  lang: 'en' | 'ar';
}

const StudentInfoForm: React.FC<Props> = ({ onSubmit, lang }) => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');

  const content = {
    en: {
      title: 'Let\'s Get Started',
      subtitle: 'Please enter your information to begin your session.',
      nameLabel: 'Your Name',
      gradeLabel: 'Your Grade',
      submitButton: 'Start Activities',
    },
    ar: {
      title: 'لنبدأ',
      subtitle: 'الرجاء إدخال معلوماتك لبدء جلستك.',
      nameLabel: 'اسمك',
      gradeLabel: 'صفك الدراسي',
      submitButton: 'بدء الأنشطة',
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && grade.trim()) {
      onSubmit({ name, grade });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">{content[lang].title}</h1>
          <p className="mt-2 text-gray-600">{content[lang].subtitle}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">{content[lang].nameLabel}</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700">{content[lang].gradeLabel}</label>
            <input
              id="grade"
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-4 py-3 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-lg"
            >
              {content[lang].submitButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentInfoForm;