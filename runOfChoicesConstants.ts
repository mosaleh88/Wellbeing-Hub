import type { RunOfChoicesMilestone } from './types';

export const RUN_OF_CHOICES_MILESTONES: RunOfChoicesMilestone[] = [
  {
    id: 'roc-1',
    distance: 500,
    prompt: {
      en: 'Great focus! What is one common distraction you face when trying to study?',
      ar: 'تركيز رائع! ما هو أحد المشتتات الشائعة التي تواجهها عند محاولة الدراسة؟',
    },
  },
  {
    id: 'roc-2',
    distance: 1500,
    prompt: {
      en: 'You\'re in the zone! What does it feel like when you are fully focused on a task?',
      ar: 'أنت في قمة تركيزك! كيف تشعر عندما تكون مركزًا بالكامل على مهمة ما؟',
    },
  },
  {
    id: 'roc-3',
    distance: 3000,
    prompt: {
      en: 'Amazing stamina! What is one strategy you can use to get back on track after being distracted?',
      ar: 'قدرة تحمل مذهلة! ما هي إحدى الاستراتيجيات التي يمكنك استخدامها للعودة إلى المسار الصحيح بعد تشتيت انتباهك؟',
    },
  },
];