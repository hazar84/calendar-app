export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ru-RU', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() === date2.toDateString();
};

export const generateTimeSlots = (
  startHour: number = 0,
  endHour: number = 24,
  slotDuration: number = 30
): Date[] => {
  const slots: Date[] = [];
  const startDate = new Date();
  startDate.setHours(startHour, 0, 0, 0);
  
  const endDate = new Date();
  endDate.setHours(endHour, 0, 0, 0);
  
  let current = new Date(startDate);
  
  while (current < endDate) {
    slots.push(new Date(current));
    current.setMinutes(current.getMinutes() + slotDuration);
  }
  
  return slots;
};

// ЕДИНЫЙ ПОДХОД для всех функций - конвертация в UTC
const convertToUTC = (date: Date): Date => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
};

export const isTimeInSchedule = (
  time: Date, 
  schedule: Schedule[], 
  currentDay: Date
): boolean => {
  // Создаем полную дату для проверки
  const checkTime = new Date(currentDay);
  checkTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
  
  // Конвертируем checkTime в UTC
  const checkTimeUTC = convertToUTC(checkTime);
  
  return schedule.some(slot => {
    const slotStart = new Date(slot.startTime);
    const slotEnd = new Date(slot.endTime);
    
    // Сравниваем в UTC
    return checkTimeUTC >= slotStart && checkTimeUTC < slotEnd;
  });
};

export const getLessonForTimeSlot = (
  time: Date,
  lessons: Lesson[],
  currentDay: Date
): Lesson | null => {
  const checkTime = new Date(currentDay);
  checkTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
  
  // Конвертируем checkTime в UTC (ТОТ ЖЕ МЕТОД)
  const checkTimeUTC = convertToUTC(checkTime);
  
  return lessons.find(lesson => {
    const lessonStart = new Date(lesson.startTime);
    const lessonEnd = new Date(lesson.endTime);
    
    // Сравниваем в UTC
    return checkTimeUTC >= lessonStart && checkTimeUTC < lessonEnd;
  }) || null;
};

export const isLessonStart = (time: Date, lesson: Lesson | null, day: Date): boolean => {
  if (!lesson) return false;
  
  const lessonStart = new Date(lesson.startTime);
  const checkTime = new Date(day);
  checkTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
  
  // Конвертируем в UTC (ТОТ ЖЕ МЕТОД)
  const checkTimeUTC = convertToUTC(checkTime);
  
  return checkTimeUTC.getTime() === lessonStart.getTime();
};

export interface Schedule {
  startTime: string;
  endTime: string;
}

export interface Lesson {
  id: number;
  duration: number;
  startTime: string;
  endTime: string;
  student: string;
}