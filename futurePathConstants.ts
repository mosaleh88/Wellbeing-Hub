import type { FuturePathNode } from './types';

export const FUTURE_PATH_NODES: FuturePathNode[] = [
  // Start Node
  {
    id: 'START',
    type: 'interest',
    icon: '🌟',
    text: {
      en: 'What gives you energy? Choose an area that sparks your interest.',
      ar: 'ما الذي يمنحك الطاقة؟ اختر مجالًا يثير اهتمامك.',
    },
    choices: [
      { text: { en: 'Solving complex problems', ar: 'حل المشاكل المعقدة' }, nextId: 'problems_path' },
      { text: { en: 'Expressing creativity', ar: 'التعبير عن الإبداع' }, nextId: 'creative_path' },
      { text: { en: 'Understanding and helping people', ar: 'فهم ومساعدة الناس' }, nextId: 'people_path' },
      { text: { en: 'Building a better future for the UAE', ar: 'بناء مستقبل أفضل للإمارات' }, nextId: 'uae_path' },
    ],
  },
  
  // --- PROBLEMS PATH ---
  {
    id: 'problems_path',
    type: 'path',
    icon: '🧩',
    text: {
      en: 'You enjoy a good challenge! Do you prefer working with technology or with nature and the environment?',
      ar: 'أنت تستمتع بالتحدي الجيد! هل تفضل العمل مع التكنولوجيا أم مع الطبيعة والبيئة؟',
    },
    choices: [
      { text: { en: 'Technology!', ar: 'التكنولوجيا!' }, nextId: 'ai_outcome' },
      { text: { en: 'Nature!', ar: 'الطبيعة!' }, nextId: 'enviro_outcome' },
    ],
  },
  {
    id: 'ai_outcome',
    type: 'outcome',
    icon: '🤖',
    text: { en: 'AI & Robotics Specialist', ar: 'متخصص في الذكاء الاصطناعي والروبوتات' },
    message: {
      en: 'You can design solutions for the future, from smart cities to healthcare tech. Your logical mind can solve big-world problems.',
      ar: 'يمكنك تصميم حلول للمستقبل، من المدن الذكية إلى تكنولوجيا الرعاية الصحية. عقلك المنطقي يمكنه حل مشاكل العالم الكبيرة.',
    },
  },
  {
    id: 'enviro_outcome',
    type: 'outcome',
    icon: '🌍',
    text: { en: 'Environmental Scientist', ar: 'عالم بيئي' },
    message: {
      en: 'You can work to protect our planet, finding sustainable solutions for energy, water, and conservation. Your work makes a tangible impact.',
      ar: 'يمكنك العمل لحماية كوكبنا، وإيجاد حلول مستدامة للطاقة والمياه والحفاظ على البيئة. عملك له تأثير ملموس.',
    },
  },

  // --- CREATIVE PATH ---
  {
    id: 'creative_path',
    type: 'path',
    icon: '🎨',
    text: {
      en: 'Your imagination is your strength! Do you like creating immersive worlds or designing beautiful experiences?',
      ar: 'خيالك هو قوتك! هل تحب إنشاء عوالم غامرة أم تصميم تجارب جميلة؟',
    },
    choices: [
      { text: { en: 'Immersive worlds!', ar: 'عوالم غامرة!' }, nextId: 'gamedev_outcome' },
      { text: { en: 'Beautiful experiences!', ar: 'تجارب جميلة!' }, nextId: 'ux_outcome' },
    ],
  },
  {
    id: 'gamedev_outcome',
    type: 'outcome',
    icon: '🎮',
    text: { en: 'Game Developer / VR Designer', ar: 'مطور ألعاب / مصمم واقع افتراضي' },
    message: {
      en: 'You can build entire universes for people to explore! Your creativity brings joy and new perspectives to others.',
      ar: 'يمكنك بناء أكوان كاملة ليستكشفها الناس! إبداعك يجلب الفرح ووجهات نظر جديدة للآخرين.',
    },
  },
   {
    id: 'ux_outcome',
    type: 'outcome',
    icon: '📱',
    text: { en: 'User Experience (UX) Designer', ar: 'مصمم تجربة المستخدم' },
    message: {
      en: 'You can make technology feel effortless and enjoyable to use. You blend psychology and art to make people\'s digital lives better.',
      ar: 'يمكنك أن تجعل التكنولوجيا سهلة وممتعة للاستخدام. أنت تمزج بين علم النفس والفن لجعل حياة الناس الرقمية أفضل.',
    },
  },

  // --- PEOPLE PATH ---
  {
    id: 'people_path',
    type: 'path',
    icon: '❤️',
    text: {
      en: 'Empathy is a superpower. Do you prefer to help people navigate their feelings or achieve their learning goals?',
      ar: 'التعاطف قوة خارقة. هل تفضل مساعدة الناس في التعامل مع مشاعرهم أم تحقيق أهدافهم التعليمية؟',
    },
    choices: [
      { text: { en: 'Navigating feelings', ar: 'التعامل مع المشاعر' }, nextId: 'counsellor_outcome' },
      { text: { en: 'Achieving goals', ar: 'تحقيق الأهداف' }, nextId: 'teacher_outcome' },
    ],
  },
  {
    id: 'counsellor_outcome',
    type: 'outcome',
    icon: '🧠',
    text: { en: 'Psychologist / Counsellor', ar: 'طبيب نفسي / مرشد' },
    message: {
      en: 'You can provide support and guidance, helping people build resilience and mental strength. It\'s a deeply rewarding path.',
      ar: 'يمكنك تقديم الدعم والتوجيه، ومساعدة الناس على بناء المرونة والقوة العقلية. إنه مسار مجزٍ للغاية.',
    },
  },
  {
    id: 'teacher_outcome',
    type: 'outcome',
    icon: '👨‍🏫',
    text: { en: 'Innovative Educator', ar: 'مربي مبتكر' },
    message: {
      en: 'You can inspire curiosity and a love of learning in others. You don\'t just teach subjects, you shape future leaders and thinkers.',
      ar: 'يمكنك إلهام الفضول وحب التعلم لدى الآخرين. أنت لا تدرس المواد فحسب، بل تشكل قادة ومفكرين المستقبل.',
    },
  },

  // --- UAE VISION PATH ---
  {
    id: 'uae_path',
    type: 'path',
    icon: '🇦🇪',
    text: {
      en: 'Excellent! To contribute to the UAE\'s vision, are you drawn more to shaping its cultural story or its technological future?',
      ar: 'ممتاز! للمساهمة في رؤية الإمارات، هل تنجذب أكثر إلى تشكيل قصتها الثقافية أم مستقبلها التكنولوجي؟',
    },
    choices: [
      { text: { en: 'Cultural story', ar: 'القصة الثقافية' }, nextId: 'culture_outcome' },
      { text: { en: 'Technological future', ar: 'المستقبل التكنولوجي' }, nextId: 'space_outcome' },
    ],
  },
   {
    id: 'culture_outcome',
    type: 'outcome',
    icon: '🏛️',
    text: { en: 'Cultural Heritage Manager', ar: 'مدير التراث الثقافي' },
    message: {
      en: 'You can work to preserve and promote the rich history and arts of the UAE, creating meaningful experiences in museums, galleries, and cultural sites.',
      ar: 'يمكنك العمل للحفاظ على تاريخ وفنون الإمارات الغنية والترويج لها، وخلق تجارب ذات مغزى في المتاحف والمعارض والمواقع الثقافية.',
    },
  },
  {
    id: 'space_outcome',
    type: 'outcome',
    icon: '🚀',
    text: { en: 'Space Sector Engineer', ar: 'مهندس في قطاع الفضاء' },
    message: {
      en: 'You can be part of the UAE\'s ambitious space program, working on missions to Mars and beyond. Your work pushes the boundaries of human knowledge.',
      ar: 'يمكنك أن تكون جزءًا من برنامج الفضاء الطموح لدولة الإمارات، وتعمل في مهام إلى المريخ وما بعده. عملك يدفع حدود المعرفة البشرية.',
    },
  },
];