export interface Reading {
  id: string;
  date: string;
  oldTestament: string;
  newTestament: string;
  psalms: string;
  proverbs: string;
  readings: DailyReading[];
  completed: boolean;
}

export interface Progress {
  completedReadings: number;
  totalReadings: number;
  streak: number;
  lastReadDate: string | null;
}

export interface ShareContent {
  text: string;
  reference: string;
}

export interface CompletedReading {
  id: string;
  date: string;
}

export interface ReadingProgress {
  currentDay: number;
  totalDays: number;
  streak: number;
  lastReadDate: string | null;
}

export interface UserSettings {
  theme: "light" | "dark";
  fontSize: "small" | "medium" | "large";
  notifications: boolean;
}

export const STORAGE_KEYS = {
  PROGRESS: "bible_progress",
  COMPLETED_READINGS: "completed_readings",
  SETTINGS: "user_settings",
} as const;

export interface BibleBook {
  id: string;
  name: string;
  url: string;
}

export interface BibleTranslation {
  identifier: string;
  name: string;
  language: string;
  language_code: string;
  books: BibleBook[];
}

export interface TodayReading {
  id: string;
  readings: DailyReading[];
}

export interface SelectedReading {
  book: string;
  reference: string;
  type: DailyReading["type"];
}

export interface ShareContent {
  text: string;
  reference: string;
}

export interface DailyReading {
  book: string;
  startChapter: number;
  endChapter: number;
  type: "old-testament" | "new-testament" | "psalms" | "proverbs";
  reference: string;
}

export const READING_TYPE_LABELS = {
  "old-testament": "Antigo Testamento",
  "new-testament": "Novo Testamento",
  psalms: "Salmos",
  proverbs: "Provérbios",
} as const;

export const READING_TYPE_COLORS = {
  "old-testament": "bg-blue-50 border-blue-200",
  "new-testament": "bg-green-50 border-green-200",
  psalms: "bg-purple-50 border-purple-200",
  proverbs: "bg-yellow-50 border-yellow-200",
} as const;
