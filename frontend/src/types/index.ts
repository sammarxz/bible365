export interface Reading {
  id: string;
  date: string;
  oldTestament: string;
  newTestament: string;
  psalms: string;
  proverbs: string;
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
