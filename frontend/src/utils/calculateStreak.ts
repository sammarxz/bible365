export function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  
  const today = new Date().toISOString().split('T')[0];
  const lastReadDate = dates[dates.length - 1];

  if (lastReadDate !== today) {
    return 0;
  }

  let streak = 1;
  for (let i = dates.length - 2; i >= 0; i--) {
    const currentDate = new Date(dates[i]);
    const nextDate = new Date(dates[i + 1]);
    
    const diffTime = nextDate.getTime() - currentDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
