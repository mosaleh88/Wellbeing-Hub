import React, { useState } from 'react';

interface Props {
  onLogin: (password: string) => boolean;
  onBack: () => void;
  lang: 'en' | 'ar';
}

const AdminLogin: React.FC<Props> = ({ onLogin, onBack, lang }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const content = {
    en: {
      title: 'Counselor Login',
      passwordLabel: 'Password',
      loginButton: 'Login',
      backButton: 'Back to Home',
      error: 'Incorrect password. Please try again.',
    },
    ar: {
      title: 'دخول المرشد',
      passwordLabel: 'كلمة المرور',
      loginButton: 'دخول',
      backButton: 'العودة للرئيسية',
      error: 'كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.',
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onLogin(password);
    if (!success) {
      setError(content[lang].error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-2xl shadow-lg border border-gray-200 relative">
        <button onClick={onBack} className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm">{content[lang].backButton}</span>
        </button>
        <div className="text-center pt-10">
          <h1 className="text-4xl font-bold text-gray-800">{content[lang].title}</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">{content[lang].passwordLabel}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600 text-center bg-red-100 p-2 rounded-md">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors shadow-lg"
            >
              {content[lang].loginButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;