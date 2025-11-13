import type { StudySubject, StudyQuote } from './types';

export const DEFAULT_STUDY_SUBJECTS: StudySubject[] = [
  { id: 'subj-1', name: { en: 'Mathematics', ar: 'الرياضيات' }, icon: '🧮' },
  { id: 'subj-2', name: { en: 'Science', ar: 'العلوم' }, icon: '🔬' },
  { id: 'subj-3', name: { en: 'English', ar: 'اللغة الإنجليزية' }, icon: '📖' },
  { id: 'subj-4', name: { en: 'Arabic', ar: 'اللغة العربية' }, icon: '📝' },
  { id: 'subj-5', name: { en: 'History', ar: 'التاريخ' }, icon: '🏛️' },
  { id: 'subj-6', name: { en: 'Art', ar: 'الفنون' }, icon: '🎨' },
  { id: 'subj-7', name: { en: 'Social Studies', ar: 'الدراسات الاجتماعية' }, icon: '🌍' },
  { id: 'subj-8', name: { en: 'Islamic Studies', ar: 'الدراسات الإسلامية'}, icon: '🕌' },
];

export const DEFAULT_STUDY_QUOTES: StudyQuote[] = [
  { id: 'quote-1', text: { en: 'Focus on progress, not perfection. Every step forward counts.', ar: 'ركز على التقدم، وليس على الكمال. كل خطوة إلى الأمام مهمة.' } },
  { id: 'quote-2', text: { en: 'Rest is just as important as work. Take breaks to recharge.', ar: 'الراحة لا تقل أهمية عن العمل. خذ فترات راحة لإعادة شحن طاقتك.' } },
  { id: 'quote-3', text: { en: 'You are capable of amazing things. Believe in yourself.', ar: 'أنت قادر على تحقيق أشياء مذهلة. ثق بنفسك.' } },
  { id: 'quote-4', text: { en: 'The goal is to understand, not just to memorize.', ar: 'الهدف هو الفهم، وليس الحفظ فقط.' } },
  { id: 'quote-5', text: { en: 'Don\'t be afraid to ask for help. It\'s a sign of strength.', ar: 'لا تخف من طلب المساعدة. إنها علامة قوة.' } },
];