import { useState, useEffect } from "react";
import {
  markAsCompleted,
  getCompletedReadings,
} from "../services/storage";
import { CompletedReading } from "../types";

export function useProgress() {
  const [completedReadings, setCompletedReadings] = useState<CompletedReading[]>([]);
  
  useEffect(() => {
    setCompletedReadings(getCompletedReadings());
  }, []);
 
  const completeReading = (readingId: string) => {
    markAsCompleted(readingId);
    setCompletedReadings(getCompletedReadings());
  };
 
  const getCompletedDates = () => {
    return [...new Set(completedReadings.map(reading => reading.date))];
  };
 
  const isCompleted = (id: string) => {
    return completedReadings.some(reading => reading.id === id);
  };
 
  return {
    completedReadings,
    completedDates: getCompletedDates(),
    completeReading,
    isCompleted
  };
 }