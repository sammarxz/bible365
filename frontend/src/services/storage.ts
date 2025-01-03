import { CompletedReading, ReadingProgress, STORAGE_KEYS } from "../types";

 
 export function saveProgress(data: ReadingProgress): void {
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(data));
 }
 
 export function getProgress(): ReadingProgress | null {
  const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  return data ? JSON.parse(data) : null;
 }
 
 export function markAsCompleted(readingId: string): void {
  const completed = getCompletedReadings();
  const today = new Date().toISOString().split('T')[0];
  
  completed.push({
    id: readingId,
    date: today
  });
  
  localStorage.setItem(STORAGE_KEYS.COMPLETED_READINGS, JSON.stringify(completed));
 }
 
 export function getCompletedReadings(): CompletedReading[] {
  const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_READINGS);
  return data ? JSON.parse(data) : [];
 }