import { useState, useEffect } from 'react';
import { Schedule, Lesson } from '../components/Calendar/types';
import { 
  isTimeInSchedule, 
  addDays 
} from '../utils/dateUtils';

export const useCalendar = (
  startDate: Date,
  schedule: Schedule[],
  view: 'day' | '3days' | 'week'
) => {
  const [currentStartDate, setCurrentStartDate] = useState<Date>(startDate);
  const [timeSlots, setTimeSlots] = useState<Date[]>([]);
  const [days, setDays] = useState<Date[]>([]);

  // Генерируем timeSlots на основе текущей даты
  useEffect(() => {
    const slots = generateTimeSlots();
    setTimeSlots(slots);
  }, []);

  // Правильная генерация слотов
  const generateTimeSlots = (): Date[] => {
    const slots: Date[] = [];
    const baseDate = new Date(2025, 7, 25); // Базовая дата только для времени
    
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = new Date(baseDate);
        time.setHours(hour, minute, 0, 0);
        slots.push(time);
      }
    }
    
    return slots;
  };

  useEffect(() => {
    const daysCount = view === 'week' ? 7 : view === '3days' ? 3 : 1;
    const newDays = Array.from({ length: daysCount }, (_, i) => 
      addDays(currentStartDate, i)
    );
    setDays(newDays);
  }, [currentStartDate, view]);

  const getSlotType = (
    time: Date, 
    day: Date, 
    lesson: Lesson | null
  ): 'available' | 'booked' | 'blocked' => {
    if (lesson) return 'booked';
    if (isTimeInSchedule(time, schedule, day)) return 'available';
    return 'blocked';
  };

  const navigate = (direction: 'prev' | 'next') => {
    const increment = view === 'week' ? 7 : view === '3days' ? 3 : 1;
    const change = direction === 'next' ? increment : -increment;
    setCurrentStartDate(prev => addDays(prev, change));
  };

  return {
    currentStartDate,
    timeSlots,
    days,
    navigate,
    getSlotType
  };
};