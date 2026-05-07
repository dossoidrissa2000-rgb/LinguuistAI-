export type UserProfile = 'kids' | 'adults' | 'professionals';
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface Lesson {
  id: string;
  title: string;
  level: CEFRLevel;
  type: 'grammar' | 'vocabulary' | 'listening' | 'speaking';
  completed: boolean;
}

export interface UserState {
  profile: UserProfile;
  level: CEFRLevel;
  xp: number;
  streak: number;
  currentLessonId?: string;
}

export interface VocabularyWord {
  word: string;
  definition: string;
  example: string;
  phonetic: string;
}
