import type { Habit } from './types';

export const HABIT_BUILDER_CHALLENGES: Habit[] = [
  {
    id: 'habit-1',
    prompt: {
      en: 'Journal for 5 minutes each day to reflect on your thoughts and feelings.',
      ar: 'اكتب في دفتر يومياتك لمدة 5 دقائق كل يوم للتفكير في أفكارك ومشاعرك.'
    },
    days: 21,
  },
  {
    id: 'habit-2',
    prompt: {
        en: 'Practice 3 minutes of mindful breathing when you wake up.',
        ar: 'مارس 3 دقائق من التنفس الواعي عند الاستيقاظ.'
    },
    days: 21,
  },
  {
    id: 'habit-3',
    prompt: {
        en: 'Write down one thing you are grateful for before bed.',
        ar: 'اكتب شيئًا واحدًا أنت ممتن له قبل النوم.'
    },
    days: 21,
  }
];