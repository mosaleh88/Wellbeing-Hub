import type { Question } from './types';

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 'q-1',
    type: 'mcq',
    question: { 
      en: "When you feel overwhelmed, what is a helpful first step?",
      ar: "عندما تشعر بالإرهاق، ما هي الخطوة الأولى المفيدة؟"
    },
    options: {
      en: [
        'Ignore the feeling and push through.',
        'Take a few slow, deep breaths.',
        'Get angry at the situation.',
        'Worry about all the things you have to do.'
      ],
      ar: [
        'تجاهل الشعور والمضي قدمًا.',
        'خذ بعض الأنفاس البطيئة والعميقة.',
        'الغضب من الموقف.',
        'القلق بشأن كل الأشياء التي يجب عليك القيام بها.'
      ]
    },
    correctAnswer: {
      en: 'Take a few slow, deep breaths.',
      ar: 'خذ بعض الأنفاس البطيئة والعميقة.'
    }
  },
  {
    id: 'q-2',
    type: 'mcq',
    question: {
      en: "What does 'self-compassion' mean?",
      ar: "ماذا يعني 'التعاطف مع الذات'؟"
    },
    options: {
      en: [
        'Feeling sorry for yourself.',
        'Being perfect all the time.',
        'Treating yourself with the same kindness you would a friend.',
      ],
ar: [
        'الشعور بالأسف على نفسك.',
        'أن تكون مثاليًا طوال الوقت.',
        'معاملة نفسك بنفس اللطف الذي تعامل به صديقًا.',
      ]
    },
    correctAnswer: {
      en: 'Treating yourself with the same kindness you would a friend.',
      ar: 'معاملة نفسك بنفس اللطف الذي تعامل به صديقًا.'
    }
  },
  {
    id: 'q-3',
    type: 'reflection',
    question: {
      en: 'Describe a time you felt proud of yourself for how you handled a difficult situation.',
      ar: 'صف مرة شعرت فيها بالفخر بنفسك لكيفية تعاملك مع موقف صعب.'
    },
  },
  {
    id: 'q-4',
    type: 'mcq',
    question: {
      en: "A friend says something unkind to you. What's a constructive response?",
      ar: "صديق يقول لك شيئًا غير لطيف. ما هو الرد البناء؟"
    },
    options: {
      en: [
        'Say something mean back to them.',
        'Pretend it didn\'t happen.',
        'Calmly tell them how their words made you feel.',
      ],
      ar: [
        'رد عليهم بشيء لئيم.',
        'التظاهر بأن شيئًا لم يحدث.',
        'أخبرهم بهدوء كيف جعلتك كلماتهم تشعر.',
      ]
    },
    correctAnswer: {
      en: 'Calmly tell them how their words made you feel.',
      ar: 'أخبرهم بهدوء كيف جعلتك كلماتهم تشعر.'
    }
  },
  {
    id: 'q-5',
    type: 'reflection',
    question: {
      en: 'What is one thing you can do this week to take care of your mental wellbeing?',
      ar: 'ما هو الشيء الواحد الذي يمكنك القيام به هذا الأسبوع للعناية بصحتك النفسية؟'
    },
  },
];