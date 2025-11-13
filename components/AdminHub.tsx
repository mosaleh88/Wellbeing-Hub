import React from 'react';

type AdminPage = 'manage-content' | 'reports-dashboard';

interface Props {
  onNavigate: (page: AdminPage) => void;
  onLogout: () => void;
  lang: 'en' | 'ar';
}

const AdminHub: React.FC<Props> = ({ onNavigate, onLogout, lang }) => {
  const content = {
    en: {
      title: 'Counselor Dashboard',
      manageContent: 'Manage Activity Content',
      manageContentDesc: 'Edit the questions, prompts, and scenarios for all student activities.',
      viewReports: 'View Student Reports',
      viewReportsDesc: 'Review student data and generate AI-powered wellbeing feedback.',
      logout: 'Logout',
    },
    ar: {
      title: 'لوحة تحكم المرشد',
      manageContent: 'إدارة محتوى الأنشطة',
      manageContentDesc: 'تعديل الأسئلة والنصوص والسيناريوهات لجميع أنشطة الطلاب.',
      viewReports: 'عرض تقارير الطلاب',
      viewReportsDesc: 'مراجعة بيانات الطلاب وإنشاء تقارير السلامة النفسية المدعومة بالذكاء الاصطناعي.',
      logout: 'تسجيل الخروج',
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">{content[lang].title}</h1>
        <button onClick={onLogout} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg">
          {content[lang].logout}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Manage Content Card */}
        <button
          onClick={() => onNavigate('manage-content')}
          className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-left border-2 border-transparent hover:border-indigo-500"
        >
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{content[lang].manageContent}</h2>
          <p className="text-gray-600">{content[lang].manageContentDesc}</p>
        </button>

        {/* View Reports Card */}
        <button
          onClick={() => onNavigate('reports-dashboard')}
          className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-left border-2 border-transparent hover:border-emerald-500"
        >
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{content[lang].viewReports}</h2>
          <p className="text-gray-600">{content[lang].viewReportsDesc}</p>
        </button>
      </div>
    </div>
  );
};

export default AdminHub;