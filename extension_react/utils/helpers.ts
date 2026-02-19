export function getTodayOpeningHours(opening_hours: any) {
  if (!opening_hours || !opening_hours.weekday_text) return 'Keine Öffnungszeiten verfügbar';
  
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const dayIndex = today === 0 ? 6 : today - 1; // Convert to weekday_text index (Monday = 0)
  
  return opening_hours.weekday_text[dayIndex] || 'Keine Öffnungszeiten verfügbar';
}

export function isOpenNow(opening_hours: any) {
  return opening_hours && opening_hours.open_now === true;
}

export function getDistanceValue(distanceString: string) {
  if (!distanceString) return Infinity;
  const match = distanceString.match(/([\d.]+)\s*(km|m)/);
  if (!match) return Infinity;
  const value = parseFloat(match[1]);
  const unit = match[2];
  return unit === 'km' ? value : value / 1000; // Convert to km for consistent comparison
}

// TODO: Improve
export function getTimeUntilOpening(opening_hours: any) {
  if (!opening_hours || !opening_hours.periods) {
    return 'Geschlossen';
  }

  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const currentTime = now.getHours() * 100 + now.getMinutes(); // e.g., 1430 for 14:30

  // Try to find next opening in the same day or upcoming days
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const checkDay = (currentDay + dayOffset) % 7;
    
    const periodsForDay = opening_hours.periods.filter((p: any) => p.open.day === checkDay);
    
    for (const period of periodsForDay) {
      const openTime = parseInt(period.open.hour * 100 + period.open.minute);
      
      // If it's today and opening time is in the future
      if (dayOffset === 0 && openTime > currentTime) {
        const openHour = Math.floor(openTime / 100);
        const openMinute = openTime % 100;
        
        const openDate = new Date(now);
        openDate.setHours(openHour, openMinute, 0, 0);
        
        const diffMs = openDate.getTime() - now.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMinutes / 60);
        const remainingMinutes = diffMinutes % 60;
        
        if (diffHours > 0) {
          return `Öffnet in ${diffHours}h ${remainingMinutes}min`;
        } else {
          return `Öffnet in ${diffMinutes}min`;
        }
      }
      
      // If it's a future day
      if (dayOffset > 0) {
        const dayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
        const openHour = Math.floor(openTime / 100);
        const openMinute = openTime % 100;
        const timeStr = `${String(openHour).padStart(2, '0')}:${String(openMinute).padStart(2, '0')}`;
        console.log({openHour, openMinute, timeStr, openTime});
        
        if (dayOffset === 1) {
          return `Öffnet morgen um ${timeStr}`;
        } else {
          return `Öffnet ${dayNames[checkDay]} um ${timeStr}`;
        }
      }
    }
  }
  
  return 'Geschlossen';
}
