import type { MoodBoardIcon } from './types';

export const MOOD_BOARD_ICONS: MoodBoardIcon[] = [
  { id: 'mb-1', icon: '😊', label: { en: 'Happy', ar: 'سعيد' } },
  { id: 'mb-2', icon: '😔', label: { en: 'Sad', ar: 'حزين' } },
  { id: 'mb-3', icon: '😠', label: { en: 'Frustrated', ar: 'محبط' } },
  { id: 'mb-4', icon: '😟', label: { en: 'Worried', ar: 'قلق' } },
  { id: 'mb-5', icon: '😴', label: { en: 'Tired', ar: 'متعب' } },
  { id: 'mb-6', icon: '🤩', label: { en: 'Excited', ar: 'متحمس' } },
  { id: 'mb-7', icon: '🧘', label: { en: 'Calm', ar: 'هادئ' } },
  { id: 'mb-8', icon: '💡', label: { en: 'Creative', ar: 'مبدع' } },
  // FIX: Removed duplicate 'icon' property.
  { id: 'mb-9', icon: '🤯', label: { en: 'Overwhelmed', ar: 'مضغوط' } },
  { id: 'mb-10', icon: '🤔', label: { en: 'Thoughtful', ar: 'متأمل' } },
];